# 心情追踪应用

这是一个使用 React、Vite 和 PocketBase 构建的心情追踪应用，可以帮助用户每天记录和追踪自己的心情变化。

## 功能

- 用户注册和登录系统
- 日历视图显示心情记录
- 每日心情记录（从 1-5 级）
- 查看历史心情统计

## 技术栈

- 前端框架: React 19
- 构建工具: Vite
- 路由: React Router
- 后端/数据库: PocketBase
- 样式: CSS

## 开始使用

### 前提条件

- Node.js 16+
- PocketBase 服务器实例

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

3. 设置 PocketBase:

   a. 下载并安装 PocketBase: https://pocketbase.io/docs/
   b. 创建一个新的 PocketBase 项目
   c. 创建所需的集合（users 和 moods）
   d. 确保 API 地址在 `src/api/pocketbase.js` 文件中正确配置

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
  /api              - PocketBase 配置和API工具
  App.tsx           - 主应用组件
  main.tsx          - 应用入口点
/public             - 静态资源
```

## 鸣谢

- 原 NextJS 版本设计和功能灵感来自 graduate/mood 项目
- 使用 PocketBase 作为后端服务
