import pb from "./pocketbase";

// 获取用户的头像配置
export const getUserAvatar = async (userId) => {
  try {
    const records = await pb.collection("avatar").getList(1, 1, {
      filter: `user="${userId}"`,
    });
    
    if (records.items.length > 0) {
      return records.items[0];
    }
    return null;
  } catch (error) {
    console.error("获取用户头像配置失败:", error);
    return null;
  }
};

// 保存用户的头像配置
export const saveUserAvatar = async (userId, customizationData) => {
  try {
    // 先检查用户是否已有配置
    const existingAvatar = await getUserAvatar(userId);
    
    if (existingAvatar) {
      // 更新现有记录
      return await pb.collection("avatar").update(existingAvatar.id, {
        user: userId,
        data: customizationData,
      });
    } else {
      // 创建新记录
      return await pb.collection("avatar").create({
        user: userId,
        data: customizationData,
      });
    }
  } catch (error) {
    console.error("保存用户头像配置失败:", error);
    throw error;
  }
};