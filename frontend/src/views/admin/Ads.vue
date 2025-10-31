<template>
  <div class="ads-page">
    <div class="page-header">
      <h1 class="page-title">广告管理</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加广告
      </el-button>
    </div>

    <el-card>
      <el-table :data="ads" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图片" width="120">
          <template #default="{ row }">
            <img :src="row.image_url" style="width: 100px; height: auto;" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="position" label="位置" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.position === 'left'" type="primary">左侧</el-tag>
            <el-tag v-else-if="row.position === 'right'" type="success">右侧</el-tag>
            <el-tag v-else>{{ row.position }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="link_url" label="链接" show-overflow-tooltip />
        <el-table-column prop="is_active" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.is_active === 1" type="success">启用</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort_order" label="排序" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑广告' : '添加广告'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-select v-model="form.position" placeholder="请选择位置" style="width: 100%">
            <el-option label="左侧" value="left" />
            <el-option label="右侧" value="right" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片地址" prop="image_url">
          <el-input v-model="form.image_url" placeholder="请输入图片地址" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="form.link_url" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.is_active"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAds, createAd, updateAd, deleteAd } from '@/api/ad'

const ads = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref(null)

const form = ref({
  id: null,
  title: '',
  position: 'left',
  image_url: '',
  link_url: '',
  sort_order: 0,
  is_active: 1
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  position: [{ required: true, message: '请选择位置', trigger: 'change' }],
  image_url: [{ required: true, message: '请输入图片地址', trigger: 'blur' }]
}

const loadAds = async () => {
  try {
    const data = await getAds()
    ads.value = data
  } catch (error) {
    ElMessage.error('加载广告失败')
  }
}

const handleAdd = () => {
  isEdit.value = false
  form.value = {
    id: null,
    title: '',
    position: 'left',
    image_url: '',
    link_url: '',
    sort_order: 0,
    is_active: 1
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (isEdit.value) {
          await updateAd(form.value.id, form.value)
          ElMessage.success('更新成功')
        } else {
          await createAd(form.value)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadAds()
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该广告吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteAd(row.id)
    ElMessage.success('删除成功')
    loadAds()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadAds()
})
</script>

<style scoped>
.ads-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin: 0;
}
</style>
