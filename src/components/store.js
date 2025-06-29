import { create } from "zustand";
import PocketBase from "pocketbase";
import { Color, MeshStandardMaterial } from "three";
import { randInt } from "three/src/math/MathUtils.js";
import { saveUserAvatar, getUserAvatar } from "../api/avatarService";

const pocketBaseUrl = "http://127.0.0.1:8090";
if (!pocketBaseUrl) {
  throw new Error("VITE_POCKETBASE_URL is required");
}

export const PHOTO_POSES = {
  Idle: "Idle",
  Chill: "Chill",
  Cool: "Cool",
  Punch: "Punch",
  Ninja: "Ninja",
  King: "King",
  Busy: "Busy",
};

export const UI_MODES = {
  PHOTO: "photo",
  CUSTOMIZE: "customize",
};

export const pb = new PocketBase(pocketBaseUrl);

export const useConfiguratorStore = create((set, get) => ({
  loading: true,
  mode: UI_MODES.CUSTOMIZE,
  setMode: (mode) => {
    set({ mode });
    if (mode === UI_MODES.CUSTOMIZE) {
      set({ pose: PHOTO_POSES.Idle });
    }
  },
  pose: PHOTO_POSES.Idle,
  setPose: (pose) => set({ pose }),
  categories: [],
  currentCategory: null,
  assets: [],
  lockedGroups: {},
  skin: new MeshStandardMaterial({ color: 0xf5c6a5, roughness: 1 }),
  customization: {},
  screenshot: () => {},
  setScreenshot: (screenshot) => set({ screenshot }),
  updateColor: (color) => {
    set((state) => ({
      customization: {
        ...state.customization,
        [state.currentCategory?.name || ""]: {
          ...state.customization[state.currentCategory?.name || ""],
          color,
        },
      },
    }));
    if (get().currentCategory?.name === "Head") {
      get().updateSkin(color);
    }
  },
  updateSkin: (color) => {
    get().skin.color.set(color);
  },
  fetchCategories: async () => {
    // you can also fetch all records at once via getFullList
    const categories = await pb.collection("CustomizationGroups").getFullList({
      sort: "+position",
      expand: "colorPalette",
    });
    console.log(categories, "categories")
    const assets = await pb.collection("CustomizationAssets").getFullList({
      sort: "+created",
    });
    const customization = {};
    categories.forEach((category) => {
      category.assets = assets.filter((asset) => asset.group === category.id);
      customization[category.name] = {
        color: category.expand?.colorPalette?.colors?.[0] || "",
      };
      if (category.startingAsset) {
        customization[category.name].asset = category.assets.find(
          (asset) => asset.id === category.startingAsset
        );
      }
    });

    set({
      categories: categories,
      currentCategory: categories[0],
      assets: assets,
      customization,
      loading: false,
    });
    get().applyLockedAssets();
  },

  // 加载用户自定义头像配置
  loadUserAvatar: async (userId) => {
    if (!userId) return;

    try {
      const userAvatar = await getUserAvatar(userId);

      if (userAvatar && userAvatar.data) {
        // 检查 data 是否为字符串，如果是则解析，否则直接使用
        const customizationData =
          typeof userAvatar.data === "string"
            ? JSON.parse(userAvatar.data)
            : userAvatar.data;

        set({ customization: customizationData });
        // 更新皮肤颜色
        const headCategory = get().categories.find(
          (cat) => cat.name === "Head"
        );
        if (headCategory && get().customization[headCategory.name]?.color) {
          get().updateSkin(get().customization[headCategory.name].color);
        }
        get().applyLockedAssets();
      }
    } catch (error) {
      console.error("加载用户头像配置失败:", error);
    }
  },

  // 保存用户自定义头像配置
  saveUserAvatar: async (userId) => {
    if (!userId) return;

    try {
      // 确保将对象转换为JSON字符串
      const customizationData = JSON.stringify(get().customization);
      await saveUserAvatar(userId, customizationData);
      return true;
    } catch (error) {
      console.error("保存用户头像配置失败:", error);
      return false;
    }
  },

  setCurrentCategory: (category) => set({ currentCategory: category }),
  changeAsset: (category, asset) => {
    set((state) => ({
      customization: {
        ...state.customization,
        [category]: {
          ...state.customization[category],
          asset,
        },
      },
    }));
    get().applyLockedAssets();
  },
  randomize: () => {
    const customization = {};
    get().categories.forEach((category) => {
      let randomAsset = category.assets[randInt(0, category.assets.length - 1)];
      if (category.removable) {
        if (randInt(0, category.assets.length - 1) === 0) {
          randomAsset = null;
        }
      }
      const randomColor =
        category.expand?.colorPalette?.colors?.[
          randInt(0, (category.expand?.colorPalette?.colors.length || 1) - 1)
        ];
      customization[category.name] = {
        asset: randomAsset,
        color: randomColor,
      };
      if (category.name === "Head") {
        get().updateSkin(randomColor);
      }
    });
    set({ customization });
    get().applyLockedAssets();
  },

  applyLockedAssets: () => {
    const customization = get().customization;
    const categories = get().categories;
    const lockedGroups = {};

    Object.values(customization).forEach((category) => {
      if (category.asset?.lockedGroups) {
        category.asset.lockedGroups.forEach((group) => {
          const foundCategory = categories.find(
            (category) => category.id === group
          );
          if (foundCategory) {
            const categoryName = foundCategory.name;
            if (!lockedGroups[categoryName]) {
              lockedGroups[categoryName] = [];
            }
            if (category.asset) {
              const lockingCategory = categories.find(
                (cat) => cat.id === category.asset?.group
              );
              if (lockingCategory) {
                const lockingAssetCategoryName = lockingCategory.name;
                lockedGroups[categoryName].push({
                  name: category.asset.name,
                  categoryName: lockingAssetCategoryName,
                });
              }
            }
          }
        });
      }
    });

    set({ lockedGroups });
  },
}));

// useConfiguratorStore.getState().fetchCategories();
