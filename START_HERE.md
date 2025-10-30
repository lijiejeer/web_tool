# 🚀 开始使用 Web Tool

> **欢迎！** 本项目已完成从静态 HTML 到 Vue 3 + Node.js 全栈架构的迁移。

## ⚡ 快速开始（5分钟）

### 1️⃣ 安装依赖

```bash
# 方式一：使用根目录脚本（推荐）
npm run install:all

# 方式二：分别安装
cd backend && npm install
cd ../frontend && npm install
```

### 2️⃣ 启动服务

**终端1 - 启动后端：**
```bash
cd backend
npm run dev
```

**终端2 - 启动前端：**
```bash
cd frontend
npm run dev
```

### 3️⃣ 访问应用

- 🏠 **前台首页**: http://localhost:5173
- 🔐 **管理后台**: http://localhost:5173/admin
- 👤 **默认账号**: `admin` / `123456`

## 📚 详细文档

按需查阅以下文档：

| 文档 | 说明 | 适用人群 |
|------|------|----------|
| [README.md](./README.md) | 完整项目文档（英文） | 所有人 |
| [README_CN.md](./README_CN.md) | 完整项目文档（中文） | 所有人 |
| [QUICKSTART.md](./QUICKSTART.md) | 5分钟快速入门 | 新手 |
| [DEPLOY.md](./DEPLOY.md) | 生产环境部署指南 | 运维人员 |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 贡献指南 | 开发者 |
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | 项目技术概览 | 开发者 |
| [CHANGELOG.md](./CHANGELOG.md) | 版本更新记录 | 所有人 |

## ✨ 核心功能

### 前台功能
✅ 卡片式导航界面  
✅ 多引擎聚合搜索（Google/百度/Bing/GitHub/站内）  
✅ 响应式设计（PC + 移动端）  
✅ 左右悬浮广告位（可关闭）  
✅ 友情链接展示  

### 后台管理
✅ 数据统计仪表盘  
✅ 栏目管理（支持二级分类）  
✅ 卡片管理（支持网址自动解析）  
✅ 广告位管理  
✅ 友情链接管理  
✅ 登录日志查看  

## 🎯 首次使用指南

### Step 1: 登录后台
访问 http://localhost:5173/admin/login  
使用默认账号：`admin` / `123456`

### Step 2: 创建栏目
1. 进入"栏目管理"
2. 点击"添加栏目"
3. 输入栏目名称（如："开发工具"）
4. 保存

### Step 3: 添加卡片（使用自动解析）
1. 进入"卡片管理"
2. 点击"添加卡片"
3. 输入网址：`https://github.com`
4. 点击"解析网站信息"（自动填充标题、Logo、描述）
5. 选择栏目
6. 保存

### Step 4: 查看前台效果
返回首页即可看到刚添加的内容！

## 🛠️ 技术栈

**后端**: Node.js + Express + SQLite  
**前端**: Vue 3 + Element Plus + Vite  
**认证**: JWT  
**数据库**: SQLite（零配置）  

## 📦 项目结构

```
web_tool/
├── backend/          # 后端（Node.js）
│   ├── src/          # 源代码
│   ├── uploads/      # 上传文件
│   └── database.db   # SQLite数据库
│
├── frontend/         # 前端（Vue 3）
│   ├── src/          # 源代码
│   ├── public/       # 静态资源
│   └── dist/         # 构建产物
│
└── [文档文件]        # 各种.md文档
```

## ⚙️ 环境变量

后端环境变量在 `backend/.env` 文件中配置：

```env
PORT=3000                    # 后端端口
NODE_ENV=development         # 环境模式
JWT_SECRET=your-secret-key   # JWT密钥（生产环境请修改）
ADMIN_USERNAME=admin         # 管理员用户名
ADMIN_PASSWORD=123456        # 管理员密码（首次部署后请修改）
```

## 🔧 常用命令

### 开发模式
```bash
# 后端（带自动重启）
cd backend && npm run dev

# 前端（热更新）
cd frontend && npm run dev
```

### 生产构建
```bash
# 构建前端
cd frontend && npm run build

# 启动后端
cd backend && npm start
```

### 使用 PM2（生产环境）
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
cd backend
pm2 start src/app.js --name webtool

# 查看状态
pm2 status

# 查看日志
pm2 logs webtool
```

## 🐛 常见问题

**Q: 端口被占用？**  
A: 修改 `backend/.env` 中的 `PORT` 配置

**Q: 忘记密码？**  
A: 删除 `backend/database.db`，重启后端会重新创建

**Q: 网址解析失败？**  
A: 部分网站有反爬机制，可手动输入信息

**Q: 前端连不上后端？**  
A: 确保后端在 3000 端口运行，检查控制台错误

## 🔐 安全提醒

**生产环境部署前务必：**

1. ✅ 修改默认管理员密码
2. ✅ 更换 JWT_SECRET 为强随机字符串
3. ✅ 启用 HTTPS
4. ✅ 定期备份 database.db 文件
5. ✅ 限制文件上传大小和类型

## 📞 获取帮助

- 📖 查看详细文档（README.md）
- 🐛 提交 Issue
- 💬 参与 Discussions
- 📧 联系维护者

## 🎉 开始探索吧！

项目已经完全就绪，现在你可以：

1. 🚀 启动服务体验功能
2. 📝 添加你的导航内容
3. 🎨 自定义样式和配置
4. 🚢 准备部署到生产环境

**祝你使用愉快！** 如遇问题请查阅文档或提交 Issue。

---

Made with ❤️ | [GitHub](https://github.com) | [Issues](../../issues)
