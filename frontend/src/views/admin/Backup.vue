<template>
  <div class="backup-page">
    <h1 class="page-title">备份与恢复</h1>

    <!-- 备份信息卡片 -->
    <el-row :gutter="20" class="info-row">
      <el-col :span="8">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><Database /></el-icon>
              <span>数据库</span>
            </div>
          </template>
          <div class="info-content">
            <div class="info-value">{{ backupInfo.database?.sizeFormatted || '0 B' }}</div>
            <div class="info-label">数据库大小</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><Folder /></el-icon>
              <span>上传文件</span>
            </div>
          </template>
          <div class="info-content">
            <div class="info-value">{{ backupInfo.uploads?.sizeFormatted || '0 B' }}</div>
            <div class="info-label">{{ backupInfo.uploads?.fileCount || 0 }} 个文件</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><DocumentCopy /></el-icon>
              <span>总计</span>
            </div>
          </template>
          <div class="info-content">
            <div class="info-value">{{ backupInfo.total?.sizeFormatted || '0 B' }}</div>
            <div class="info-label">备份总大小</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作区域 -->
    <el-card class="operation-card">
      <template #header>
        <div class="card-header">
          <span>备份操作</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="operation-section">
            <div class="operation-icon">
              <el-icon size="48" color="#67C23A"><Download /></el-icon>
            </div>
            <h3>备份数据</h3>
            <p class="operation-desc">
              将数据库和上传的文件打包为 ZIP 压缩包下载到本地。
              建议定期备份数据以防数据丢失。
            </p>
            <el-button 
              type="success" 
              size="large"
              :loading="downloadLoading"
              @click="handleDownloadBackup"
            >
              <el-icon><Download /></el-icon>
              <span>立即备份</span>
            </el-button>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="operation-section">
            <div class="operation-icon">
              <el-icon size="48" color="#E6A23C"><Upload /></el-icon>
            </div>
            <h3>恢复数据</h3>
            <p class="operation-desc">
              从之前备份的 ZIP 压缩包恢复数据。
              <span style="color: #F56C6C;">注意：恢复操作会覆盖当前所有数据！</span>
            </p>
            <el-upload
              ref="uploadRef"
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              :show-file-list="false"
              accept=".zip"
            >
              <el-button 
                type="warning" 
                size="large"
                :loading="restoreLoading"
              >
                <el-icon><Upload /></el-icon>
                <span>选择备份文件</span>
              </el-button>
            </el-upload>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 注意事项 -->
    <el-card class="tips-card">
      <template #header>
        <div class="card-header">
          <el-icon><Warning /></el-icon>
          <span>重要提示</span>
        </div>
      </template>
      <ul class="tips-list">
        <li><el-icon><Check /></el-icon> 备份文件包含数据库和所有上传的文件（如Logo、图片等）</li>
        <li><el-icon><Check /></el-icon> 建议定期备份数据，特别是在进行重要操作前</li>
        <li><el-icon><Check /></el-icon> 备份文件可在任何时候恢复，但会覆盖当前数据</li>
        <li><el-icon><Warning /></el-icon> 恢复操作不可逆，请确保备份文件正确</li>
        <li><el-icon><Warning /></el-icon> 恢复后建议重启服务器以确保所有更改生效</li>
        <li><el-icon><InfoFilled /></el-icon> 备份文件仅包含业务数据，不包含系统配置</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBackupInfo, downloadBackup, restoreBackup } from '@/api/backup'

const backupInfo = ref({})
const downloadLoading = ref(false)
const restoreLoading = ref(false)
const uploadRef = ref(null)

// 加载备份信息
const loadBackupInfo = async () => {
  try {
    const data = await getBackupInfo()
    backupInfo.value = data
  } catch (error) {
    console.error('加载备份信息失败:', error)
  }
}

// 下载备份
const handleDownloadBackup = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要创建数据备份吗？备份文件将下载到本地。',
      '确认备份',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    downloadLoading.value = true
    
    const blob = await downloadBackup()
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // 生成文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0]
    link.download = `webtool-backup-${timestamp}.zip`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('备份下载成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('备份下载失败:', error)
      ElMessage.error('备份下载失败')
    }
  } finally {
    downloadLoading.value = false
  }
}

// 文件选择变化
const handleFileChange = async (file) => {
  if (!file) return

  try {
    await ElMessageBox.confirm(
      '恢复备份将会覆盖当前所有数据，此操作不可逆！是否继续？',
      '警告',
      {
        confirmButtonText: '确定恢复',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }
    )

    restoreLoading.value = true
    
    const result = await restoreBackup(file.raw)
    
    ElMessage.success({
      message: '备份恢复成功！建议刷新页面以查看最新数据。',
      duration: 5000
    })
    
    // 3秒后刷新页面
    setTimeout(() => {
      window.location.reload()
    }, 3000)
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error('备份恢复失败:', error)
      ElMessage.error('备份恢复失败：' + (error.response?.data?.error || error.message))
    }
  } finally {
    restoreLoading.value = false
    // 清空文件选择
    if (uploadRef.value) {
      uploadRef.value.clearFiles()
    }
  }
}

onMounted(() => {
  loadBackupInfo()
})
</script>

<style scoped>
.backup-page {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.info-row {
  margin-bottom: 20px;
}

.info-card {
  cursor: default;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.info-content {
  text-align: center;
  padding: 20px 0;
}

.info-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.info-label {
  font-size: 14px;
  color: #999;
}

.operation-card {
  margin-bottom: 20px;
}

.operation-section {
  text-align: center;
  padding: 30px 20px;
}

.operation-icon {
  margin-bottom: 20px;
}

.operation-section h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.operation-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 25px;
  min-height: 60px;
}

.operation-section .el-button {
  width: 200px;
}

.tips-card {
  background: #FFF9E6;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.tips-list li .el-icon {
  margin-top: 3px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .info-row .el-col {
    margin-bottom: 10px;
  }

  .operation-section {
    padding: 20px 10px;
  }

  .operation-desc {
    min-height: auto;
  }
}
</style>
