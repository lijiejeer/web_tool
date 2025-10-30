<template>
  <div class="home-page">
    <!-- 左侧广告 -->
    <div class="ad-left" v-if="leftAds.length > 0">
      <div class="ad-item" v-for="ad in leftAds" :key="ad.id">
        <button class="ad-close" @click="closeAd('left', ad.id)">×</button>
        <a :href="ad.link_url" target="_blank" v-if="ad.link_url">
          <img :src="ad.image_url" :alt="ad.title" />
        </a>
        <img v-else :src="ad.image_url" :alt="ad.title" />
      </div>
    </div>

    <!-- 右侧广告 -->
    <div class="ad-right" v-if="rightAds.length > 0">
      <div class="ad-item" v-for="ad in rightAds" :key="ad.id">
        <button class="ad-close" @click="closeAd('right', ad.id)">×</button>
        <a :href="ad.link_url" target="_blank" v-if="ad.link_url">
          <img :src="ad.image_url" :alt="ad.title" />
        </a>
        <img v-else :src="ad.image_url" :alt="ad.title" />
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部搜索区 -->
      <header class="header">
        <div class="header-content">
          <h1 class="site-title">Web Tool</h1>
          <p class="site-subtitle">在线工具导航</p>
          
          <!-- 搜索框 -->
          <div class="search-box">
            <div class="search-tabs">
              <button
                v-for="engine in searchEngines"
                :key="engine.value"
                :class="['tab', { active: currentEngine === engine.value }]"
                @click="currentEngine = engine.value"
              >
                {{ engine.label }}
              </button>
            </div>
            <div class="search-input-wrapper">
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="请输入搜索关键词..."
                @keyup.enter="handleSearch"
                class="search-input"
              />
              <button @click="handleSearch" class="search-btn">
                搜索
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 导航内容 -->
      <div class="nav-content">
        <div class="container">
          <!-- 分类导航 -->
          <div class="categories" v-for="category in categories" :key="category.id">
            <h2 class="category-title">
              <i :class="category.icon || 'el-icon-folder'"></i>
              {{ category.name }}
            </h2>
            
            <!-- 子分类 -->
            <div v-if="category.children && category.children.length > 0">
              <div v-for="subCategory in category.children" :key="subCategory.id" class="sub-category">
                <h3 class="sub-category-title">{{ subCategory.name }}</h3>
                <div class="cards-grid">
                  <a
                    v-for="card in getCardsByCategory(subCategory.id)"
                    :key="card.id"
                    :href="card.url"
                    target="_blank"
                    class="card"
                  >
                    <div class="card-icon">
                      <img v-if="card.logo" :src="card.logo" :alt="card.title" @error="handleImageError" />
                      <span v-else class="icon-placeholder">{{ card.title.charAt(0) }}</span>
                    </div>
                    <div class="card-info">
                      <h4 class="card-title">{{ card.title }}</h4>
                      <p class="card-desc" v-if="card.description">{{ card.description }}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <!-- 直接属于当前分类的卡片 -->
            <div class="cards-grid" v-if="getCardsByCategory(category.id).length > 0">
              <a
                v-for="card in getCardsByCategory(category.id)"
                :key="card.id"
                :href="card.url"
                target="_blank"
                class="card"
              >
                <div class="card-icon">
                  <img v-if="card.logo" :src="card.logo" :alt="card.title" @error="handleImageError" />
                  <span v-else class="icon-placeholder">{{ card.title.charAt(0) }}</span>
                </div>
                <div class="card-info">
                  <h4 class="card-title">{{ card.title }}</h4>
                  <p class="card-desc" v-if="card.description">{{ card.description }}</p>
                </div>
              </a>
            </div>
          </div>

          <!-- 友情链接 -->
          <div class="friendlinks" v-if="friendlinks.length > 0">
            <h2 class="category-title">
              <i class="el-icon-link"></i>
              友情链接
            </h2>
            <div class="friendlink-list">
              <a
                v-for="link in friendlinks"
                :key="link.id"
                :href="link.url"
                target="_blank"
                class="friendlink-item"
              >
                {{ link.name }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <footer class="footer">
        <p>&copy; 2024 Web Tool. All rights reserved.</p>
        <p>
          <a href="/admin/login" style="color: #999;">管理后台</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCategories } from '@/api/category'
import { getCards } from '@/api/card'
import { getAds } from '@/api/ad'
import { getFriendlinks } from '@/api/friendlink'

