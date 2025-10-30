<template>
  <div class="logs-page">
    <h1 class="page-title">登录日志</h1>

    <el-card>
      <el-table :data="logs" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="ip_address" label="IP地址" width="150" />
        <el-table-column prop="user_agent" label="User Agent" show-overflow-tooltip />
        <el-table-column prop="login_time" label="登录时间" width="180" />
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadLogs"
          @current-change="loadLogs"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getLoginLogs } from '@/api/stats'

const logs = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const loadLogs = async () => {
  try {
    const data = await getLoginLogs({
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value
    })
    logs.value = data.data
    total.value = data.total
  } catch (error) {
    ElMessage.error('加载日志失败')
  }
}

onMounted(() => {
  loadLogs()
})
</script>

<style scoped>
.logs-page {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
