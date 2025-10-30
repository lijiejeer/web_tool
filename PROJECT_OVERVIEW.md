# 项目概览

## 📊 项目统计

- **总文件数**: 48+
- **JavaScript 文件**: 31
- **Vue 组件**: 10
- **文档文件**: 8
- **代码行数**: 约 5000+

## 🗂️ 完整文件结构

```
web_tool/
├── 📄 文档文件
│   ├── README.md              # 主要文档（英文）
│   ├── README_CN.md           # 中文文档
│   ├── QUICKSTART.md          # 快速开始指南
│   ├── DEPLOY.md              # 部署指南
│   ├── CONTRIBUTING.md        # 贡献指南
│   ├── CHANGELOG.md           # 更新日志
│   └── PROJECT_OVERVIEW.md    # 项目概览（本文件）
│
├── ⚙️ 配置文件
│   ├── package.json           # 根目录配置
│   ├── .gitignore             # Git 忽略规则
│   ├── Readme-en.md           # 原英文文档
│   ├── 404.html               # 原404页面（保留）
│   └── index.html             # 原首页（保留）
│
├── 🗄️ 后端 (backend/)
│   ├── 📋 配置
│   │   ├── package.json       # 后端依赖配置
│   │   ├── .env.example       # 环境变量示例
│   │   └── .env               # 环境变量（已生成）
│   │
│   ├── 📂 src/
│   │   ├── app.js             # 应用入口
│   │   │
│   │   ├── 🔧 config/
│   │   │   └── database.js    # 数据库配置和初始化
│   │   │
│   │   ├── 🛡️ middleware/
│   │   │   └── auth.js        # JWT 认证中间件
│   │   │
│   │   ├── 🎮 controllers/
│   │   │   ├── authController.js      # 认证控制器
│   │   │   ├── categoryController.js  # 栏目控制器
│   │   │   ├── cardController.js      # 卡片控制器
│   │   │   ├── adController.js        # 广告控制器
│   │   │   ├── friendlinkController.js # 友链控制器
│   │   │   ├── statsController.js     # 统计控制器
│   │   │   └── uploadController.js    # 上传控制器
│   │   │
│   │   ├── 🚏 routes/
│   │   │   ├── auth.js        # 认证路由
│   │   │   ├── categories.js  # 栏目路由
│   │   │   ├── cards.js       # 卡片路由
│   │   │   ├── ads.js         # 广告路由
│   │   │   ├── friendlinks.js # 友链路由
│   │   │   ├── stats.js       # 统计路由
│   │   │   └── upload.js      # 上传路由
│   │   │
│   │   └── 🔨 utils/
│   │       ├── urlParser.js   # 网址解析工具
│   │       └── seedData.js    # 示例数据填充
│   │
│   └── 📁 uploads/            # 上传文件目录
│       └── .gitkeep
│
├── 🎨 前端 (frontend/)
│   ├── 📋 配置
│   │   ├── package.json       # 前端依赖配置
│   │   ├── vite.config.js     # Vite 构建配置
│   │   └── index.html         # HTML 模板
│   │
│   ├── 📂 public/
│   │   └── favicon.ico        # 网站图标
│   │
│   └── 📂 src/
│       ├── main.js            # 应用入口
│       ├── App.vue            # 根组件
│       │
│       ├── 📄 views/          # 页面组件
│       │   ├── Home.vue       # 前台首页
│       │   └── admin/         # 管理后台页面
│       │       ├── Login.vue      # 登录页
│       │       ├── Layout.vue     # 后台布局
│       │       ├── Dashboard.vue  # 数据统计
│       │       ├── Categories.vue # 栏目管理
│       │       ├── Cards.vue      # 卡片管理
│       │       ├── Ads.vue        # 广告管理
│       │       ├── Friendlinks.vue # 友链管理
│       │       └── Logs.vue       # 登录日志
│       │
│       ├── 🧩 components/     # 公共组件（待扩展）
│       │
│       ├── 🚏 router/
│       │   └── index.js       # 路由配置
│       │
│       ├── 📦 store/
│       │   └── auth.js        # 认证状态管理
│       │
│       ├── 🌐 api/            # API 接口
│       │   ├── request.js     # Axios 封装
│       │   ├── auth.js        # 认证 API
│       │   ├── category.js    # 栏目 API
│       │   ├── card.js        # 卡片 API
│       │   ├── ad.js          # 广告 API
│       │   ├── friendlink.js  # 友链 API
│       │   ├── stats.js       # 统计 API
│       │   └── upload.js      # 上传 API
│       │
│       ├── 🔧 utils/          # 工具函数（待扩展）
│       │
│       └── 🎨 assets/         # 静态资源（待添加）
│
└── 📚 原始文件（保留参考）
    ├── assets/                # 原始样式和脚本
    └── about/                 # 原始关于页面
```