const categories = ref([])
const cards = ref([])
const allAds = ref([])
const friendlinks = ref([])
const searchKeyword = ref('')
const currentEngine = ref('google')
const closedAds = ref({
  left: [],
  right: []
})

const searchEngines = [
  { label: 'Google', value: 'google', url: 'https://www.google.com/search?q=' },
  { label: '百度', value: 'baidu', url: 'https://www.baidu.com/s?wd=' },
  { label: 'Bing', value: 'bing', url: 'https://www.bing.com/search?q=' },
  { label: 'GitHub', value: 'github', url: 'https://github.com/search?q=' },
  { label: '站内', value: 'site', url: '/search?q=' }
]

const leftAds = computed(() => {
  return allAds.value.filter(ad => 
    ad.position === 'left' && 
    ad.is_active === 1 && 
    !closedAds.value.left.includes(ad.id)
  )
})

const rightAds = computed(() => {
  return allAds.value.filter(ad => 
    ad.position === 'right' && 
    ad.is_active === 1 && 
    !closedAds.value.right.includes(ad.id)
  )
})

const getCardsByCategory = (categoryId) => {
  return cards.value.filter(card => card.category_id === categoryId)
}

const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  
  const engine = searchEngines.find(e => e.value === currentEngine.value)
  if (engine) {
    if (currentEngine.value === 'site') {
      // 站内搜索逻辑
      console.log('站内搜索:', searchKeyword.value)
    } else {
      window.open(engine.url + encodeURIComponent(searchKeyword.value), '_blank')
    }
  }
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
}

const closeAd = (position, adId) => {
  closedAds.value[position].push(adId)
}

const loadData = async () => {
  try {
    const [categoriesData, cardsData, adsData, friendlinksData] = await Promise.all([
      getCategories(),
      getCards(),
      getAds({ is_active: 1 }),
      getFriendlinks({ is_active: 1 })
    ])
    
    categories.value = categoriesData
    cards.value = cardsData
    allAds.value = adsData
    friendlinks.value = friendlinksData
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

/* 广告样式 */
.ad-left,
.ad-right {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
}

.ad-left {
  left: 20px;
}

.ad-right {
  right: 20px;
}

.ad-item {
  position: relative;
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.ad-item img {
  display: block;
  max-width: 200px;
  height: auto;
}

.ad-close {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  z-index: 10;
}

.ad-close:hover {
  background: rgba(0, 0, 0, 0.7);
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 头部样式 */
.header {
  padding: 60px 0 40px;
  text-align: center;
}

.header-content {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
}

.site-title {
  font-size: 48px;
  color: white;
  margin-bottom: 10px;
  font-weight: 700;
}

.site-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
}

/* 搜索框样式 */
.search-box {
  max-width: 600px;
  margin: 0 auto;
}

.search-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  justify-content: center;
}

.search-tabs .tab {
  padding: 8px 20px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-tabs .tab:hover {
  background: rgba(255, 255, 255, 0.3);
}

.search-tabs .tab.active {
  background: white;
  color: #667eea;
}

.search-input-wrapper {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
}

.search-btn {
  padding: 12px 30px;
  border: none;
  background: white;
  color: #667eea;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 导航内容 */
.nav-content {
  padding: 40px 0;
}

.container {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.categories {
  margin-bottom: 50px;
}

.category-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
}

.category-title i {
  margin-right: 10px;
  color: #667eea;
}

.sub-category {
  margin-bottom: 30px;
}

.sub-category-title {
  font-size: 18px;
  color: #666;
  margin-bottom: 15px;
}

/* 卡片网格 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  display: flex;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
  border: 1px solid #eee;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.card-icon {
  width: 48px;
  height: 48px;
  margin-right: 15px;
  flex-shrink: 0;
}

.card-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.icon-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  font-weight: 600;
  border-radius: 8px;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  font-size: 13px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 友情链接 */
.friendlinks {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.friendlink-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.friendlink-item {
  padding: 8px 20px;
  background: #f5f5f5;
  border-radius: 20px;
  text-decoration: none;
  color: #666;
  transition: all 0.3s;
}

.friendlink-item:hover {
  background: #667eea;
  color: white;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 40px 0;
  color: rgba(255, 255, 255, 0.8);
}

.footer p {
  margin: 5px 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .ad-left,
  .ad-right {
    display: none;
  }
}

@media (max-width: 768px) {
  .site-title {
    font-size: 32px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    padding: 30px 20px;
  }

  .container {
    padding: 20px;
  }
}
</style>
