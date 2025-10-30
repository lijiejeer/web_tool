<template>
  <div class="cards-page">
    <div class="page-header">
      <h1 class="page-title">卡片管理</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加卡片
      </el-button>
    </div>

    <el-card>
      <div class="filter-bar">
        <el-select
          v-model="filterCategoryId"
          placeholder="选择栏目筛选"
          clearable
          @change="loadCards"
          style="width: 200px"
        >
          <el-option label="全部栏目" :value="null" />
          <el-option
            v-for="cat in allCategories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
      </div>

      <el-table :data="cards" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="Logo" width="80">
          <template #default="{ row }">
            <img v-if="row.logo" :src="row.logo" style="width: 40px; height: 40px; object-fit: contain;" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="url" label="链接" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="栏目" width="150">
          <template #default="{ row }">
            {{ getCategoryName(row.category_id) }}
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
      :title="isEdit ? '编辑卡片' : '添加卡片'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入网址">
            <template #append>
              <el-button :loading="parsing" @click="handleParseUrl">
                解析网站信息
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="Logo">
          <el-input v-model="form.logo" placeholder="请输入Logo地址" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="栏目" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择栏目" style="width: 100%">
            <el-option
              v-for="cat in allCategories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
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
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  parseWebsite
} from '@/api/card'
import { getCategories } from '@/api/category'

const cards = ref([])
const categories = ref([])
const filterCategoryId = ref(null)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const parsing = ref(false)
const formRef = ref(null)

const form = ref({
  id: null,
  category_id: null,
  title: '',
  url: '',
  logo: '',
  description: '',
  sort_order: 0
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
  category_id: [{ required: true, message: '请选择栏目', trigger: 'change' }]
}

// 扁平化所有栏目（包括子栏目）
const allCategories = computed(() => {
  const result = []
  const flatten = (cats, prefix = '') => {
    cats.forEach(cat => {
      result.push({
        id: cat.id,
        name: prefix + cat.name
      })
      if (cat.children && cat.children.length > 0) {
        flatten(cat.children, prefix + cat.name + ' / ')
      }
    })
  }
  flatten(categories.value)
  return result
})

const getCategoryName = (categoryId) => {
  const cat = allCategories.value.find(c => c.id === categoryId)
  return cat ? cat.name : ''
}

const loadCategories = async () => {
  try {
    const data = await getCategories()
    categories.value = data
  } catch (error) {
    ElMessage.error('加载栏目失败')
  }
}

const loadCards = async () => {
  try {
    const params = filterCategoryId.value ? { category_id: filterCategoryId.value } : {}
    const data = await getCards(params)
    cards.value = data
  } catch (error) {
    ElMessage.error('加载卡片失败')
  }
}

const handleParseUrl = async () => {
  if (!form.value.url) {
    ElMessage.warning('请先输入网址')
    return
  }

  parsing.value = true
  try {
    const info = await parseWebsite(form.value.url)
    form.value.title = info.title
    form.value.logo = info.logo
    form.value.description = info.description
    ElMessage.success('解析成功')
  } catch (error) {
    ElMessage.error('解析失败')
  } finally {
    parsing.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  form.value = {
    id: null,
    category_id: filterCategoryId.value || null,
    title: '',
    url: '',
    logo: '',
    description: '',
    sort_order: 0
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
          await updateCard(form.value.id, form.value)
          ElMessage.success('更新成功')
        } else {
          await createCard(form.value)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadCards()
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
    await ElMessageBox.confirm('确定要删除该卡片吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteCard(row.id)
    ElMessage.success('删除成功')
    loadCards()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadCategories()
  loadCards()
})
</script>

<style scoped>
.cards-page {
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

.filter-bar {
  margin-bottom: 20px;
}
</style>