## 🎯 核心功能模块

### 1. 认证系统 (Auth)
- **文件**: `backend/src/controllers/authController.js`
- **功能**: 
  - ✅ 用户登录（JWT）
  - ✅ 获取用户信息
  - ✅ 修改密码
  - ✅ 登录日志记录

### 2. 栏目管理 (Categories)
- **文件**: `backend/src/controllers/categoryController.js`
- **功能**:
  - ✅ 增删改查栏目
  - ✅ 树形结构支持
  - ✅ 自定义排序
  - ✅ 图标配置

### 3. 卡片管理 (Cards)
- **文件**: `backend/src/controllers/cardController.js`
- **功能**:
  - ✅ 增删改查卡片
  - ✅ 网址自动解析
  - ✅ 搜索功能
  - ✅ 按栏目筛选

### 4. 广告管理 (Ads)
- **文件**: `backend/src/controllers/adController.js`
- **功能**:
  - ✅ 增删改查广告
  - ✅ 位置配置（左/右）
  - ✅ 启用/禁用状态
  - ✅ 排序管理

### 5. 友链管理 (Friendlinks)
- **文件**: `backend/src/controllers/friendlinkController.js`
- **功能**:
  - ✅ 增删改查友链
  - ✅ Logo 和描述
  - ✅ 启用/禁用状态
  - ✅ 排序管理

### 6. 统计功能 (Stats)
- **文件**: `backend/src/controllers/statsController.js`
- **功能**:
  - ✅ 数据统计
  - ✅ 登录日志查询
  - ✅ IP 和 User Agent 记录

### 7. 文件上传 (Upload)
- **文件**: `backend/src/controllers/uploadController.js`
- **功能**:
  - ✅ 图片上传
  - ✅ 文件大小限制
  - ✅ 格式验证

### 8. 网址解析 (URL Parser)
- **文件**: `backend/src/utils/urlParser.js`
- **功能**:
  - ✅ 自动获取网站标题
  - ✅ 自动获取网站 Logo
  - ✅ 自动获取网站描述
  - ✅ 支持多种 Meta 标签

## 💾 数据库设计

### 表结构

1. **users** - 用户表
   - id, username, password, created_at, updated_at

2. **categories** - 栏目表
   - id, name, icon, parent_id, sort_order, created_at, updated_at

3. **cards** - 卡片表
   - id, category_id, title, url, logo, description, sort_order, created_at, updated_at

4. **ads** - 广告表
   - id, title, position, image_url, link_url, sort_order, is_active, created_at, updated_at

5. **friendlinks** - 友情链接表
   - id, name, url, logo, description, sort_order, is_active, created_at, updated_at

6. **login_logs** - 登录日志表
   - id, user_id, ip_address, user_agent, login_time

## 🚀 API 端点总览

### 认证 (Auth)
```
POST   /api/auth/login          登录
GET    /api/auth/profile        获取用户信息 🔒
PUT    /api/auth/password       修改密码 🔒
```

### 栏目 (Categories)
```
GET    /api/categories          获取所有栏目
GET    /api/categories/:id      获取单个栏目
POST   /api/categories          创建栏目 🔒
PUT    /api/categories/:id      更新栏目 🔒
DELETE /api/categories/:id      删除栏目 🔒
```

### 卡片 (Cards)
```
GET    /api/cards               获取所有卡片
GET    /api/cards/search        搜索卡片
GET    /api/cards/:id           获取单个卡片
POST   /api/cards/parse         解析网站信息
POST   /api/cards               创建卡片 🔒
PUT    /api/cards/:id           更新卡片 🔒
DELETE /api/cards/:id           删除卡片 🔒
```

### 广告 (Ads)
```
GET    /api/ads                 获取所有广告
GET    /api/ads/:id             获取单个广告
POST   /api/ads                 创建广告 🔒
PUT    /api/ads/:id             更新广告 🔒
DELETE /api/ads/:id             删除广告 🔒
```

