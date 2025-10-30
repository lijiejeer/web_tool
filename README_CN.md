# Web Tool - 在线网址导航系统

[English](./README.md) | 简体中文

> 一个现代化的在线导航网站，采用 Vue 3 + Node.js + SQLite 全栈架构开发

## 🌟 项目亮点

- ✅ **前后端分离**：Vue 3 前端 + Node.js 后端，清晰的架构设计
- ✅ **零配置数据库**：使用 SQLite，无需安装配置其他数据库
- ✅ **完整的管理后台**：栏目、卡片、广告、友链一站式管理
- ✅ **智能网址解析**：自动获取网站标题、Logo、描述
- ✅ **现代化UI**：毛玻璃效果、渐变背景、响应式设计
- ✅ **安全认证**：JWT身份验证，密码加密存储

## 📸 预览截图

### 前台首页
- 美观的卡片式导航布局
- 多引擎聚合搜索
- 左右悬浮广告位
- 友情链接展示

### 后台管理
- 数据统计仪表盘
- 栏目分类管理
- 卡片内容管理（含自动解析）
- 广告位管理
- 友情链接管理
- 登录日志查看
- 备份恢复功能

## 🚀 快速开始

### 前置要求

```bash
Node.js >= 16.x
npm >= 7.x
```

### 安装和运行

1️⃣ **克隆项目**

```bash
git clone <repository-url>
cd web_tool
```

2️⃣ **安装依赖**

```bash
# 一键安装所有依赖
npm run install:all

# 或分别安装
cd backend && npm install
cd ../frontend && npm install
```

3️⃣ **配置环境变量**

```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，设置管理员账号密码
```

4️⃣ **启动开发服务器**

```bash
# 终端1：启动后端
cd backend
npm run dev

# 终端2：启动前端
cd frontend
npm run dev
```

5️⃣ **访问应用**

- 前台：http://localhost:5173
- 后台：http://localhost:5173/admin
- 默认账号：admin / 123456

详细的使用说明请查看 [快速开始指南](./QUICKSTART.md)

## 📦 生产环境部署

### 构建前端

```bash
cd frontend
npm run build
```

### 部署方式

#### 方案1：Nginx + Node.js

