# Inside World - 沉浸式心情追踪应用

Inside World 是一个创新的心情追踪应用，结合了传统的情感记录功能与现代 3D 交互体验。用户可以通过直观的界面记录每日心情，创建个性化 3D 头像，并在音乐天空中放松身心。

## ✨ 核心功能

### 📊 心情追踪系统

- 用户注册和登录系统
- 每日心情记录（1-5 级评分系统）
- 交互式日历视图显示历史心情数据
- 心情统计分析（平均心情、连续记录天数、剩余时间）
- 实时数据同步和持久化存储

### 🎨 3D Avatar 创建器

- 基于 Three.js 的实时 3D 渲染
- 可自定义的 3D 头像创建功能
- 交互式 3D 场景体验
- 头像保存和管理功能

### 🎵 音乐天空场景

- 沉浸式 3D 音乐可视化环境
- 动态星空背景效果
- 交互式钢琴演奏功能
- 音乐控制器和播放功能

## 🛠️ 技术栈

### 前端技术

- **React 18** - 现代化前端框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速构建工具
- **React Router** - 单页应用路由管理
- **Tailwind CSS** - 实用优先的 CSS 框架

### 3D 渲染技术

- **React Three Fiber** - React 的 Three.js 渲染器
- **Three.js** - 3D 图形库
- **@react-three/drei** - Three.js 实用工具库
- **@react-three/postprocessing** - 后处理效果

### 后端服务

- **PocketBase** - 后端即服务解决方案
- **实时数据库** - 支持实时数据同步
- **用户认证** - 内置用户管理系统

### 状态管理

- **Zustand** - 轻量级状态管理
- **React Context** - 认证状态管理

## 🚀 快速开始

### 环境要求

- **Node.js** 16.0+
- **npm** 或 **yarn** 包管理器
- **PocketBase** 服务器实例

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd inside-world
```

2. **安装依赖**

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

3. **配置 PocketBase 后端**

   a. 下载 PocketBase：访问 [https://pocketbase.io/docs/](https://pocketbase.io/docs/)

   b. 启动 PocketBase 服务器：

   ```bash
   ./pocketbase serve
   ```

   c. 访问管理界面：[http://127.0.0.1:8090/\_/](http://127.0.0.1:8090/_/)

   d. 创建必要的数据集合：

   - **users** 集合（用户管理）
   - **moods** 集合（心情数据）

   e. 确认 API 地址配置正确（`src/api/pocketbase.ts`）

4. **启动开发服务器**

```bash
npm run dev
```

5. **访问应用**

   在浏览器中打开 [http://localhost:5173](http://localhost:5173)

### 生产环境部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建文件将生成在 `dist/` 目录中，可部署到任何静态网站托管服务。

## 📁 项目架构

```
inside-world/
├── public/                 # 静态资源
│   ├── images/            # 图片资源
│   ├── models/            # 3D模型文件
│   └── mp3/               # 音频文件
├── src/
│   ├── components/        # React组件
│   │   ├── r3d/          # 3D Avatar相关组件
│   │   ├── sky/          # 音乐天空相关组件
│   │   ├── Calendar.tsx   # 日历组件
│   │   ├── Dashboard.tsx  # 主仪表板
│   │   ├── Login.tsx      # 登录组件
│   │   └── ...           # 其他UI组件
│   ├── context/          # React Context
│   │   └── AuthContext.tsx # 认证上下文
│   ├── api/              # API配置
│   │   └── pocketbase.ts  # PocketBase配置
│   ├── types/            # TypeScript类型定义
│   │   ├── mood.ts       # 心情相关类型
│   │   ├── calendar.ts   # 日历相关类型
│   │   └── components.ts # 组件相关类型
│   ├── utils/            # 工具函数
│   ├── App.tsx           # 主应用组件
│   └── main.tsx          # 应用入口点
├── package.json          # 项目依赖配置
├── vite.config.ts        # Vite配置
├── tailwind.config.js    # Tailwind CSS配置
└── tsconfig.json         # TypeScript配置
```

## 🎮 使用指南

### 心情记录

1. 注册/登录账户
2. 在主界面选择当前心情（1-5 级）
3. 查看日历中的历史记录
4. 分析心情统计数据

### 3D Avatar 创建

1. 点击"Create Your 3D Avatar"按钮
2. 在 3D 场景中自定义头像
3. 保存个性化设置

### 音乐天空体验

1. 点击"Enter Music Sky"按钮
2. 在星空场景中放松身心
3. 使用钢琴功能演奏音乐

## 🔧 开发说明

### 可用脚本

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览构建结果
npm run lint     # 代码检查
```

### 主要依赖

- **@react-three/fiber**: React Three.js 渲染器
- **@react-three/drei**: Three.js 工具库
- **pocketbase**: 后端服务客户端
- **react-router-dom**: 路由管理
- **zustand**: 状态管理
- **tailwindcss**: CSS 框架

## 📝 许可证

本项目仅用于学术研究和教育目的。

## 👥 贡献者

- 开发者：[您的姓名]
- 指导老师：[导师姓名]
- 学校：[学校名称]

## 📞 联系方式

如有问题或建议，请联系：[您的邮箱]
