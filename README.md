# Web Tool - 在线网址导航系统

一个基于 Vue 3 + Node.js + SQLite 的前后端分离在线导航网站，支持完整的后台管理功能。

## ✨ 功能特性

### 🏠 前端功能

- **美观的卡片式导航**：采用渐变背景和毛玻璃效果的现代化UI设计
- **聚合搜索**：支持 Google、百度、Bing、GitHub、站内搜索
- **响应式设计**：完美适配桌面端和移动端
- **友情链接展示**：支持友情链接的展示和管理
- **悬浮广告位**：支持左右两侧悬浮广告位展示，保留关闭广告按钮

### 🔧 后台管理功能

- **👤 用户管理**：管理员登录、用户信息管理、密码修改
- **📋 栏目管理**：主菜单和子菜单的增删改查，支持树形结构
- **🃏 卡片管理**：导航卡片的增删改查，支持通过网址自动解析网站名称、logo、描述
- **📢 广告管理**：广告位的增删改查，支持启用/禁用状态
- **🔗 友链管理**：友情链接的增删改查
- **📊 数据统计**：登录时间、IP等统计信息展示
- **💾 备份恢复**：一键备份数据为ZIP压缩包，支持上传ZIP恢复数据

### 🔐 技术特性

- **JWT认证**：安全的用户认证机制
- **SQLite数据库**：轻量级数据库，无需额外配置
- **文件上传**：支持图片上传功能
- **搜索功能**：支持站内搜索和外部搜索引擎
- **移动端适配**：完美的移动端体验

## 🛠️ 技术栈

### 后端

- Node.js + Express
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- Bcrypt (密码加密)
- Multer (文件上传)
- Cheerio + Axios (网页解析)
- Archiver + Extract-zip (备份恢复)

### 前端

- Vue 3 (Composition API)
- Vue Router 4
- Pinia (状态管理)
- Element Plus (UI组件库)
- Axios (HTTP客户端)
- Vite (构建工具)

## 📦 安装部署

### 🐳 Docker 部署（推荐）

使用 Docker 快速部署，无需配置 Node.js 环境：

```bash
# 使用 docker-compose
docker-compose up -d

# 或直接运行
docker run -d -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  <your-dockerhub-username>/webtool:latest
```

访问 http://localhost:3000，默认账号：`admin` / `123456`

详细说明请查看 [Docker 部署文档](./DOCKER_DEPLOY.md)

### 💻 手动部署

#### 环境要求

- Node.js >= 16.x
- npm 或 yarn 或 pnpm

#### 1. 克隆项目

```bash
git clone <repository-url>
cd web_tool
```

#### 2. 配置环境变量

后端配置文件：

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，配置以下环境变量：

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=123456
AUTO_BACKUP_SCHEDULE=daily
TZ=Asia/Shanghai
```

### 3. 安装依赖

#### 安装后端依赖

```bash
cd backend
npm install
```

#### 安装前端依赖

```bash
cd frontend
npm install
```

### 4. 启动项目

#### 启动后端服务

```bash
cd backend
npm start
# 或使用开发模式（自动重启）
npm run dev
```

后端服务将在 `http://localhost:3000` 启动

#### 启动前端服务

在新的终端窗口中：

```bash
cd frontend
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

#### 5. 生产构建和部署

构建前端：

```bash
cd frontend
npm run build
```

构建产物会输出到 `backend/public` 目录。

启动生产服务器：

```bash
cd backend
NODE_ENV=production npm start
```

访问 http://localhost:3000

### 6. 访问应用

- **开发环境**：
  - 前端页面：http://localhost:5173
  - 管理后台：http://localhost:5173/admin
  
- **生产环境**：
  - 应用首页：http://localhost:3000
  - 管理后台：http://localhost:3000/admin

- **默认管理员账号**：
  - 用户名：`admin`
  - 密码：`123456`

## 🚀 生产环境部署

### 1. 构建前端

```bash
cd frontend
npm run build
```

构建产物将输出到 `frontend/dist` 目录。

### 2. 配置生产环境

#### 方案一：使用 Nginx 反向代理

1. 将前端构建产物部署到 Nginx 静态目录
2. 配置 Nginx 反向代理到后端服务

Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端API代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 上传文件代理
    location /uploads {
        proxy_pass http://localhost:3000;
    }
}
```

#### 方案二：后端服务同时提供前端静态文件

修改后端 `src/app.js`，添加静态文件服务：

```javascript
// 在路由配置之前添加
import path from 'path';
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
```

然后只需启动后端服务即可。

### 3. 使用 PM2 管理后端进程

```bash
# 安装 PM2
npm install -g pm2

# 启动后端服务
cd backend
pm2 start src/app.js --name webtool-backend

# 设置开机自启
pm2 startup
pm2 save
```

### 4. 环境变量配置

生产环境请务必修改以下配置：

- `JWT_SECRET`：使用强密码
- `ADMIN_PASSWORD`：修改默认密码
- `NODE_ENV`：设置为 `production`

## 📚 API 文档

### 认证相关

- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息（需认证）
- `PUT /api/auth/password` - 修改密码（需认证）

### 栏目管理

- `GET /api/categories` - 获取所有栏目（树形结构）
- `GET /api/categories/:id` - 获取单个栏目
- `POST /api/categories` - 创建栏目（需认证）
- `PUT /api/categories/:id` - 更新栏目（需认证）
- `DELETE /api/categories/:id` - 删除栏目（需认证）

### 卡片管理

- `GET /api/cards` - 获取所有卡片
- `GET /api/cards/search?q=关键词` - 搜索卡片
- `GET /api/cards/:id` - 获取单个卡片
- `POST /api/cards/parse` - 解析网站信息
- `POST /api/cards` - 创建卡片（需认证）
- `PUT /api/cards/:id` - 更新卡片（需认证）
- `DELETE /api/cards/:id` - 删除卡片（需认证）

### 广告管理

- `GET /api/ads` - 获取所有广告
- `GET /api/ads/:id` - 获取单个广告
- `POST /api/ads` - 创建广告（需认证）
- `PUT /api/ads/:id` - 更新广告（需认证）
- `DELETE /api/ads/:id` - 删除广告（需认证）

### 友情链接

- `GET /api/friendlinks` - 获取所有友情链接
- `GET /api/friendlinks/:id` - 获取单个友情链接
- `POST /api/friendlinks` - 创建友情链接（需认证）
- `PUT /api/friendlinks/:id` - 更新友情链接（需认证）
- `DELETE /api/friendlinks/:id` - 删除友情链接（需认证）

### 统计信息

- `GET /api/stats` - 获取统计信息（需认证）
- `GET /api/stats/logs` - 获取登录日志（需认证）

### 文件上传

- `POST /api/upload` - 上传文件（需认证）

### 备份恢复

- `GET /api/backup/info` - 获取备份信息（需认证）
- `GET /api/backup/download` - 下载备份文件（需认证）
- `POST /api/backup/restore` - 恢复备份（需认证）

## 🎯 使用说明

### 管理员操作流程

1. **登录后台**
   - 访问 `/admin/login`
   - 输入管理员账号密码登录

2. **管理栏目**
   - 进入"栏目管理"页面
   - 可以创建主栏目（顶级栏目）和子栏目
   - 支持设置栏目图标和排序

3. **管理卡片**
   - 进入"卡片管理"页面
   - 点击"添加卡片"
   - 输入网址后点击"解析网站信息"，系统会自动获取网站标题、Logo和描述
   - 选择所属栏目并保存

4. **管理广告**
   - 进入"广告管理"页面
   - 添加广告时选择位置（左侧/右侧）
   - 设置广告图片和链接地址
   - 可以启用/禁用广告

5. **管理友情链接**
   - 进入"友链管理"页面
   - 添加友情链接信息
   - 可以设置Logo和描述

6. **查看统计**
   - 在首页查看各类数据统计
   - 在"登录日志"页面查看详细的登录记录

7. **备份恢复**
   - 进入"备份恢复"页面
   - 点击"立即备份"下载ZIP压缩包
   - 上传之前的备份文件进行数据恢复

### 网址解析功能

系统支持自动解析网站信息，添加卡片时：

1. 输入完整的网址（如 `https://github.com`）
2. 点击"解析网站信息"按钮
3. 系统会自动获取：
   - 网站标题（从 `<title>` 或 `og:title`）
   - 网站Logo（从 `favicon` 或 `og:image`）
   - 网站描述（从 `description` 或 `og:description`）

## 🔒 安全建议

1. **修改默认密码**：首次部署后立即修改管理员密码
2. **JWT密钥**：生产环境使用强随机字符串作为JWT_SECRET
3. **HTTPS**：生产环境务必使用HTTPS
4. **定期备份**：定期备份 `database.db` 数据库文件
5. **文件上传**：限制上传文件大小和类型（默认仅支持图片，最大5MB）

## 📝 目录结构

```
web_tool/
├── backend/                 # 后端代码
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   │   └── database.js # 数据库配置和初始化
│   │   ├── middleware/     # 中间件
│   │   │   └── auth.js     # JWT认证中间件
│   │   ├── routes/         # 路由定义
│   │   ├── controllers/    # 控制器
│   │   ├── utils/          # 工具函数
│   │   │   └── urlParser.js # 网址解析工具
│   │   └── app.js          # 应用入口
│   ├── uploads/            # 上传文件目录
│   ├── database.db         # SQLite数据库文件
│   ├── package.json
│   └── .env.example        # 环境变量示例
│
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   │   ├── Home.vue   # 前台首页
│   │   │   └── admin/     # 后台管理页面
│   │   ├── components/    # 公共组件
│   │   ├── router/        # 路由配置
│   │   ├── store/         # 状态管理
│   │   ├── api/           # API接口
│   │   └── main.js        # 应用入口
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js     # Vite配置
│
├── .gitignore
└── README.md
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 参考资料

原项目基于静态HTML开发，现已重构为Vue 3 + Node.js全栈应用。

- 原项目预览：https://geeeeeeeek.github.io/web_tool/
