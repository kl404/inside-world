import { create } from "zustand";
import PocketBase from "pocketbase";
import { Color, MeshStandardMaterial } from "three";
import { randInt } from "three/src/math/MathUtils.js";

const pocketBaseUrl = "http://127.0.0.1:8090";
if (!pocketBaseUrl) {
  throw new Error("VITE_POCKETBASE_URL is required");
}

export type PhotoPoseType =
  | "Idle"
  | "Chill"
  | "Cool"
  | "Punch"
  | "Ninja"
  | "King"
  | "Busy";
export type UIModeType = "photo" | "customize";

export const PHOTO_POSES: Record<PhotoPoseType, PhotoPoseType> = {
  Idle: "Idle",
  Chill: "Chill",
  Cool: "Cool",
  Punch: "Punch",
  Ninja: "Ninja",
  King: "King",
  Busy: "Busy",
};

export const UI_MODES: Record<string, UIModeType> = {
  PHOTO: "photo",
  CUSTOMIZE: "customize",
};

export interface Asset {
  id: string;
  name: string;
  url: string;
  group: string;
  lockedGroups?: string[];
}

export interface Category {
  id: string;
  name: string;
  assets: Asset[];
  position: number;
  removable?: boolean;
  startingAsset?: string;
  expand?: {
    colorPalette?: {
      colors: string[];
    };
    cameraPlacement?: any;
  };
}

export interface Customization {
  [key: string]: {
    asset?: Asset | null;
    color: string;
  };
}

export interface LockedGroupInfo {
  name: string;
  categoryName: string;
}

export interface ConfiguratorState {
  loading: boolean;
  mode: UIModeType;
  setMode: (mode: UIModeType) => void;
  pose: PhotoPoseType;
  setPose: (pose: PhotoPoseType) => void;
  categories: Category[];
  currentCategory: Category | null;
  assets: Asset[];
  lockedGroups: Record<string, LockedGroupInfo[]>;
  skin: MeshStandardMaterial;
  customization: Customization;
  screenshot: () => void;
  setScreenshot: (screenshot: () => void) => void;
  updateColor: (color: string) => void;
  updateSkin: (color: string) => void;
  fetchCategories: () => Promise<void>;
  setCurrentCategory: (category: Category) => void;
  changeAsset: (category: string, asset: Asset | null) => void;
  randomize: () => void;
  applyLockedAssets: () => void;
}

export const pb = new PocketBase(pocketBaseUrl);

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
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
      expand: "colorPalette,cameraPlacement",
    });
    const assets = await pb.collection("CustomizationAssets").getFullList({
      sort: "+created",
    });
    const customization: Customization = {};
    categories.forEach((category: any) => {
      category.assets = assets.filter(
        (asset: any) => asset.group === category.id
      );
      customization[category.name] = {
        color: category.expand?.colorPalette?.colors?.[0] || "",
      };
      if (category.startingAsset) {
        customization[category.name].asset = category.assets.find(
          (asset: any) => asset.id === category.startingAsset
        );
      }
    });

    set({
      categories: categories as Category[],
      currentCategory: categories[0] as Category,
      assets: assets as Asset[],
      customization,
      loading: false,
    });
    get().applyLockedAssets();
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
    const customization: Customization = {};
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
    const lockedGroups: Record<string, LockedGroupInfo[]> = {};

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

useConfiguratorStore.getState().fetchCategories();
