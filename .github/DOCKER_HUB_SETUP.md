# GitHub Actions Docker Hub 配置指南

本文档说明如何配置 GitHub Actions 自动构建和推送 Docker 镜像到 Docker Hub。

## 📋 前置要求

1. GitHub 账号
2. Docker Hub 账号

## 🔧 配置步骤

### 1. 创建 Docker Hub 访问令牌

1. 登录 [Docker Hub](https://hub.docker.com/)
2. 点击右上角头像 → Account Settings
3. 选择 Security → New Access Token
4. 设置令牌名称（如 `github-actions`）
5. 选择权限：Read, Write, Delete
6. 点击 Generate 并复制令牌（只显示一次）

### 2. 配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 Settings → Secrets and variables → Actions
3. 点击 New repository secret
4. 添加以下两个 secrets：

**DOCKER_USERNAME**
- Name: `DOCKER_USERNAME`
- Secret: 你的 Docker Hub 用户名

**DOCKER_PASSWORD**  
- Name: `DOCKER_PASSWORD`
- Secret: 刚才创建的访问令牌

### 3. 修改镜像名称

编辑 `.github/workflows/build-image.yml`，修改镜像名称：

```yaml
env:
  REGISTRY: docker.io
  IMAGE_NAME: your-dockerhub-username/webtool  # 修改为你的用户名和镜像名
```

## 🚀 触发构建

构建会在以下情况自动触发：

1. **推送到主分支**
   ```bash
   git push origin main
   ```

2. **创建版本标签**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **手动触发**
   - 进入 GitHub 仓库
   - 点击 Actions 标签
   - 选择 "Build and Push Docker Image"
   - 点击 "Run workflow"

## 📦 镜像标签

自动构建会生成以下标签：

- `latest` - 最新的 main/master 分支
- `main` - main 分支
- `v1.0.0` - 版本标签
- `1.0` - 主次版本号
- `1` - 主版本号

## 🔍 查看构建状态

1. 进入 GitHub 仓库
2. 点击 Actions 标签
3. 查看工作流运行状态
4. 点击具体的运行记录查看详细日志

## 📥 拉取镜像

构建成功后，可以从 Docker Hub 拉取：

```bash
docker pull your-dockerhub-username/webtool:latest
```

## ❌ 常见问题

### 1. 认证失败

- 检查 DOCKER_USERNAME 是否正确
- 确认 DOCKER_PASSWORD 是访问令牌，不是密码
- 令牌权限是否包含 Write

### 2. 找不到镜像

- 确认 IMAGE_NAME 配置正确
- 检查 Docker Hub 仓库是否存在
- 仓库可见性设置（Public/Private）

### 3. 构建超时

- 检查网络连接
- 依赖下载可能较慢
- 考虑使用缓存加速

## 🔒 安全建议

1. **不要直接提交密码或令牌到代码**
2. **定期更新访问令牌**
3. **使用最小权限原则**
4. **监控镜像拉取和使用情况**

## 📚 相关文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Docker Hub 文档](https://docs.docker.com/docker-hub/)
- [Docker Buildx 文档](https://docs.docker.com/build/buildx/)

## 💡 高级配置

### 多仓库推送

如需推送到多个仓库（如 Docker Hub 和 GitHub Container Registry）：

```yaml
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Build and push to multiple registries
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: |
      docker.io/${{ github.repository }}:latest
      ghcr.io/${{ github.repository }}:latest
```

### 构建缓存优化

已配置 GitHub Actions Cache，加速构建：

```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

### 自定义构建参数

```yaml
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    build-args: |
      NODE_VERSION=18
      BUILD_DATE=${{ github.event.head_commit.timestamp }}
```

## 🎉 完成

配置完成后，每次推送代码或创建标签，都会自动构建并推送 Docker 镜像！
