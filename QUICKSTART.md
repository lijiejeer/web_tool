# 快速开始指南

## 🚀 5分钟快速启动

### 1. 安装依赖

在项目根目录执行：

```bash
# 使用根目录脚本一键安装所有依赖
npm run install:all

# 或者分别安装
cd backend && npm install
cd ../frontend && npm install
```

### 2. 启动后端服务

打开第一个终端：

```bash
cd backend
npm run dev
```

看到以下输出表示启动成功：
```
Server is running on port 3000
API URL: http://localhost:3000/api
Environment: development
Database initialized successfully
Default admin user created
```

### 3. 启动前端服务

打开第二个终端：

```bash
cd frontend
npm run dev
```

看到以下输出表示启动成功：
```
VITE ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 4. 访问应用

- **前台首页**: http://localhost:5173
- **后台管理**: http://localhost:5173/admin/login
- **默认账号**: admin / 123456

## 📝 初次使用

### 登录后台

1. 访问 http://localhost:5173/admin/login
2. 输入用户名：`admin`，密码：`123456`
3. 点击登录进入管理后台

### 添加第一个栏目

1. 点击左侧菜单"栏目管理"
2. 点击"添加栏目"按钮
3. 输入栏目名称，如："开发工具"
4. 选择图标（可选），如：`el-icon-folder`
5. 父级栏目选择"顶级栏目"
6. 点击确定

### 添加子栏目

1. 在栏目管理页面，再次点击"添加栏目"
2. 输入子栏目名称，如："代码仓库"
3. 父级栏目选择刚才创建的"开发工具"
4. 点击确定

### 添加卡片（使用网址解析）

1. 点击左侧菜单"卡片管理"
2. 点击"添加卡片"按钮
3. 在"链接"输入框输入：`https://github.com`
4. 点击"解析网站信息"按钮（等待几秒）
5. 系统会自动填充标题、Logo和描述
6. 选择所属栏目（如刚才创建的"代码仓库"）
7. 点击确定

### 查看前台效果

返回首页 http://localhost:5173，即可看到刚才添加的栏目和卡片。

## 🎨 添加广告

1. 进入"广告管理"
2. 点击"添加广告"
3. 输入标题和图片URL
4. 选择位置：左侧或右侧
5. 设置链接地址（可选）
6. 启用状态设为"启用"
7. 保存后在首页左右两侧可见悬浮广告

## 🔗 添加友情链接

1. 进入"友链管理"
2. 点击"添加友链"
3. 输入名称和URL
4. 可选填写Logo和描述
5. 保存后在首页底部可见友情链接

## 🛠️ 常见问题

### Q: 后端启动失败？
A: 检查端口3000是否被占用，可修改 `backend/.env` 中的 `PORT` 配置

### Q: 前端连接不上后端？
A: 确保后端服务正常运行，检查控制台是否有错误信息

### Q: 网址解析失败？
A: 某些网站可能有反爬虫机制，可以手动输入标题和描述

### Q: 忘记管理员密码？
A: 删除 `backend/database.db` 文件，重启后端会重新创建数据库和默认管理员

## 🎯 下一步

- 修改管理员密码（在后台右上角）
- 添加更多栏目和卡片
- 自定义样式和配置
- 准备生产环境部署（参考 README.md）

## 💡 提示

- 所有数据保存在 `backend/database.db` 文件中
- 上传的图片保存在 `backend/uploads` 目录
- 建议定期备份数据库文件
- 生产环境务必修改默认密码和JWT密钥
