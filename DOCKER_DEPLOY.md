# Docker 部署指南

本文档提供详细的 Docker 部署说明。

## 📋 前置要求

- Docker 20.10+
- Docker Compose 2.0+ (可选，用于 docker-compose 部署)

## 🚀 快速开始

### 方式一：使用 Docker Compose（推荐）

1. **克隆项目**

```bash
git clone <your-repo-url>
cd webtool
```

2. **配置环境变量**

```bash
cp .env.docker.example .env
# 编辑 .env 文件，修改配置
nano .env
```

3. **创建数据目录**

```bash
mkdir -p data/uploads data/backups
```

4. **启动服务**

```bash
docker-compose up -d
```

5. **查看日志**

```bash
docker-compose logs -f
```

6. **访问应用**

打开浏览器访问：http://localhost:3000

- 前台首页：http://localhost:3000
- 管理后台：http://localhost:3000/admin
- 默认账号：admin / 123456

### 方式二：使用 Docker Run

1. **拉取镜像**

```bash
docker pull <your-dockerhub-username>/webtool:latest
```

2. **创建数据目录**

```bash
mkdir -p ./data/{uploads,backups}
```

3. **运行容器**

```bash
docker run -d \
  --name webtool-nav \
  -p 3000:3000 \
  -e JWT_SECRET=your-secret-key \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=123456 \
  -e AUTO_BACKUP_SCHEDULE=daily \
  -e TZ=Asia/Shanghai \
  -v $(pwd)/data/database.db:/app/database.db \
  -v $(pwd)/data/uploads:/app/uploads \
  -v $(pwd)/data/backups:/app/backups \
  --restart unless-stopped \
  <your-dockerhub-username>/webtool:latest
```

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| PORT | 服务端口 | 3000 | 否 |
| NODE_ENV | 运行环境 | production | 否 |
| JWT_SECRET | JWT密钥 | - | 是 |
| ADMIN_USERNAME | 管理员用户名 | admin | 否 |
| ADMIN_PASSWORD | 管理员密码 | 123456 | 否 |
| AUTO_BACKUP_SCHEDULE | 自动备份频率 | daily | 否 |
| TZ | 时区 | Asia/Shanghai | 否 |

### 自动备份频率选项

- `daily` - 每天凌晨 2:00 备份
- `weekly` - 每周日凌晨 2:00 备份
- `monthly` - 每月 1 号凌晨 2:00 备份
- `disabled` - 禁用自动备份

### 数据持久化

建议挂载以下目录以持久化数据：

- `/app/database.db` - SQLite 数据库文件
- `/app/uploads` - 上传的文件（Logo、图片等）
- `/app/backups` - 自动备份文件

## 🔨 构建自己的镜像

### 1. 本地构建

```bash
# 构建镜像
docker build -t webtool:latest .

# 运行镜像
docker run -d -p 3000:3000 webtool:latest
```

### 2. 多平台构建

```bash
# 创建 buildx builder
docker buildx create --use

# 构建并推送多平台镜像
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t <your-dockerhub-username>/webtool:latest \
  --push .
```

## 🤖 GitHub Actions 自动构建

本项目已配置 GitHub Actions 自动构建流程。

### 配置步骤

1. **设置 Docker Hub Secrets**

在 GitHub 仓库设置中添加以下 Secrets：

- `DOCKER_USERNAME` - Docker Hub 用户名
- `DOCKER_PASSWORD` - Docker Hub 访问令牌

2. **触发构建**

以下操作会自动触发镜像构建：

- 推送代码到 `main` 或 `master` 分支
- 创建版本标签（如 `v1.0.0`）
- 手动触发 workflow

3. **镜像标签**

- `latest` - 最新的 main/master 分支构建
- `<branch-name>` - 分支名称
- `v1.0.0` - 版本标签
- `1.0` - 主次版本号
- `1` - 主版本号

## 📦 镜像信息

- **基础镜像**: node:18-alpine
- **支持平台**: linux/amd64, linux/arm64
- **镜像大小**: ~150MB (压缩后)

## 🔍 健康检查

容器包含健康检查功能，每 30 秒检查一次应用状态：

```bash
# 查看健康状态
docker ps
docker inspect webtool-nav | grep -A 10 Health
```

## 🛠️ 常用命令

### 管理容器

```bash
# 启动容器
docker-compose start

# 停止容器
docker-compose stop

# 重启容器
docker-compose restart

# 删除容器
docker-compose down

# 删除容器和数据卷
docker-compose down -v
```

### 查看日志

```bash
# 实时查看日志
docker-compose logs -f

# 查看最近 100 行日志
docker-compose logs --tail=100
```

### 进入容器

```bash
# 进入容器 shell
docker-compose exec webtool sh

# 或使用 docker 命令
docker exec -it webtool-nav sh
```

### 备份数据

```bash
# 备份数据库
docker cp webtool-nav:/app/database.db ./backup-$(date +%Y%m%d).db

# 备份上传文件
docker cp webtool-nav:/app/uploads ./uploads-backup-$(date +%Y%m%d)
```

## 🔐 安全建议

1. **修改默认密码**：首次部署后立即修改管理员密码
2. **使用强密钥**：为 JWT_SECRET 设置足够复杂的密钥
3. **限制访问**：使用反向代理（如 Nginx）限制访问
4. **启用 HTTPS**：在生产环境中使用 SSL/TLS
5. **定期备份**：定期备份数据库和上传文件

## 🐛 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker logs webtool-nav

# 检查容器状态
docker ps -a
```

### 端口被占用

修改 docker-compose.yml 中的端口映射：

```yaml
ports:
  - "8080:3000"  # 使用 8080 端口
```

### 数据丢失

确保正确挂载了数据卷：

```bash
docker inspect webtool-nav | grep -A 10 Mounts
```

## 📚 更多信息

- [主文档](./README.md)
- [快速开始](./QUICKSTART.md)
- [部署指南](./DEPLOY.md)

## 💬 支持

如有问题，请提交 Issue 或查看文档。