### 友链 (Friendlinks)
```
GET    /api/friendlinks         获取所有友链
GET    /api/friendlinks/:id     获取单个友链
POST   /api/friendlinks         创建友链 🔒
PUT    /api/friendlinks/:id     更新友链 🔒
DELETE /api/friendlinks/:id     删除友链 🔒
```

### 统计 (Stats)
```
GET    /api/stats               获取统计信息 🔒
GET    /api/stats/logs          获取登录日志 🔒
```

### 上传 (Upload)
```
POST   /api/upload              上传文件 🔒
```

🔒 = 需要 JWT 认证

## 📦 依赖包清单

### 后端依赖
```json
{
  "express": "^4.18.2",           // Web 框架
  "cors": "^2.8.5",               // 跨域支持
  "dotenv": "^16.3.1",            // 环境变量
  "bcryptjs": "^2.4.3",           // 密码加密
  "jsonwebtoken": "^9.0.2",       // JWT 认证
  "better-sqlite3": "^9.2.2",     // SQLite 数据库
  "multer": "^1.4.5-lts.1",       // 文件上传
  "cheerio": "^1.0.0-rc.12",      // HTML 解析
  "axios": "^1.6.2"               // HTTP 客户端
}
```

### 前端依赖
```json
{
  "vue": "^3.3.11",               // Vue 框架
  "vue-router": "^4.2.5",         // 路由管理
  "pinia": "^2.1.7",              // 状态管理
  "axios": "^1.6.2",              // HTTP 客户端
  "element-plus": "^2.5.1",       // UI 组件库
  "@element-plus/icons-vue": "^2.3.1" // 图标库
}
```

## 🎨 前端页面清单

### 公开页面
1. **首页** (`/`) - `Home.vue`
   - 导航卡片展示
   - 多引擎搜索
   - 悬浮广告
   - 友情链接

### 管理后台页面
2. **登录页** (`/admin/login`) - `Login.vue`
   - 用户登录表单
   - JWT 认证

3. **数据统计** (`/admin`) - `Dashboard.vue`
   - 数据统计卡片
   - 最近登录记录

4. **栏目管理** (`/admin/categories`) - `Categories.vue`
   - 栏目列表（树形）
   - 增删改查操作

5. **卡片管理** (`/admin/cards`) - `Cards.vue`
   - 卡片列表
   - 网址解析功能
   - 栏目筛选

6. **广告管理** (`/admin/ads`) - `Ads.vue`
   - 广告列表
   - 增删改查操作

7. **友链管理** (`/admin/friendlinks`) - `Friendlinks.vue`
   - 友链列表
   - 增删改查操作

8. **登录日志** (`/admin/logs`) - `Logs.vue`
   - 日志列表
   - 分页查询

## 🔐 安全特性

- ✅ JWT 令牌认证
- ✅ Bcrypt 密码加密（10轮）
- ✅ 文件上传限制（仅图片，5MB）
- ✅ CORS 跨域配置
- ✅ SQL 参数化查询（防注入）
- ✅ 环境变量配置
- ✅ 登录日志记录

## 📈 性能优化

- ✅ Vite 快速构建
- ✅ Vue 3 Composition API
- ✅ SQLite 索引优化
- ✅ 静态资源缓存
- ✅ 代码分割（路由懒加载）
- ✅ 图片格式限制

## 🌐 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动端浏览器

## 📝 待办事项

### 高优先级
- [ ] 完善站内搜索功能
- [ ] 添加数据导入/导出
- [ ] 多管理员支持
- [ ] 批量操作功能

### 中优先级
- [ ] 主题切换（暗色模式）
- [ ] 更多搜索引擎
- [ ] 访问统计功能
- [ ] PWA 支持

### 低优先级
- [ ] 短链接服务
- [ ] 多语言支持
- [ ] 社交媒体分享
- [ ] RSS 订阅

## 🤝 贡献者

感谢所有为项目做出贡献的开发者！

## 📞 支持

- 📧 Issues: [GitHub Issues](../../issues)
- 💬 Discussions: [GitHub Discussions](../../discussions)
- 📖 文档: 查看各个 .md 文件

---

**项目状态**: ✅ 完成重构，可用于生产环境

**最后更新**: 2024-10-30

**版本**: 1.0.0
