# 部署指南

本文档详细说明如何将项目部署到生产环境。

## 📋 部署前检查清单

- [ ] Node.js 16+ 已安装
- [ ] 已配置域名（可选）
- [ ] 已准备SSL证书（推荐）
- [ ] 服务器防火墙已开放相应端口
- [ ] 已修改默认管理员密码
- [ ] 已生成强JWT密钥

## 🚀 方案一：使用 Nginx + PM2（推荐）

### 1. 准备服务器环境

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Nginx
sudo apt install nginx -y

# 安装 PM2
sudo npm install -g pm2
```

### 2. 上传代码到服务器

```bash
# 使用 git clone
cd /var/www
git clone <your-repo-url> webtool
cd webtool

# 或使用 scp 上传
scp -r ./webtool user@server:/var/www/
```

### 3. 安装依赖

```bash
# 后端依赖
cd /var/www/webtool/backend
npm install --production

# 前端构建
cd /var/www/webtool/frontend
npm install
npm run build
```

### 4. 配置环境变量

```bash
cd /var/www/webtool/backend
nano .env
```

设置生产环境变量：

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your-very-strong-random-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
```

### 5. 配置 Nginx

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/webtool
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/webtool/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 上传文件
    location /uploads {
        proxy_pass http://localhost:3000;
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
}
```

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/webtool /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. 使用 PM2 启动应用

```bash
cd /var/www/webtool/backend
pm2 start src/app.js --name webtool-backend

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs webtool-backend

# 查看状态
pm2 status
```

### 7. 配置 SSL（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

Certbot 会自动修改 Nginx 配置，添加 HTTPS 支持。

## 🐳 方案二：使用 Docker 部署

### 1. 创建 Dockerfile（后端）

在 `backend/` 目录创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]
```

### 2. 创建 docker-compose.yml

在项目根目录创建：

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - ADMIN_USERNAME=${ADMIN_USERNAME}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
    volumes:
      - ./backend/database.db:/app/database.db
      - ./backend/uploads:/app/uploads
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./frontend/dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - backend
    restart: unless-stopped
```

### 3. 启动容器

```bash
# 构建前端
cd frontend
npm run build

# 启动所有服务
cd ..
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🔧 方案三：单服务器部署（简单模式）

适用于小型项目或测试环境。

### 1. 修改后端配置

编辑 `backend/src/app.js`，在路由配置**之前**添加：

```javascript
// 静态文件服务 - 前端构建产物
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// 所有其他请求返回 index.html（支持 Vue Router history 模式）
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});
```

### 2. 构建和启动

```bash
# 构建前端
cd frontend
npm run build

# 启动后端（后端会同时提供前端静态文件）
cd ../backend
pm2 start src/app.js --name webtool
```

现在只需访问 `http://your-server:3000` 即可。

## 📊 性能优化建议

### 1. 前端优化

```bash
# 分析构建体积
cd frontend
npm run build -- --report

# 启用 CDN 加速（修改 vite.config.js）
build: {
  rollupOptions: {
    external: ['vue', 'vue-router', 'element-plus'],
    output: {
      globals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        'element-plus': 'ElementPlus'
      }
    }
  }
}
```

### 2. 后端优化

- 启用 Gzip 压缩
- 设置静态资源缓存
- 使用 Redis 缓存热点数据（可选）
- 定期清理过期日志

### 3. 数据库优化

```bash
# 定期备份数据库
cp backend/database.db backend/database.backup.$(date +%Y%m%d).db

# 压缩备份
tar -czf backup.tar.gz backend/database.db backend/uploads/

# 定期清理旧日志
sqlite3 backend/database.db "DELETE FROM login_logs WHERE login_time < datetime('now', '-30 days');"
```

## 🔐 安全加固

### 1. 防火墙配置

```bash
# 仅开放必要端口
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 2. Fail2ban 防护

```bash
# 安装 fail2ban
sudo apt install fail2ban -y

# 配置 Nginx 防护
sudo nano /etc/fail2ban/jail.local
```

添加：

```ini
[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 600
bantime = 3600
```

### 3. 限制文件上传

后端已默认限制：
- 只允许上传图片
- 单个文件最大 5MB
- 需要 JWT 认证

### 4. 定期更新

```bash
# 更新系统包
sudo apt update && sudo apt upgrade -y

# 更新 Node.js 依赖
cd backend && npm audit fix
cd ../frontend && npm audit fix
```

## 📈 监控和日志

### 1. PM2 监控

```bash
# 实时监控
pm2 monit

# 日志查看
pm2 logs webtool-backend --lines 100

# 性能指标
pm2 describe webtool-backend
```

### 2. Nginx 日志

```bash
# 访问日志
tail -f /var/log/nginx/access.log

# 错误日志
tail -f /var/log/nginx/error.log

# 日志轮转
sudo logrotate /etc/logrotate.d/nginx
```

### 3. 应用日志

后端日志位于：
- PM2 日志：`~/.pm2/logs/`
- 应用日志：在代码中使用 console.log

## 🔄 更新部署

### 1. 拉取最新代码

```bash
cd /var/www/webtool
git pull origin main
```

### 2. 更新依赖

```bash
# 后端
cd backend
npm install --production

# 前端
cd ../frontend
npm install
npm run build
```

### 3. 重启服务

```bash
# 重启后端
pm2 restart webtool-backend

# 重新加载 Nginx
sudo nginx -s reload
```

## ❓ 故障排查

### 问题：后端无法启动

```bash
# 检查端口占用
netstat -tlnp | grep 3000

# 查看 PM2 日志
pm2 logs webtool-backend

# 手动启动测试
cd backend
node src/app.js
```

### 问题：前端白屏

```bash
# 检查构建产物
ls -la frontend/dist/

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 测试 Nginx 配置
sudo nginx -t
```

### 问题：数据库锁定

```bash
# 检查数据库文件权限
ls -la backend/database.db

# 修复权限
chmod 644 backend/database.db

# 如果损坏，恢复备份
cp backend/database.backup.db backend/database.db
```

## 📞 支持

如遇到部署问题，请：
1. 查看项目 Issues
2. 提交新的 Issue
3. 查阅相关文档

---

祝部署顺利！🚀
