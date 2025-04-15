# 心情追踪应用

这是一个使用 React、Vite 和 Firebase 构建的心情追踪应用，可以帮助用户每天记录和追踪自己的心情变化。

## 功能

- 用户注册和登录系统
- 日历视图显示心情记录
- 每日心情记录（从 1-5 级）
- 查看历史心情统计

## 技术栈

- 前端框架: React 19
- 构建工具: Vite
- 路由: React Router
- 后端/数据库: Firebase (Firestore & Authentication)
- 样式: CSS

## 开始使用

### 前提条件

- Node.js 16+
- Firebase 项目（可在[Firebase 控制台](https://console.firebase.google.com/)创建）

### 安装步骤

1. 克隆项目:

```
git clone <repository-url>
cd inside-world
```

2. 安装依赖:

```
npm install
```

3. 设置 Firebase:

   a. 在[Firebase 控制台](https://console.firebase.google.com/)创建新项目
   b. 在项目设置中添加 Web 应用
   c. 复制 Firebase 配置对象
   d. 将配置粘贴到`src/firebase.ts`文件中的 firebaseConfig 对象
   e. 启用 Authentication（电子邮件/密码验证）和 Firestore 数据库

4. 运行开发服务器:

```
npm run dev
```

5. 在浏览器中访问 [http://localhost:5173](http://localhost:5173)

## 构建生产版本

```
npm run build
```

生成的文件将在 `dist` 目录中，可以部署到任何静态网站托管服务。

## 项目结构

```
/src
  /components       - 所有React组件
  /context          - React上下文(包括认证)
  /firebase.ts      - Firebase配置和工具函数
  App.tsx           - 主应用组件
  main.tsx          - 应用入口点
/public             - 静态资源
```

## 鸣谢

- 原 NextJS 版本设计和功能灵感来自 graduate/mood 项目
- 使用 Firebase 作为后端服务
