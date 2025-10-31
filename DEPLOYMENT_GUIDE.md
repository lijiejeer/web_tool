# 部署指南

本文档提供快速部署说明。

## 🚀 快速部署

### Docker 部署（推荐）

1. **使用 Docker Compose**

```bash
# 创建配置文件
cp .env.docker.example .env

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

2. **访问应用**

- 应用地址：http://localhost:3000
- 管理后台：http://localhost:3000/admin
- 默认账号：admin / 123456

详细说明：[Docker 部署文档](./DOCKER_DEPLOY.md)

### 手动部署

1. **安装依赖**

```bash
# 后端
cd backend && npm install

# 前端
cd ../frontend && npm install
```

2. **配置环境变量**

```bash
cd backend
cp .env.example .env
# 编辑 .env 修改配置
```

3. **构建前端**

```bash
cd frontend
npm run build
```

4. **启动服务**

```bash
cd backend
NODE_ENV=production npm start
```

## 🔧 配置说明

### 环境变量

```env
# 服务配置
PORT=3000
NODE_ENV=production

# 安全配置
JWT_SECRET=your-secret-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=123456

# 自动备份（可选）
AUTO_BACKUP_SCHEDULE=daily  # daily/weekly/monthly/disabled
TZ=Asia/Shanghai
```

### 自动备份

- `daily` - 每天凌晨2点备份
- `weekly` - 每周日凌晨2点备份
- `monthly` - 每月1号凌晨2点备份
- `disabled` - 禁用自动备份

系统最多保留5个自动备份文件。

## 🐳 Docker 镜像

### 使用官方镜像

```bash
docker pull <your-dockerhub-username>/webtool:latest
```

### 构建自己的镜像

```bash
# 本地构建
docker build -t webtool:latest .

# 多平台构建
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t webtool:latest \
  --push .
```

## 📊 监控和维护

### 健康检查

```bash
curl http://localhost:3000/api/health
```

### 查看日志

```bash
# Docker
docker-compose logs -f

# 手动部署
tail -f logs/app.log
```

### 备份数据

```bash
# 手动备份
curl -X POST http://localhost:3000/api/backup/auto \
  -H "Authorization: Bearer <your-token>"

# 下载备份
curl -X GET http://localhost:3000/api/backup/download \
  -H "Authorization: Bearer <your-token>" \
  -o backup.zip
```

## 🔒 安全建议

1. **修改默认密码**：首次部署后立即修改
2. **使用强密钥**：为 JWT_SECRET 设置复杂密钥
3. **启用 HTTPS**：生产环境使用 SSL/TLS
4. **限制访问**：使用防火墙或反向代理
5. **定期备份**：启用自动备份功能

## 📚 更多文档

- [README](./README.md) - 完整项目文档
- [快速开始](./QUICKSTART.md) - 快速入门指南
- [Docker 部署](./DOCKER_DEPLOY.md) - Docker 详细说明

## ❓ 常见问题

### 1. 端口被占用

修改 .env 或 docker-compose.yml 中的端口配置。

### 2. 数据丢失

确保正确配置了数据持久化，挂载数据卷。

### 3. 无法访问管理后台

检查账号密码，查看日志排查问题。

## 💬 获取帮助

如遇到问题，请：
- 查看日志文件
- 检查配置文件
- 提交 Issue