前端打包后部署到Nginx，后端独立运行

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
    }
    
    location /uploads {
        proxy_pass http://localhost:3000;
    }
}
```

#### 方案2：单服务部署

后端同时提供前端静态文件和API服务

```bash
cd backend
# 修改 src/app.js，添加静态文件服务
npm start
```

### 使用PM2管理进程

```bash
npm install -g pm2
cd backend
pm2 start src/app.js --name webtool
pm2 startup
pm2 save
```

## 🎯 核心功能

### 前台功能

| 功能 | 说明 |
|------|------|
| 卡片导航 | 分类展示各类网站链接 |
| 聚合搜索 | 支持Google/百度/Bing/GitHub/站内搜索 |
| 响应式布局 | 完美适配PC和移动端 |
| 悬浮广告 | 左右两侧可关闭的广告位 |
| 友情链接 | 底部友情链接展示 |

### 后台功能

| 模块 | 功能 |
|------|------|
| 数据统计 | 各类数据统计、最近登录记录 |
| 栏目管理 | 增删改查主栏目和子栏目 |
| 卡片管理 | 管理导航卡片，支持网址自动解析 |
| 广告管理 | 管理左右侧广告位 |
| 友链管理 | 管理友情链接 |
| 登录日志 | 查看详细的登录记录 |

### 网址自动解析

添加卡片时，只需输入网址并点击"解析网站信息"，系统会自动：

- 📝 获取网站标题（从 `<title>` 或 `og:title`）
- 🖼️ 获取网站Logo（从 `favicon` 或 `og:image`）
- 📄 获取网站描述（从 `description` 或 `og:description`）

## 🛠️ 技术栈详情

### 后端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 16+ | 运行环境 |
| Express | 4.x | Web框架 |
| better-sqlite3 | 9.x | SQLite数据库 |
| jsonwebtoken | 9.x | JWT认证 |
| bcryptjs | 2.x | 密码加密 |
| multer | 1.x | 文件上传 |
| cheerio | 1.x | HTML解析 |
| axios | 1.x | HTTP客户端 |

### 前端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.x | 前端框架 |
| Vue Router | 4.x | 路由管理 |
| Pinia | 2.x | 状态管理 |
| Element Plus | 2.x | UI组件库 |
| Vite | 5.x | 构建工具 |
| Axios | 1.x | HTTP客户端 |

## 📁 项目结构

```
web_tool/
├── backend/                    # 后端项目
│   ├── src/
│   │   ├── config/            # 配置文件
│   │   │   └── database.js    # 数据库初始化
│   │   ├── middleware/        # 中间件
│   │   │   └── auth.js        # JWT认证
│   │   ├── routes/            # 路由
│   │   ├── controllers/       # 控制器
│   │   ├── utils/             # 工具函数
│   │   │   ├── urlParser.js   # 网址解析
│   │   │   └── seedData.js    # 示例数据
│   │   └── app.js             # 入口文件
│   ├── uploads/               # 上传文件
│   ├── database.db            # SQLite数据库
│   └── package.json
│
├── frontend/                   # 前端项目
│   ├── src/
│   │   ├── views/             # 页面组件
│   │   │   ├── Home.vue       # 前台首页
│   │   │   └── admin/         # 后台管理
│   │   ├── components/        # 公共组件
│   │   ├── router/            # 路由配置
│   │   ├── store/             # 状态管理
│   │   ├── api/               # API接口
│   │   └── main.js            # 入口文件
│   └── package.json
│
├── README.md                   # 英文文档
├── README_CN.md               # 中文文档
├── QUICKSTART.md              # 快速开始
└── package.json               # 根配置
```

## 🔐 安全建议

> 生产环境部署时请务必注意以下安全事项

1. **修改默认密码**：首次部署后立即修改admin密码
2. **更换JWT密钥**：使用强随机字符串替换默认的JWT_SECRET
3. **启用HTTPS**：生产环境必须使用HTTPS
4. **备份数据**：定期备份database.db文件
5. **限制上传**：文件上传仅支持图片，最大5MB

## 🔧 常见问题

<details>
<summary>Q: 端口被占用怎么办？</summary>

修改 `backend/.env` 文件中的 `PORT` 配置
</details>

<details>
<summary>Q: 如何重置管理员密码？</summary>

删除 `backend/database.db` 文件，重启后端服务会自动创建新数据库和默认管理员
</details>

<details>
<summary>Q: 网址解析失败？</summary>

部分网站有反爬虫机制，可手动输入网站信息
</details>

<details>
<summary>Q: 如何添加更多管理员？</summary>

目前版本仅支持单管理员，多管理员功能可自行扩展
</details>

## 📊 数据库结构

系统使用SQLite数据库，包含以下表：

- **users** - 用户表
- **categories** - 栏目表（支持树形结构）
- **cards** - 卡片表
- **ads** - 广告表
- **friendlinks** - 友情链接表
- **login_logs** - 登录日志表

## 🎨 自定义配置

### 修改主题色

编辑 `frontend/src/views/Home.vue`：

```css
/* 修改渐变背景 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### 修改搜索引擎

编辑 `frontend/src/views/Home.vue` 中的 `searchEngines` 数组

### 修改Logo

替换 `frontend/public/favicon.ico` 文件

## 📈 后续计划

- [ ] 增加更多搜索引擎选项
- [ ] 支持多主题切换（暗色模式）
- [ ] 添加数据导入导出功能
- [ ] 支持多管理员
- [ ] 添加访问统计功能
- [ ] 支持自定义域名短链接

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议

## 🙏 鸣谢

- 原静态版本：https://geeeeeeeek.github.io/web_tool/
- Vue.js 团队
- Element Plus 团队
- 所有贡献者

## 📮 联系方式

如有问题或建议，欢迎：

- 提交 [Issue](../../issues)
- 发起 [Discussion](../../discussions)

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！
