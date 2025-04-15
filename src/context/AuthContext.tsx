import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import pb from "../api/pocketbase";
import { ClientResponseError } from "pocketbase";

// 定义用户类型
interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  avatar?: string;
  created?: string;
  updated?: string;
}

// 定义认证上下文类型
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  signup: (
    email: string,
    password: string,
    passwordConfirm: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(
    pb.authStore.model as User | null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = pb.authStore.isValid;

  // 监听认证状态变化
  useEffect(() => {
    // 当auth状态改变时更新用户信息
    const unsubscribe = pb.authStore.onChange(() => {
      setCurrentUser(pb.authStore.model as User | null);
    });

    return unsubscribe;
  }, []);

  // 注册
  const signup = useCallback(
    async (email: string, password: string, passwordConfirm: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // 创建用户
        const data = {
          email,
          password,
          passwordConfirm,
        };
        await pb.collection("users").create(data);

        // 注册后自动登录
        await pb.collection("users").authWithPassword(email, password);
      } catch (error: unknown) {
        const pbError = error as ClientResponseError;
        setError(pbError.message || "注册失败");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 登录
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await pb.collection("users").authWithPassword(email, password);
    } catch (error: unknown) {
      const pbError = error as ClientResponseError;
      setError(pbError.message || "登录失败");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 登出
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      pb.authStore.clear();
    } catch (error: unknown) {
      const pbError = error as ClientResponseError;
      setError(pbError.message || "登出失败");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    isLoading,
    error,
    signup,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 自定义钩子，用于在组件中使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
