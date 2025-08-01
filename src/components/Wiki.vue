<template>
  <!-- 主容器，设置全屏高度和相对定位 -->
  <div class="main-container">
    <!-- 背景图片容器 -->
    <div class="background-image"></div>

    <!-- 毛玻璃导航栏 -->
    <nav class="glass-navbar">
      <div class="navbar-content">
        <!-- Logo - 绝对定位到左侧 -->
        <div class="navbar-logo">
          <div class="logo">
            <span>沧海彼岸</span>
          </div>
        </div>

        <!-- 中间导航菜单 - 绝对居中 -->
        <div class="navbar-center">
          <ul class="nav-menu">
            <li><a href="#home" @click="goHome">首页</a></li>
            <li><a href="#wiki" class="active">Wiki</a></li>
            <li><a href="#services">服务</a></li>
            <li><a href="#contact">联系</a></li>
          </ul>
        </div>

        <!-- 用户头像 - 绝对定位到右侧 -->
        <div class="navbar-right">
          <div class="user-dropdown" @click="toggleDropdown" ref="dropdownRef">
            <!-- 用户头像 -->
            <div class="user-avatar">
              <img
                  src="@/assets/picture/picture4.jpg?height=40&width=40"
                  alt="用户头像"
                  class="avatar-image"
              />
              <!-- 在线状态指示器 -->
              <div class="online-indicator"></div>
            </div>

            <!-- 下拉菜单 -->
            <div class="dropdown-menu" :class="{ 'show': isDropdownOpen }">
              <div class="dropdown-header">
                <div class="user-info">
                  <div class="user-name">用户名</div>
                  <div class="user-email">user@example.com</div>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <ul class="dropdown-list">
                <li class="dropdown-item" @click="goToProfile">
                  <div class="item-icon">👤</div>
                  <span>个人中心</span>
                </li>
                <li class="dropdown-item" @click="showHelp">
                  <div class="item-icon">❓</div>
                  <span>帮助</span>
                </li>
                <li class="dropdown-divider"></li>
                <li class="dropdown-item logout" @click="logout">
                  <div class="item-icon">🚪</div>
                  <span>退出登录</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Wiki主要内容区域 -->
    <div class="main-content" @click="closeDropdown">
      <div class="wiki-container">
        <!-- Wiki头部搜索区域 -->
        <div class="wiki-header">
          <div class="wiki-title-section">
            <h1 class="wiki-title">沧海彼岸Wiki百科</h1>
          </div>

          <!-- 搜索栏 -->
          <div class="search-section">
            <div class="search-bar">
              <div class="search-input-wrapper">
                <input
                    type="text"
                    v-model="searchQuery"
                    @input="handleSearch"
                    placeholder="搜索Wiki条目..."
                    class="search-input"
                />
                <button class="search-btn" @click="performSearch">
                  <span class="search-icon">🔍</span>
                </button>
              </div>
            </div>

            <!-- 快速操作按钮 -->
            <div class="quick-actions">
              <button class="action-btn primary" @click="showCreateModal">
                <span class="btn-icon">➕</span>
                <span>新建条目</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Wiki内容区域 -->
        <div class="wiki-content">
          <!-- 左侧导航栏 -->
          <div class="wiki-sidebar">
            <div class="sidebar-header">
              <h3 class="sidebar-title">📖 条目导航</h3>
              <button class="collapse-btn" @click="toggleSidebar">
                <span :class="['collapse-icon', { 'collapsed': sidebarCollapsed }]">◀</span>
              </button>
            </div>

            <div class="sidebar-content" :class="{ 'collapsed': sidebarCollapsed }">
              <!-- 分类导航 -->
              <div class="category-nav">
                <div
                    v-for="category in categories"
                    :key="category.id"
                    class="category-item"
                    :class="{ 'active': activeCategory === category.id }"
                >
                  <div class="category-header" @click="toggleCategory(category.id)">
                    <span class="category-icon">{{ category.icon }}</span>
                    <span class="category-name">{{ category.name }}</span>
                    <span class="category-count">({{ category.entries.length }})</span>
                    <span :class="['expand-icon', { 'expanded': expandedCategories.includes(category.id) }]">▼</span>
                  </div>

                  <!-- 子条目列表 -->
                  <div
                      v-if="expandedCategories.includes(category.id)"
                      class="category-entries"
                  >
                    <div
                        v-for="entry in category.entries"
                        :key="entry.id"
                        class="entry-item"
                        :class="{ 'active': activeEntry === entry.id }"
                        @click="selectEntry(entry)"
                    >
                      <span class="entry-icon">📄</span>
                      <span class="category-name">{{ entry.title }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧内容展示区域 -->
          <div class="wiki-main">
            <!-- 条目内容显示 -->
            <div v-if="currentEntry" class="entry-content">
              <!-- 条目头部 -->
              <div class="entry-header">
                <div class="entry-title-section">
                  <h2 class="entry-title">{{ currentEntry.title }}</h2>
                  <div class="entry-meta">
                    <span class="meta-item">
                      <span class="meta-icon">👤</span>
                      <span>作者：{{ currentEntry.author }}</span>
                    </span>
                    <span class="meta-item">
                      <span class="meta-icon">📅</span>
                      <span>更新：{{ formatDate(currentEntry.updatedAt) }}</span>
                    </span>
                    <span class="meta-item">
                      <span class="meta-icon">👁️</span>
                      <span>浏览：{{ currentEntry.views }}</span>
                    </span>
                  </div>
                </div>

                <div class="entry-actions">
                  <button class="edit-btn" @click="editEntry(currentEntry)">
                    <span class="btn-icon">✏️</span>
                    <span>编辑</span>
                  </button>
                </div>
              </div>

              <!-- 条目内容 -->
              <div class="entry-body">
                <!-- 条目摘要 -->
                <div v-if="currentEntry.summary" class="entry-summary">
                  <h4 class="summary-title">📋 摘要</h4>
                  <p class="summary-text">{{ currentEntry.summary }}</p>
                </div>

                <!-- 条目主要内容 -->
                <div class="entry-sections">
                  <div
                      v-for="section in currentEntry.sections"
                      :key="section.id"
                      class="content-section"
                  >
                    <h3 class="section-title">{{ section.title }}</h3>
                    <div class="section-content" v-html="section.content"></div>

                    <!-- 图片展示 -->
                    <div v-if="section.images && section.images.length > 0" class="section-images">
                      <div
                          v-for="image in section.images"
                          :key="image.id"
                          class="image-item"
                          @click="openImageModal(image)"
                      >
                        <img :src="image.url" :alt="image.alt" class="section-image" />
                        <div class="image-caption">{{ image.caption }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 相关条目 -->
                <div v-if="currentEntry.relatedEntries && currentEntry.relatedEntries.length > 0" class="related-entries">
                  <h4 class="related-title">🔗 相关条目</h4>
                  <div class="related-list">
                    <a
                        v-for="related in currentEntry.relatedEntries"
                        :key="related.id"
                        class="related-link"
                        @click="selectEntryById(related.id)"
                    >
                      {{ related.title }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- 默认欢迎页面 -->
            <div v-else class="welcome-content">
              <div class="welcome-section">
                <div class="welcome-icon">📚</div>
                <h2 class="welcome-title">欢迎来到Wiki百科</h2>
                <p class="welcome-text">
                  这里是知识的宝库，您可以浏览各种条目，学习新知识，也可以贡献自己的智慧。
                </p>

                <div class="welcome-stats">
                  <div class="stat-item">
                    <div class="stat-number">{{ totalEntries }}</div>
                    <div class="stat-label">总条目数</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">{{ totalCategories }}</div>
                    <div class="stat-label">分类数量</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">{{ totalViews }}</div>
                    <div class="stat-label">总浏览量</div>
                  </div>
                </div>

                <div class="welcome-actions">
                  <button class="welcome-btn primary" @click="showCreateModal">
                    <span class="btn-icon">➕</span>
                    <span>创建第一个条目</span>
                  </button>
                  <button class="welcome-btn secondary" @click="browseCategories">
                    <span class="btn-icon">📖</span>
                    <span>浏览所有分类</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑条目模态框 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            {{ editingEntry ? '✏️ 编辑条目' : '➕ 创建新条目' }}
          </h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="saveEntry" class="entry-form">
            <!-- 基本信息 -->
            <div class="form-section">
              <h4 class="section-title">📝 基本信息</h4>

              <div class="form-group">
                <label class="form-label">条目标题</label>
                <input
                    type="text"
                    v-model="entryForm.title"
                    class="form-input"
                    placeholder="请输入条目标题"
                    required
                />
              </div>

              <div class="form-group">
                <label class="form-label">所属分类</label>
                <select v-model="entryForm.categoryId" class="form-select" required>
                  <option value="">请选择分类</option>
                  <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">条目摘要</label>
                <textarea
                    v-model="entryForm.summary"
                    class="form-textarea"
                    placeholder="请输入条目摘要（可选）"
                    rows="3"
                ></textarea>
              </div>
            </div>

            <!-- 内容编辑 -->
            <div class="form-section">
              <h4 class="section-title">📄 内容编辑</h4>

              <div
                  v-for="(section, index) in entryForm.sections"
                  :key="section.tempId"
                  class="section-editor"
              >
                <div class="section-header">
                  <input
                      type="text"
                      v-model="section.title"
                      class="section-title-input"
                      placeholder="章节标题"
                  />
                  <button
                      type="button"
                      class="remove-section-btn"
                      @click="removeSection(index)"
                      v-if="entryForm.sections.length > 1"
                  >
                    🗑️
                  </button>
                </div>

                <div class="section-content-editor">
                  <textarea
                      v-model="section.content"
                      class="content-textarea"
                      placeholder="请输入章节内容..."
                      rows="6"
                  ></textarea>
                </div>

                <!-- 图片管理 -->
                <div class="image-manager">
                  <div class="image-header">
                    <span class="image-title">🖼️ 图片管理</span>
                    <button
                        type="button"
                        class="add-image-btn"
                        @click="addImageToSection(index)"
                    >
                      ➕ 添加图片
                    </button>
                  </div>

                  <div v-if="section.images && section.images.length > 0" class="image-list">
                    <div
                        v-for="(image, imgIndex) in section.images"
                        :key="image.tempId"
                        class="image-editor"
                    >
                      <div class="image-preview">
                        <img :src="image.url" :alt="image.alt" class="preview-img" />
                        <button
                            type="button"
                            class="remove-image-btn"
                            @click="removeImageFromSection(index, imgIndex)"
                        >
                          🗑️
                        </button>
                      </div>
                      <div class="image-inputs">
                        <input
                            type="text"
                            v-model="image.caption"
                            class="image-caption-input"
                            placeholder="图片说明"
                        />
                        <input
                            type="text"
                            v-model="image.alt"
                            class="image-alt-input"
                            placeholder="替代文本"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                  type="button"
                  class="add-section-btn"
                  @click="addSection"
              >
                ➕ 添加新章节
              </button>
            </div>

            <!-- 表单操作按钮 -->
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeModal">
                取消
              </button>
              <button type="submit" class="save-btn">
                {{ editingEntry ? '保存修改' : '创建条目' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 图片查看模态框 -->
    <div v-if="imageModalVisible" class="image-modal-overlay" @click="closeImageModal">
      <div class="image-modal-content" @click.stop>
        <button class="image-modal-close" @click="closeImageModal">✕</button>
        <img :src="selectedImage.url" :alt="selectedImage.alt" class="modal-image" />
        <div class="image-modal-caption">{{ selectedImage.caption }}</div>
      </div>
    </div>

    <!-- 文件上传隐藏input -->
    <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        accept="image/*"
        style="display: none"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 响应式数据定义
const isDropdownOpen = ref(false) // 用户下拉菜单状态
const dropdownRef = ref(null) // 下拉菜单DOM引用
const searchQuery = ref('') // 搜索查询字符串
const sidebarCollapsed = ref(false) // 侧边栏折叠状态
const activeCategory = ref(null) // 当前激活的分类
const expandedCategories = ref([1, 2]) // 展开的分类ID列表
const activeEntry = ref(null) // 当前激活的条目ID
const currentEntry = ref(null) // 当前显示的条目详情
const showModal = ref(false) // 创建/编辑模态框显示状态
const editingEntry = ref(null) // 正在编辑的条目
const imageModalVisible = ref(false) // 图片查看模态框状态
const selectedImage = ref({}) // 选中的图片信息
const fileInput = ref(null) // 文件上传input引用
const currentSectionIndex = ref(0) // 当前添加图片的章节索引

// 条目表单数据
const entryForm = ref({
  title: '',
  categoryId: '',
  summary: '',
  sections: [
    {
      tempId: Date.now(),
      title: '',
      content: '',
      images: []
    }
  ]
})

// Wiki分类数据
const categories = ref([
  {
    id: 1,
    name: '科学技术',
    icon: '🔬',
    entries: [
      {
        id: 1,
        title: '人工智能',
        author: '张三',
        updatedAt: new Date('2024-01-15'),
        views: 1250,
        summary: '人工智能（AI）是计算机科学的一个分支，致力于创建能够执行通常需要人类智能的任务的系统。',
        sections: [
          {
            id: 1,
            title: '定义与概述',
            content: '<p>人工智能是指由机器展现出的智能，与人类和动物展现的自然智能形成对比。在计算机科学中，AI研究被定义为对"智能代理"的研究：任何能够感知其环境并采取行动以最大化其成功机会的设备。</p><p>现代AI技术包括机器学习、深度学习、自然语言处理、计算机视觉等多个领域。</p>',
            images: [
              {
                id: 1,
                url: '/placeholder.svg?height=300&width=500',
                alt: '人工智能概念图',
                caption: '人工智能技术的概念示意图'
              }
            ]
          },
          {
            id: 2,
            title: '发展历史',
            content: '<p>人工智能的概念可以追溯到古代，但现代AI的发展始于20世纪40年代。1956年，达特茅斯会议标志着AI作为一个学术领域的正式诞生。</p><p>经历了多次起伏，AI在21世纪迎来了新的发展高潮，特别是深度学习技术的突破。</p>',
            images: []
          }
        ],
        relatedEntries: [
          { id: 2, title: '机器学习' },
          { id: 3, title: '深度学习' }
        ]
      },
      {
        id: 2,
        title: '机器学习',
        author: '李四',
        updatedAt: new Date('2024-01-10'),
        views: 890,
        summary: '机器学习是人工智能的一个子领域，专注于开发能够从数据中学习和改进的算法。',
        sections: [
          {
            id: 1,
            title: '基本概念',
            content: '<p>机器学习是一种数据分析方法，它自动化分析模型的构建。它是人工智能的一个分支，基于系统能够从数据中学习、识别模式并在最少人工干预的情况下做出决策的想法。</p>',
            images: [
              {
                id: 1,
                url: '/placeholder.svg?height=250&width=400',
                alt: '机器学习算法',
                caption: '机器学习算法处理数据的过程'
              }
            ]
          }
        ],
        relatedEntries: [
          { id: 1, title: '人工智能' },
          { id: 3, title: '深度学习' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '历史文化',
    icon: '🏛️',
    entries: [
      {
        id: 3,
        title: '中国古代文明',
        author: '王五',
        updatedAt: new Date('2024-01-08'),
        views: 2100,
        summary: '中国古代文明是世界上最古老、最连续的文明之一，拥有五千年的悠久历史。',
        sections: [
          {
            id: 1,
            title: '文明起源',
            content: '<p>中国文明起源于黄河流域和长江流域，经历了从新石器时代到青铜时代的发展过程。夏、商、周三代奠定了中华文明的基础。</p>',
            images: [
              {
                id: 1,
                url: '/placeholder.svg?height=300&width=450',
                alt: '古代中国文物',
                caption: '中国古代文明的珍贵文物'
              }
            ]
          }
        ],
        relatedEntries: [
          { id: 4, title: '丝绸之路' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '自然科学',
    icon: '🌿',
    entries: [
      {
        id: 4,
        title: '生态系统',
        author: '赵六',
        updatedAt: new Date('2024-01-05'),
        views: 756,
        summary: '生态系统是生物群落与其环境相互作用形成的统一整体。',
        sections: [
          {
            id: 1,
            title: '生态系统的组成',
            content: '<p>生态系统由生物成分和非生物成分组成。生物成分包括生产者、消费者和分解者；非生物成分包括阳光、温度、水分、土壤等环境因子。</p>',
            images: [
              {
                id: 1,
                url: '/placeholder.svg?height=280&width=420',
                alt: '森林生态系统',
                caption: '典型的森林生态系统示意图'
              }
            ]
          }
        ],
        relatedEntries: []
      }
    ]
  }
])

// 计算属性
const totalEntries = computed(() => {
  return categories.value.reduce((total, category) => total + category.entries.length, 0)
})

const totalCategories = computed(() => categories.value.length)

const totalViews = computed(() => {
  return categories.value.reduce((total, category) => {
    return total + category.entries.reduce((sum, entry) => sum + entry.views, 0)
  }, 0)
})

// 方法定义

// 导航相关方法
const goHome = () => {
  console.log('返回首页')
  // 这里可以添加路由跳转逻辑
}

// 用户下拉菜单方法
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const goToProfile = () => {
  console.log('跳转到个人中心')
  closeDropdown()
}

const showHelp = () => {
  console.log('显示帮助')
  closeDropdown()
}

const logout = () => {
  console.log('用户退出登录')
  closeDropdown()
}

// 搜索功能
const handleSearch = () => {
  // 实时搜索逻辑
  if (searchQuery.value.trim()) {
    console.log('搜索:', searchQuery.value)
    // 这里可以添加搜索过滤逻辑
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('执行搜索:', searchQuery.value)
    // 执行具体的搜索操作
  }
}

// 侧边栏相关方法
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
    activeCategory.value = categoryId
  }
}

const selectEntry = (entry) => {
  activeEntry.value = entry.id
  currentEntry.value = entry
  // 增加浏览量
  entry.views++
}

const selectEntryById = (entryId) => {
  // 查找并选择指定ID的条目
  for (const category of categories.value) {
    const entry = category.entries.find(e => e.id === entryId)
    if (entry) {
      selectEntry(entry)
      break
    }
  }
}

// 快速操作方法
const showRandomEntry = () => {
  const allEntries = categories.value.flatMap(cat => cat.entries)
  if (allEntries.length > 0) {
    const randomEntry = allEntries[Math.floor(Math.random() * allEntries.length)]
    selectEntry(randomEntry)
  }
}

const browseCategories = () => {
  // 展开所有分类
  expandedCategories.value = categories.value.map(cat => cat.id)
}

// 条目操作方法
const editEntry = (entry) => {
  editingEntry.value = entry
  // 填充表单数据
  entryForm.value = {
    title: entry.title,
    categoryId: categories.value.find(cat =>
        cat.entries.some(e => e.id === entry.id)
    )?.id || '',
    summary: entry.summary || '',
    sections: entry.sections.map(section => ({
      tempId: Date.now() + Math.random(),
      title: section.title,
      content: section.content.replace(/<[^>]*>/g, ''), // 移除HTML标签用于编辑
      images: section.images || []
    }))
  }
  showModal.value = true
}

const shareEntry = (entry) => {
  // 分享条目
  if (navigator.share) {
    navigator.share({
      title: entry.title,
      text: entry.summary,
      url: window.location.href
    })
  } else {
    // 降级方案：复制链接
    navigator.clipboard.writeText(window.location.href)
    console.log('链接已复制到剪贴板')
  }
}

// 模态框相关方法
const showCreateModal = () => {
  editingEntry.value = null
  // 重置表单
  entryForm.value = {
    title: '',
    categoryId: '',
    summary: '',
    sections: [
      {
        tempId: Date.now(),
        title: '',
        content: '',
        images: []
      }
    ]
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingEntry.value = null
}

// 表单操作方法
const addSection = () => {
  entryForm.value.sections.push({
    tempId: Date.now(),
    title: '',
    content: '',
    images: []
  })
}

const removeSection = (index) => {
  if (entryForm.value.sections.length > 1) {
    entryForm.value.sections.splice(index, 1)
  }
}

const addImageToSection = (sectionIndex) => {
  currentSectionIndex.value = sectionIndex
  fileInput.value.click()
}

const removeImageFromSection = (sectionIndex, imageIndex) => {
  entryForm.value.sections[sectionIndex].images.splice(imageIndex, 1)
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    // 创建图片预览URL
    const imageUrl = URL.createObjectURL(file)

    // 添加图片到当前章节
    const newImage = {
      tempId: Date.now(),
      url: imageUrl,
      alt: file.name,
      caption: ''
    }

    if (!entryForm.value.sections[currentSectionIndex.value].images) {
      entryForm.value.sections[currentSectionIndex.value].images = []
    }

    entryForm.value.sections[currentSectionIndex.value].images.push(newImage)
  }

  // 清空input值，允许重复选择同一文件
  event.target.value = ''
}

const saveEntry = () => {
  // 验证表单
  if (!entryForm.value.title.trim()) {
    alert('请输入条目标题')
    return
  }

  if (!entryForm.value.categoryId) {
    alert('请选择分类')
    return
  }

  // 处理内容，将纯文本转换为HTML段落
  const processedSections = entryForm.value.sections.map(section => ({
    id: section.id || Date.now(),
    title: section.title,
    content: section.content.split('\n').map(p => p.trim()).filter(p => p).map(p => `<p>${p}</p>`).join(''),
    images: section.images || []
  }))

  if (editingEntry.value) {
    // 更新现有条目
    const category = categories.value.find(cat => cat.id === parseInt(entryForm.value.categoryId))
    const entryIndex = category.entries.findIndex(e => e.id === editingEntry.value.id)

    if (entryIndex > -1) {
      category.entries[entryIndex] = {
        ...editingEntry.value,
        title: entryForm.value.title,
        summary: entryForm.value.summary,
        sections: processedSections,
        updatedAt: new Date()
      }

      // 更新当前显示的条目
      currentEntry.value = category.entries[entryIndex]
    }
  } else {
    // 创建新条目
    const category = categories.value.find(cat => cat.id === parseInt(entryForm.value.categoryId))
    const newEntry = {
      id: Date.now(),
      title: entryForm.value.title,
      author: '当前用户', // 这里应该使用实际的用户信息
      updatedAt: new Date(),
      views: 0,
      summary: entryForm.value.summary,
      sections: processedSections,
      relatedEntries: []
    }

    category.entries.push(newEntry)

    // 自动选择新创建的条目
    selectEntry(newEntry)

    // 展开对应的分类
    if (!expandedCategories.value.includes(category.id)) {
      expandedCategories.value.push(category.id)
    }
  }

  closeModal()
  console.log('条目保存成功')
}

// 图片查看相关方法
const openImageModal = (image) => {
  selectedImage.value = image
  imageModalVisible.value = true
}

const closeImageModal = () => {
  imageModalVisible.value = false
  selectedImage.value = {}
}

// 工具方法
const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 点击外部区域关闭下拉菜单
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

// 生命周期钩子
onMounted(() => {
  console.log('Wiki页面已加载完成')

  // 确保页面没有滚动条
  document.body.style.margin = '0'
  document.body.style.padding = '0'
  document.body.style.overflow = 'hidden'
  document.documentElement.style.margin = '0'
  document.documentElement.style.padding = '0'
  document.documentElement.style.overflow = 'hidden'

  // 添加全局点击事件监听器
  document.addEventListener('click', handleClickOutside)

  // 默认展开第一个分类并选择第一个条目
  if (categories.value.length > 0 && categories.value[0].entries.length > 0) {
    selectEntry(categories.value[0].entries[0])
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 主容器样式 - 设置全屏显示 */
.main-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
}

/* 背景图片样式 */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-image: url('@/assets/picture/picture4.jpg?height=1080&width=1920');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  image-rendering: crisp-edges;
  box-sizing: border-box;
}

/* 毛玻璃导航栏样式 */
.glass-navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 导航栏内容容器 */
.navbar-content {
  position: relative;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
}

/* Logo区域 */
.navbar-logo {
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1002;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

/* 导航栏中间区域 */
.navbar-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
}

/* 导航菜单样式 */
.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  white-space: nowrap;
}

.nav-menu li {
  margin: 0;
  padding: 0;
}

.nav-menu a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: block;
}

.nav-menu a:hover,
.nav-menu a.active {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

/* 导航栏右侧区域 */
.navbar-right {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1002;
}

/* 用户下拉菜单容器 */
.user-dropdown {
  position: relative;
  cursor: pointer;
}

/* 用户头像容器 */
.user-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.user-avatar:hover {
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* 在线状态指示器 */
.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #4ade80;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px) scale(0.95);
  transition: all 0.2s ease;
  z-index: 1003;
  overflow: hidden;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

/* 下拉菜单头部 */
.dropdown-header {
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
}

.user-info {
  text-align: left;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.user-email {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 下拉菜单分割线 */
.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0.25rem 0;
}

/* 下拉菜单列表 */
.dropdown-list {
  list-style: none;
  margin: 0;
  padding: 0.25rem 0;
}

/* 下拉菜单项 */
.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
  transform: translateX(2px);
}

.dropdown-item.logout {
  color: rgba(255, 100, 100, 0.9);
}

.dropdown-item.logout:hover {
  background: rgba(255, 100, 100, 0.15);
  color: rgba(255, 80, 80, 1);
}

.item-icon {
  margin-right: 0.5rem;
  font-size: 0.9rem;
  width: 16px;
  text-align: center;
  opacity: 0.8;
}

/* 主要内容区域 */
.main-content {
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1.5rem;
  box-sizing: border-box;
  overflow: hidden;
}

/* Wiki容器 */
.wiki-container {
  width: 100%;
  max-width: 1400px;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Wiki头部 */
.wiki-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
}

.wiki-title-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.wiki-title {
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.wiki-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 搜索区域 */
.search-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  min-width: 300px;
}

.search-input-wrapper {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  outline: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-btn {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
}

.search-icon {
  font-size: 1rem;
}

/* 快速操作按钮 */
.quick-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.action-btn.primary {
  background: rgba(74, 222, 128, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(74, 222, 128, 0.3);
}

.action-btn.primary:hover {
  background: rgba(74, 222, 128, 0.3);
  border-color: rgba(74, 222, 128, 0.5);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 0.9rem;
}

/* Wiki内容区域 */
.wiki-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧边栏 */
.wiki-sidebar {
  width: 300px;
  background: rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.wiki-sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.collapse-icon {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.collapse-icon.collapsed {
  transform: rotate(180deg);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.sidebar-content.collapsed {
  opacity: 0;
  pointer-events: none;
}

/* 分类导航 */
.category-nav {
  padding: 0 0.5rem;
}

.category-item {
  margin-bottom: 0.5rem;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.category-header:hover,
.category-item.active .category-header {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
}

.category-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.category-name {
  flex: 1;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.category-count {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-right: 0.5rem;
}

.expand-icon {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.6);
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* 条目列表 */
.category-entries {
  margin-left: 0.8rem;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  padding-left: 0.4rem;
}

.entry-item {
  display: flex;
  align-items: center;
  padding: 0.3rem 0.5rem; /* 从 0.4rem 0.6rem 减少到 0.3rem 0.5rem */
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem; /* 从 0.8rem 减少到 0.75rem */
  margin-bottom: 0.15rem; /* 从 0.2rem 减少到 0.15rem */
}

.entry-item:hover,
.entry-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  transform: translateX(2px);
}

.entry-icon {
  margin-right: 0.3rem; /* 从 0.4rem 减少到 0.3rem */
  font-size: 0.7rem; /* 从 0.75rem 减少到 0.7rem */
  opacity: 0.8;
}

.entry-title {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  line-height: 1.2; /* 添加行高控制 */
}

/* 右侧主要内容区域 */
.wiki-main {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;

  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.wiki-main::-webkit-scrollbar {
  width: 6px;
}

.wiki-main::-webkit-scrollbar-track {
  background: transparent;
}

.wiki-main::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.wiki-main::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 条目内容 */
.entry-content {
  max-width: 800px;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.entry-title-section {
  flex: 1;
}

.entry-title {
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.entry-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.meta-icon {
  margin-right: 0.3rem;
  font-size: 0.9rem;
}

.entry-actions {
  display: flex;
  gap: 0.75rem;
}

.edit-btn,
.share-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.edit-btn:hover,
.share-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

/* 条目主体内容 */
.entry-body {
  line-height: 1.6;
}

.entry-summary {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.summary-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.75rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.summary-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 内容章节 */
.entry-sections {
  margin-bottom: 2rem;
}

.content-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.5rem;
}

.section-content {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  margin-bottom: 1.5rem;
}

.section-content p {
  margin-bottom: 1rem;
}

.section-content p:last-child {
  margin-bottom: 0;
}

/* 章节图片 */
.section-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.image-item {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.image-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.section-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.section-image:hover {
  transform: scale(1.05);
}

.image-caption {
  padding: 0.75rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 相关条目 */
.related-entries {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.related-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.related-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.related-link {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.related-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* 欢迎页面 */
.welcome-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
}

.welcome-section {
  text-align: center;
  max-width: 600px;
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 2rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.welcome-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.welcome-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.welcome-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.welcome-btn.primary {
  background: rgba(74, 222, 128, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(74, 222, 128, 0.3);
}

.welcome-btn.primary:hover {
  background: rgba(74, 222, 128, 0.3);
  border-color: rgba(74, 222, 128, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.2);
}

.welcome-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.welcome-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.modal-content {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
}

.modal-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.modal-close {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.modal-close:hover {
  background: rgba(255, 100, 100, 0.2);
  border-color: rgba(255, 100, 100, 0.3);
  color: rgba(255, 100, 100, 0.9);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;

  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 表单样式 */
.entry-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-section .section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border: none;
  padding: 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

/* 章节编辑器 */
.section-editor {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.section-title-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.section-title-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.remove-section-btn {
  background: rgba(255, 100, 100, 0.2);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 100, 100, 0.9);
  font-size: 0.9rem;
}

.remove-section-btn:hover {
  background: rgba(255, 100, 100, 0.3);
  border-color: rgba(255, 100, 100, 0.5);
}

.section-content-editor {
  margin-bottom: 1.5rem;
}

.content-textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.6;
  outline: none;
  resize: vertical;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-family: inherit;
  box-sizing: border-box;
}

.content-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.content-textarea:focus {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.4);
}

/* 图片管理器 */
.image-manager {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.image-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.add-image-btn {
  background: rgba(74, 222, 128, 0.2);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.add-image-btn:hover {
  background: rgba(74, 222, 128, 0.3);
  border-color: rgba(74, 222, 128, 0.5);
}

.image-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.image-editor {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.image-preview {
  position: relative;
  margin-bottom: 0.75rem;
}

.preview-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 100, 100, 0.8);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 0.8rem;
}

.remove-image-btn:hover {
  background: rgba(255, 100, 100, 1);
  transform: scale(1.1);
}

.image-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-caption-input,
.image-alt-input {
  padding: 0.4rem 0.6rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.image-caption-input::placeholder,
.image-alt-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.image-caption-input:focus,
.image-alt-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

/* 添加章节按钮 */
.add-section-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  width: 100%;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.add-section-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 1);
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.cancel-btn,
.save-btn {
  padding: 0.75rem 2rem;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.save-btn {
  background: rgba(74, 222, 128, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(74, 222, 128, 0.3);
}

.save-btn:hover {
  background: rgba(74, 222, 128, 0.3);
  border-color: rgba(74, 222, 128, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2);
}

/* 图片查看模态框 */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.image-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 1.2rem;
  z-index: 1;
}

.image-modal-close:hover {
  background: rgba(255, 100, 100, 0.8);
  transform: scale(1.1);
}

.modal-image {
  max-width: 100%;
  max-height: calc(90vh - 100px);
  object-fit: contain;
  display: block;
}

.image-modal-caption {
  padding: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .wiki-sidebar {
    width: 250px;
  }

  .search-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar {
    min-width: auto;
  }

  .quick-actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .glass-navbar {
    height: 60px;
  }

  .navbar-content {
    padding: 0 1rem;
  }

  .navbar-logo {
    left: 1rem;
  }

  .navbar-right {
    right: 1rem;
  }

  .navbar-center {
    display: none;
  }

  .logo {
    font-size: 1.2rem;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
  }

  .main-content {
    top: 60px;
    height: calc(100% - 60px);
    padding: 1rem;
  }

  .wiki-header {
    padding: 1rem;
  }

  .wiki-title {
    font-size: 1.5rem;
  }

  .wiki-content {
    flex-direction: column;
  }

  .wiki-sidebar {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  .wiki-main {
    padding: 1rem;
  }

  .entry-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .entry-title {
    font-size: 1.5rem;
  }

  .entry-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .entry-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .welcome-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .welcome-actions {
    flex-direction: column;
  }

  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .section-images {
    grid-template-columns: 1fr;
  }

  .image-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0.5rem;
  }

  .wiki-header {
    padding: 0.75rem;
  }

  .wiki-title {
    font-size: 1.3rem;
  }

  .search-input-wrapper {
    border-radius: 20px;
  }

  .search-input {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }

  .search-btn {
    padding: 0.6rem 0.8rem;
  }

  .action-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }

  .wiki-main {
    padding: 0.75rem;
  }

  .entry-title {
    font-size: 1.3rem;
  }

  .welcome-title {
    font-size: 1.8rem;
  }

  .welcome-icon {
    font-size: 3rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }
}

/* 动画效果 */
.glass-navbar {
  animation: slideDown 0.6s ease-out;
}

.wiki-container {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.entry-content {
  animation: fadeIn 0.6s ease-out;
}

.welcome-content {
  animation: fadeIn 0.8s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<!-- 全局样式重置 -->
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  overflow: hidden !important;
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>