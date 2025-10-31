# 贡献指南

感谢您考虑为 Web Tool 项目做出贡献！

## 🤝 如何贡献

### 报告问题

如果您发现了 bug 或有功能建议，请：

1. 在 [Issues](../../issues) 中搜索是否已有相关问题
2. 如果没有，创建新的 Issue
3. 清楚地描述问题或建议
4. 如果是 bug，请提供复现步骤

### 提交代码

1. **Fork 项目**

   点击页面右上角的 Fork 按钮

2. **克隆到本地**

   ```bash
   git clone https://github.com/YOUR-USERNAME/web_tool.git
   cd web_tool
   ```

3. **创建分支**

   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

4. **开发和测试**

   ```bash
   # 安装依赖
   npm run install:all
   
   # 启动开发服务器
   npm run dev:backend
   npm run dev:frontend
   
   # 进行您的修改...
   ```

5. **提交更改**

   ```bash
   git add .
   git commit -m "feat: add some feature"
   # 或
   git commit -m "fix: fix some bug"
   ```

   提交信息格式：
   - `feat:` 新功能
   - `fix:` 修复 bug
   - `docs:` 文档更新
   - `style:` 代码格式调整
   - `refactor:` 代码重构
   - `test:` 测试相关
   - `chore:` 构建/工具相关

6. **推送到 GitHub**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**

   - 访问您的 Fork 仓库
   - 点击 "New Pull Request"
   - 填写 PR 描述
   - 等待审核

## 📝 代码规范

### JavaScript/Vue 风格

- 使用 2 空格缩进
- 使用单引号
- 文件末尾保留空行
- 使用 ES6+ 语法
- Vue 组件使用 Composition API

示例：

```javascript
// 好的示例
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const data = ref([])
    
    onMounted(() => {
      loadData()
    })
    
    return { data }
  }
}

// 避免的示例
import {ref,onMounted} from "vue";
export default{
  setup(){
    const data=ref([]);
    onMounted(()=>{loadData();});
    return{data};
  }
};
```

### 后端代码

- 使用 async/await 处理异步
- 添加适当的错误处理
- 使用有意义的变量名
- 添加必要的注释

示例：

```javascript
// 好的示例
export const getCards = async (req, res) => {
  try {
    const { category_id } = req.query
    const cards = db.prepare('SELECT * FROM cards WHERE category_id = ?').all(category_id)
    res.json(cards)
  } catch (error) {
    console.error('Get cards error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

### Vue 组件

- 组件名使用 PascalCase
- Props 使用 camelCase
- 事件名使用 kebab-case
- 使用 `<script setup>` 语法

示例：

```vue
<template>
  <div class="my-component">
    <h1>{{ title }}</h1>
    <button @click="handleClick">Click</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String
})

const emit = defineEmits(['custom-event'])

const handleClick = () => {
  emit('custom-event', 'data')
}
</script>

<style scoped>
.my-component {
  padding: 20px;
}
</style>
```

## 🧪 测试

在提交 PR 前，请确保：

- [ ] 代码可以正常编译
- [ ] 前端页面显示正常
- [ ] API 接口工作正常
- [ ] 没有控制台错误
- [ ] 在主流浏览器中测试过

## 📚 文档

如果您添加了新功能或修改了现有功能，请：

- 更新相关的 README 章节
- 添加或更新 API 文档
- 如有必要，更新快速开始指南

## 🐛 Bug 修复

修复 bug 时：

1. 在 Issue 中描述 bug
2. 创建 fix 分支
3. 添加能复现 bug 的测试用例（如果可能）
4. 修复 bug
5. 验证修复有效
6. 提交 PR 并关联相关 Issue

## ✨ 新功能

添加新功能前：

1. 先创建 Issue 讨论功能的必要性
2. 等待维护者反馈
3. 获得认可后再开始开发
4. 保持功能简单、可维护
5. 添加必要的文档

## 🔍 代码审查

提交 PR 后：

- 保持耐心等待审查
- 及时回复审查意见
- 根据反馈修改代码
- 保持友好的沟通态度

## 💡 功能建议

我们欢迎以下类型的贡献：

### 前端改进
- UI/UX 优化
- 响应式设计改进
- 新的搜索引擎集成
- 主题和样式定制
- 性能优化

### 后端改进
- API 性能优化
- 新的数据统计功能
- 更好的错误处理
- 安全性增强
- 缓存策略

### 功能增强
- 多语言支持
- 数据导入/导出
- 批量操作
- 高级搜索
- 用户权限系统
- 主题切换
- 暗色模式

### 文档改进
- 翻译文档
- 添加示例
- 改进说明
- 录制视频教程

## 🚫 不接受的贡献

- 与项目目标不符的功能
- 过于复杂的实现
- 未经讨论的重大重构
- 不符合代码规范的代码
- 缺少文档的新功能

## 📧 联系方式

如有问题，可以通过以下方式联系：

- 创建 Issue
- 参与 Discussions
- 在 PR 中评论

## 🙏 致谢

感谢所有为项目做出贡献的开发者！

您的贡献将被记录在：
- Contributors 页面
- CHANGELOG.md
- 版本发布说明

---

再次感谢您的贡献！🎉
