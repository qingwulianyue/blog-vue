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
            <li><a href="#home" @click="goToHome">首页</a></li>
            <li><a href="#about">wiki</a></li>
            <li><a href="#services" class="active">服务</a></li>
            <li><a href="#contact" @click="goToContact">联系</a></li>
          </ul>
        </div>

        <!-- 用户头像 - 绝对定位到右侧 -->
        <div class="navbar-right">
          <div class="user-dropdown" @click="toggleDropdown" ref="dropdownRef">
            <!-- 用户头像 -->
            <div class="user-avatar">
              <img
                  :src="userData.avatarUrl"
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
                  <div class="user-name">{{ userData.username }}</div>
                  <div class="user-email">{{ userData.email }}</div>
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

    <!-- 主要内容区域 -->
    <div class="main-content" @click="closeDropdown">
      <!-- 文件管理容器 -->
      <div class="download-container">
        <!-- 文件管理头部 -->
        <div class="download-header">
          <div class="header-top">
            <div class="header-left">
              <h2 class="download-title">文件管理中心</h2>
              <p class="download-subtitle">提供文件上传与下载服务</p>
            </div>
            <!-- 新增：上传按钮 -->
            <div class="header-right">
              <button class="upload-btn" @click="showUploadModal">
                <span class="btn-icon">📤</span>
                <span>上传文件</span>
              </button>
            </div>
          </div>

          <!-- 搜索和过滤器 -->
          <div class="download-controls">
            <div class="search-box">
              <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="搜索资源名称或描述..."
                  class="search-input"
              />
              <div class="search-icon">🔍</div>
            </div>

            <div class="category-filter">
              <button
                  v-for="category in categories"
                  :key="category.key"
                  :class="['category-btn', { 'active': activeCategory === category.key }]"
                  @click="setActiveCategory(category.key)"
              >
                <span class="category-icon">{{ category.icon }}</span>
                <span>{{ category.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 下载列表 -->
        <div class="download-list" ref="downloadListRef">
          <div
              v-for="item in filteredDownloads"
              :key="item.id"
              class="download-item"
          >
            <!-- 软件图标和基本信息 -->
            <div class="download-info">
              <div class="software-icon">
                <img :src="item.icon" :alt="item.name" class="icon-image">
              </div>
              <div class="software-details">
                <h3 class="software-name">{{ item.name }}</h3>
                <p class="software-description">{{ item.description }}</p>
                <div class="software-meta">
                  <span class="meta-item">
                    <span class="meta-icon">📦</span>
                    <span>版本 {{ item.version }}</span>
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">💾</span>
                    <span>{{ item.size }}</span>
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span>{{ formatDate(item.updateDate) }}</span>
                  </span>
                  <!-- 新增：显示上传者信息（如果是用户上传的文件） -->
                  <span v-if="item.uploader" class="meta-item">
                    <span class="meta-icon">👤</span>
                    <span>{{ item.uploader }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- 下载操作区域 -->
            <div class="download-actions">
              <div class="download-stats">
                <div class="stat-item">
                  <span class="stat-icon">📥</span>
                  <span class="stat-text">{{ formatDownloadCount(item.downloads) }} 下载</span>
                </div>
              </div>

              <div class="download-buttons">
                <button
                    class="download-btn primary"
                    @click="startDownload(item)"
                    :disabled="item.downloading"
                >
                  <span class="btn-icon">{{ item.downloading ? '⏳' : '📥' }}</span>
                  <span>{{ item.downloading ? '下载中...' : '立即下载' }}</span>
                </button>
                <button class="download-btn secondary" @click="showDetails(item)">
                  <span class="btn-icon">ℹ️</span>
                  <span>详情</span>
                </button>
                <!-- 新增：如果是当前用户上传的文件，显示删除按钮 -->
                <button
                    v-if="item.uploader === userData.username"
                    class="download-btn danger"
                    @click="deleteFile(item)"
                >
                  <span class="btn-icon">🗑️</span>
                  <span>删除</span>
                </button>
              </div>
            </div>

            <!-- 下载进度条（仅在下载时显示） -->
            <div v-if="item.downloading" class="download-progress">
              <div class="progress-bar">
                <div
                    class="progress-fill"
                    :style="{ width: item.progress + '%' }"
                ></div>
              </div>
              <div class="progress-text">{{ item.progress }}% - {{ item.downloadSpeed }}</div>
            </div>
          </div>

          <!-- 加载更多指示器 -->
          <div class="load-more" v-if="hasMoreDownloads">
            <button class="load-more-btn" @click="loadMoreDownloads">
              加载更多资源
            </button>
          </div>

          <!-- 空状态提示 -->
          <div v-if="filteredDownloads.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <h3 class="empty-title">暂无相关下载</h3>
            <p class="empty-description">
              {{ searchQuery ? '没有找到匹配的资源，请尝试其他关键词' : '该分类下暂无可用下载' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 下载成功提示 -->
    <div v-if="showDownloadTip" class="download-tip" :class="{ 'show': showDownloadTip }">
      <span class="tip-icon">✅</span>
      <span class="tip-text">{{ downloadTipText }}</span>
    </div>

    <!-- 软件详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="detail-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedSoftware?.name }}</h3>
          <button class="close-btn" @click="closeDetailModal">✕</button>
        </div>
        <div class="modal-content">
          <div class="software-preview">
            <img :src="selectedSoftware?.icon" :alt="selectedSoftware?.name" class="preview-icon">
            <div class="preview-info">
              <p class="preview-description">{{ selectedSoftware?.fullDescription }}</p>
              <div class="preview-features">
                <h4>主要内容：</h4>
                <ul>
                  <li v-for="feature in selectedSoftware?.features" :key="feature">{{ feature }}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="modal-btn primary" @click="startDownload(selectedSoftware)">
              立即下载
            </button>
            <button class="modal-btn secondary" @click="closeDetailModal">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增：文件上传弹窗 -->
    <div v-if="showUploadModalFlag" class="modal-overlay" @click="closeUploadModal">
      <div class="upload-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">上传文件</h3>
          <button class="close-btn" @click="closeUploadModal">✕</button>
        </div>
        <div class="modal-content">
          <!-- 文件上传表单 -->
          <form @submit.prevent="submitUpload" class="upload-form">
            <!-- 文件选择区域 -->
            <div class="upload-section">
              <h4 class="section-title">选择文件</h4>
              <div class="file-drop-zone"
                   :class="{ 'dragover': isDragOver }"
                   @drop="handleFileDrop"
                   @dragover.prevent="isDragOver = true"
                   @dragleave.prevent="isDragOver = false"
                   @click="triggerFileInput">
                <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileSelect"
                    class="file-input"
                    accept="*/*"
                />
                <div v-if="!uploadForm.file" class="drop-zone-content">
                  <div class="drop-icon">📁</div>
                  <p class="drop-text">点击选择文件或拖拽文件到此处</p>
                  <p class="drop-hint">支持所有文件格式</p>
                </div>
                <div v-else class="selected-file">
                  <div class="file-icon">📄</div>
                  <div class="file-info">
                    <p class="file-name">{{ uploadForm.file.name }}</p>
                    <p class="file-size">{{ formatFileSize(uploadForm.file.size) }}</p>
                  </div>
                  <button type="button" @click.stop="removeSelectedFile" class="remove-file-btn">✕</button>
                </div>
              </div>
            </div>

            <!-- 文件信息填写区域 -->
            <div class="upload-section">
              <h4 class="section-title">文件信息</h4>

              <!-- 文件名称 -->
              <div class="form-group">
                <label class="form-label">文件名称 *</label>
                <input
                    type="text"
                    v-model="uploadForm.name"
                    class="form-input"
                    placeholder="请输入文件显示名称"
                    required
                />
              </div>

              <!-- 文件描述 -->
              <div class="form-group">
                <label class="form-label">文件描述 *</label>
                <textarea
                    v-model="uploadForm.description"
                    class="form-textarea"
                    placeholder="请输入文件描述信息"
                    rows="3"
                    required
                ></textarea>
              </div>

              <!-- 文件分类 -->
              <div class="form-group">
                <label class="form-label">文件分类 *</label>
                <select v-model="uploadForm.category" class="form-select" required>
                  <option value="">请选择分类</option>
                  <option value="mod">模组</option>
                  <option value="resourcepacks">资源包</option>
                  <option value="client">客户端</option>
                </select>
              </div>

              <!-- 版本号 -->
              <div class="form-group">
                <label class="form-label">版本号</label>
                <input
                    type="text"
                    v-model="uploadForm.version"
                    class="form-input"
                    placeholder="例如：1.0.0"
                />
              </div>

              <!-- 详细说明 -->
              <div class="form-group">
                <label class="form-label">详细说明</label>
                <textarea
                    v-model="uploadForm.fullDescription"
                    class="form-textarea"
                    placeholder="请输入详细的功能说明"
                    rows="4"
                ></textarea>
              </div>

              <!-- 主要特性 -->
              <div class="form-group">
                <label class="form-label">主要特性</label>
                <div class="features-input">
                  <div v-for="(feature, index) in uploadForm.features" :key="index" class="feature-item">
                    <input
                        type="text"
                        v-model="uploadForm.features[index]"
                        class="form-input feature-input"
                        placeholder="输入特性描述"
                    />
                    <button type="button" @click="removeFeature(index)" class="remove-feature-btn">✕</button>
                  </div>
                  <button type="button" @click="addFeature" class="add-feature-btn">
                    <span class="btn-icon">➕</span>
                    <span>添加特性</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 上传进度 -->
            <div v-if="uploadProgress > 0" class="upload-progress-section">
              <h4 class="section-title">上传进度</h4>
              <div class="upload-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
                </div>
                <div class="progress-text">{{ uploadProgress }}%</div>
              </div>
            </div>

            <!-- 表单操作按钮 -->
            <div class="form-actions">
              <button type="button" @click="closeUploadModal" class="modal-btn secondary">
                取消
              </button>
              <button
                  type="submit"
                  class="modal-btn primary"
                  :disabled="!canSubmit || isUploading"
              >
                <span class="btn-icon">{{ isUploading ? '⏳' : '📤' }}</span>
                <span>{{ isUploading ? '上传中...' : '开始上传' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 新增：上传成功提示 -->
    <div v-if="showUploadTip" class="upload-tip" :class="{ 'show': showUploadTip }">
      <span class="tip-icon">✅</span>
      <span class="tip-text">{{ uploadTipText }}</span>
    </div>
  </div>
</template>

<script setup>
// Vue 3 Composition API 导入
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from "axios";
import {useRouter} from "vue-router";
const router = useRouter()
import clientIcon from '@/assets/picture/client.jpg';

// 用户数据（模拟从API获取）
const userData = ref({
  username: '张三',
  avatarUrl: '/placeholder.svg?height=40&width=40',
  email: 'zhangsan@example.com'
})

// 页面状态管理
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const downloadListRef = ref(null)
const searchQuery = ref('')
const activeCategory = ref('all')
const hasMoreDownloads = ref(true)

// 提示相关状态
const showDownloadTip = ref(false)
const downloadTipText = ref('')

// 详情弹窗状态
const showDetailModal = ref(false)
const selectedSoftware = ref(null)

// 新增：上传相关状态
const showUploadModalFlag = ref(false) // 上传弹窗显示状态
const uploadForm = ref({
  file: null,           // 选中的文件
  name: '',            // 文件显示名称
  description: '',     // 文件描述
  category: '',        // 文件分类
  version: '1.0',      // 版本号
  fullDescription: '', // 详细说明
  features: ['']       // 主要特性列表
})
const isDragOver = ref(false)        // 拖拽状态
const uploadProgress = ref(0)        // 上传进度
const isUploading = ref(false)       // 是否正在上传
const showUploadTip = ref(false)     // 上传成功提示
const uploadTipText = ref('')        // 上传提示文本
const fileInput = ref(null)          // 文件输入框引用

// 软件分类定义
const categories = ref([
  { key: 'all', label: '全部', icon: '📦' },
  { key: 'mod', label: '模组', icon: '💻' },
  { key: 'resourcepacks', label: '资源包', icon: '🎵' },
  { key: 'client', label: '客户端', icon: '🎮' },
])

// 下载软件数据（模拟数据）
const downloads = ref([
  {
    id: 1,
    name: '沧海彼岸客户端v1.0',
    fileName: '沧海彼岸客户端v1.0.rar',
    description: '沧海彼岸客户端完整版v1.0',
    fullDescription: '包含了所有内容的PCL客户端',
    icon: clientIcon,
    version: '1.0',
    size: '95.2 MB',
    downloads: 125000000,
    comments: 8520,
    updateDate: new Date('2024-01-15'),
    category: 'client',
    features: [
      '1.0版本客户端资源包',
      '1.0版本客户端模组',
      '全部光影材质包'
    ],
    downloading: false,
    progress: 0,
    downloadSpeed: '',
    uploader: null // 系统文件，无上传者
  },
  {
    id: 2,
    name: '沧海彼岸模组v1.0',
    fileName: '沧海彼岸模组v1.0.rar',
    description: '沧海彼岸模组v1.0',
    fullDescription: '包含了v1.0版本的模组内容',
    icon: clientIcon,
    version: '1.0',
    size: '95.2 MB',
    downloads: 125000000,
    comments: 8520,
    updateDate: new Date('2024-01-15'),
    category: 'mod',
    features: [
      '1.0版本客户端模组'
    ],
    downloading: false,
    progress: 0,
    downloadSpeed: '',
    uploader: null // 系统文件，无上传者
  }
])

// 计算属性：过滤后的下载列表
const filteredDownloads = computed(() => {
  let filtered = downloads.value

  // 按分类过滤
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(item => item.category === activeCategory.value)
  }

  // 按搜索关键词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 新增：计算属性 - 是否可以提交上传表单
const canSubmit = computed(() => {
  return uploadForm.value.file &&
      uploadForm.value.name.trim() &&
      uploadForm.value.description.trim() &&
      uploadForm.value.category
})

// 工具函数：格式化日期
const formatDate = (date) => {
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天更新'
  } else if (days === 1) {
    return '昨天更新'
  } else if (days < 30) {
    return `${days}天前更新`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

// 工具函数：格式化下载次数
const formatDownloadCount = (count) => {
  if (count >= 100000000) {
    return (count / 100000000).toFixed(1) + '亿'
  } else if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  } else {
    return count.toString()
  }
}

// 新增：工具函数 - 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 设置活跃分类
const setActiveCategory = (categoryKey) => {
  activeCategory.value = categoryKey
}

// 开始下载功能
const startDownload = async (item) => {
  if (item.downloading) return

  try {
    // 设置下载状态
    item.downloading = true

    console.log('开始下载：', item.name)

    // 对文件名进行编码
    const encodedFileName = encodeURIComponent(item.fileName)

    // 使用await关键字
    const response = await axios({
      url: `/api/user/service/download/${encodedFileName}`,
      method: 'GET',
      responseType: 'blob',
    })

    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url

    // 从响应头中获取文件名
    const contentDisposition = response.headers['content-disposition']
    const fileName = getFileNameFromHeader(contentDisposition)

    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    console.log('下载完成')
  } catch (error) {
    console.error('下载失败:', error)

    // 显示错误信息
    if (error.response && error.response.status) {
      alert(`下载失败，错误码: ${error.response.status}`)
    } else {
      alert('下载失败，请重试')
    }
  } finally {
    // 重置下载状态
    item.downloading = false
  }

  // 关闭详情弹窗
  closeDetailModal()
}

// 从响应头中提取文件名
const getFileNameFromHeader = (header) => {
  if (!header) return 'file.dat';

  const match = header.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (match != null && match[1]) {
    return decodeURIComponent(match[1].replace(/['"]/g, ''));
  }
  return 'file.dat';
}

// 显示软件详情
const showDetails = (item) => {
  selectedSoftware.value = item
  showDetailModal.value = true
}

// 关闭详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedSoftware.value = null
}

// 新增：显示上传弹窗
const showUploadModal = () => {
  showUploadModalFlag.value = true
  // 重置上传表单
  resetUploadForm()
}

// 新增：关闭上传弹窗
const closeUploadModal = () => {
  showUploadModalFlag.value = false
  resetUploadForm()
}

// 新增：重置上传表单
const resetUploadForm = () => {
  uploadForm.value = {
    file: null,
    name: '',
    description: '',
    category: '',
    version: '1.0',
    fullDescription: '',
    features: ['']
  }
  uploadProgress.value = 0
  isUploading.value = false
  isDragOver.value = false
}

// 新增：触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 新增：处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    uploadForm.value.file = file
    // 自动填充文件名（去掉扩展名）
    if (!uploadForm.value.name) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
      uploadForm.value.name = nameWithoutExt
    }
  }
}

// 新增：处理文件拖拽
const handleFileDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false

  const files = event.dataTransfer.files
  if (files.length > 0) {
    uploadForm.value.file = files[0]
    // 自动填充文件名
    if (!uploadForm.value.name) {
      const nameWithoutExt = files[0].name.replace(/\.[^/.]+$/, "")
      uploadForm.value.name = nameWithoutExt
    }
  }
}

// 新增：移除选中的文件
const removeSelectedFile = () => {
  uploadForm.value.file = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 新增：添加特性
const addFeature = () => {
  uploadForm.value.features.push('')
}

// 新增：移除特性
const removeFeature = (index) => {
  if (uploadForm.value.features.length > 1) {
    uploadForm.value.features.splice(index, 1)
  }
}

// 新增：提交上传
const submitUpload = async () => {
  if (!canSubmit.value || isUploading.value) return

  try {
    isUploading.value = true
    uploadProgress.value = 0

    // 创建FormData对象
    const formData = new FormData()
    formData.append('file', uploadForm.value.file)
    formData.append('name', uploadForm.value.name)
    formData.append('description', uploadForm.value.description)
    formData.append('category', uploadForm.value.category)
    formData.append('version', uploadForm.value.version)
    formData.append('fullDescription', uploadForm.value.fullDescription)
    formData.append('features', JSON.stringify(uploadForm.value.features.filter(f => f.trim())))
    formData.append('uploader', userData.value.username)

    // 模拟上传进度
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 10
      }
    }, 200)

    // 发送上传请求
    const response = await axios.post('/api/user/service/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        uploadProgress.value = percentCompleted
      }
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    // 创建新的下载项并添加到列表
    const newItem = {
      id: Date.now(), // 使用时间戳作为临时ID
      name: uploadForm.value.name,
      fileName: uploadForm.value.file.name,
      description: uploadForm.value.description,
      fullDescription: uploadForm.value.fullDescription || uploadForm.value.description,
      icon: clientIcon, // 使用默认图标
      version: uploadForm.value.version,
      size: formatFileSize(uploadForm.value.file.size),
      downloads: 0,
      comments: 0,
      updateDate: new Date(),
      category: uploadForm.value.category,
      features: uploadForm.value.features.filter(f => f.trim()),
      downloading: false,
      progress: 0,
      downloadSpeed: '',
      uploader: userData.value.username // 标记上传者
    }

    // 添加到下载列表
    downloads.value.unshift(newItem)

    // 显示成功提示
    uploadTipText.value = '文件上传成功！'
    showUploadTip.value = true
    setTimeout(() => {
      showUploadTip.value = false
    }, 3000)

    // 关闭上传弹窗
    closeUploadModal()

    console.log('文件上传成功:', response.data)

  } catch (error) {
    console.error('文件上传失败:', error)

    // 显示错误提示
    uploadTipText.value = '文件上传失败，请重试'
    showUploadTip.value = true
    setTimeout(() => {
      showUploadTip.value = false
    }, 3000)

  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

// 新增：删除文件功能
const deleteFile = async (item) => {
  if (item.uploader !== userData.value.username) {
    alert('您只能删除自己上传的文件')
    return
  }

  if (!confirm(`确定要删除文件"${item.name}"吗？此操作不可恢复。`)) {
    return
  }

  try {
    // 发送删除请求
    await axios.delete(`/api/user/service/delete/${item.id}`)

    // 从列表中移除
    const index = downloads.value.findIndex(d => d.id === item.id)
    if (index > -1) {
      downloads.value.splice(index, 1)
    }

    // 显示成功提示
    downloadTipText.value = '文件删除成功'
    showDownloadTip.value = true
    setTimeout(() => {
      showDownloadTip.value = false
    }, 3000)

    console.log('文件删除成功')

  } catch (error) {
    console.error('文件删除失败:', error)
    alert('文件删除失败，请重试')
  }
}

// 加载更多下载
const loadMoreDownloads = () => {
  console.log('加载更多下载')
  // 这里可以添加加载更多数据的逻辑
  setTimeout(() => {
    hasMoreDownloads.value = false
  }, 1000)
}

// 导航相关函数
const goToHome = async () => {
  console.log('跳转到首页')
  await router.push('/main')
  closeDropdown()
}

const goToContact = () => {
  console.log('跳转到联系页面')
  closeDropdown()
}

// 下拉菜单相关函数
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

// 用户操作函数
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

// 组件挂载时的初始化
onMounted(() => {
  console.log('文件管理页面已加载')

  // 设置全屏样式
  document.body.style.margin = '0'
  document.body.style.padding = '0'
  document.body.style.overflow = 'hidden'
  document.documentElement.style.margin = '0'
  document.documentElement.style.padding = '0'
  document.documentElement.style.overflow = 'hidden'

  // 添加点击外部关闭下拉菜单的监听器
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 主容器样式 - 全屏显示 */
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
  background-image: url('@/assets/picture/picture4.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
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
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden;
}

/* 下载容器 */
.download-container {
  width: 100%;
  max-width: 900px;
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

/* 下载服务头部 */
.download-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
}

/* 新增：头部顶部布局 */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.header-left {
  flex: 1;
}

.header-right {
  flex-shrink: 0;
  margin-left: 1rem;
}

.download-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.download-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 新增：上传按钮样式 */
.upload-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(34, 197, 94, 0.8);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.upload-btn:hover {
  background: rgba(34, 197, 94, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* 搜索和控制区域 */
.download-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 搜索框 */
.search-box {
  position: relative;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  pointer-events: none;
}

/* 分类过滤器 */
.category-filter {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.category-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

.category-btn.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.category-icon {
  font-size: 0.9rem;
}

/* 下载列表 */
.download-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.download-list::-webkit-scrollbar {
  width: 6px;
}

.download-list::-webkit-scrollbar-track {
  background: transparent;
}

.download-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.download-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 下载项 */
.download-item {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.download-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 下载信息区域 */
.download-info {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.software-icon {
  margin-right: 1rem;
  flex-shrink: 0;
}

.icon-image {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.software-details {
  flex: 1;
}

.software-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.software-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 软件元信息 */
.software-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.meta-icon {
  margin-right: 0.3rem;
  font-size: 0.9rem;
}

/* 下载操作区域 */
.download-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.download-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  margin-right: 0.3rem;
  font-size: 0.9rem;
}

.stat-text {
  font-weight: 500;
}

/* 下载按钮组 */
.download-buttons {
  display: flex;
  gap: 0.5rem;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid transparent;
}

.download-btn.primary {
  background: rgba(34, 197, 94, 0.8);
  color: white;
  border-color: rgba(34, 197, 94, 0.3);
}

.download-btn.primary:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.download-btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.download-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}

.download-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

/* 新增：危险按钮样式（删除按钮） */
.download-btn.danger {
  background: rgba(239, 68, 68, 0.8);
  color: white;
  border-color: rgba(239, 68, 68, 0.3);
}

.download-btn.danger:hover {
  background: rgba(239, 68, 68, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-icon {
  font-size: 0.9rem;
}

/* 下载进度条 */
.download-progress {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 加载更多 */
.load-more {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.load-more-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.75rem 2rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.load-more-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.empty-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 下载成功提示 */
.download-tip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  background: rgba(34, 197, 94, 0.9);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.download-tip.show {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -50%) scale(1);
}

.tip-icon {
  font-size: 1.2rem;
}

.tip-text {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 详情弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.detail-modal {
  width: 90%;
  max-width: 600px;
  max-height: 80%;
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

/* 新增：上传弹窗样式 */
.upload-modal {
  width: 90%;
  max-width: 700px;
  max-height: 90%;
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

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.software-preview {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.preview-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.preview-info {
  flex: 1;
}

.preview-description {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 1rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.preview-features h4 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.preview-features ul {
  margin: 0;
  padding-left: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
}

.preview-features li {
  margin-bottom: 0.3rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 新增：上传表单样式 */
.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

/* 文件拖拽区域 */
.file-drop-zone {
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-drop-zone:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.file-drop-zone.dragover {
  border-color: rgba(34, 197, 94, 0.8);
  background: rgba(34, 197, 94, 0.1);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.drop-icon {
  font-size: 3rem;
  opacity: 0.6;
}

.drop-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.drop-hint {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 已选择文件显示 */
.selected-file {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.file-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.file-info {
  flex: 1;
  text-align: left;
}

.file-name {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.25rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  word-break: break-all;
}

.file-size {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.remove-file-btn {
  background: rgba(239, 68, 68, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.remove-file-btn:hover {
  background: rgba(239, 68, 68, 0.9);
  transform: scale(1.1);
}

/* 表单组件样式 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-select {
  cursor: pointer;
}

.form-select option {
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

/* 特性输入区域 */
.features-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.feature-input {
  flex: 1;
}

.remove-feature-btn {
  background: rgba(239, 68, 68, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.remove-feature-btn:hover {
  background: rgba(239, 68, 68, 0.9);
  transform: scale(1.1);
}

.add-feature-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  align-self: flex-start;
}

.add-feature-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

/* 上传进度区域 */
.upload-progress-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-btn.primary {
  background: rgba(34, 197, 94, 0.8);
  color: white;
  border-color: rgba(34, 197, 94, 0.3);
}

.modal-btn.primary:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.modal-btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}

.modal-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

/* 新增：上传成功提示 */
.upload-tip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  background: rgba(34, 197, 94, 0.9);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.upload-tip.show {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -50%) scale(1);
}

/* 响应式设计 */
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

  .logo {
    font-size: 1.2rem;
  }

  .navbar-center {
    display: none;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
  }

  .dropdown-menu {
    width: 180px;
    right: -5px;
  }

  .main-content {
    top: 60px;
    height: calc(100% - 60px);
    padding: 1rem;
  }

  .download-container {
    max-width: 100%;
  }

  .download-header {
    padding: 1rem;
  }

  .header-top {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-right {
    margin-left: 0;
  }

  .upload-btn {
    align-self: flex-start;
  }

  .download-title {
    font-size: 1.3rem;
  }

  .download-controls {
    gap: 0.75rem;
  }

  .search-box {
    max-width: 100%;
  }

  .category-filter {
    flex-wrap: wrap;
  }

  .category-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .download-item {
    padding: 1rem;
  }

  .download-info {
    flex-direction: column;
    text-align: center;
  }

  .software-icon {
    margin-right: 0;
    margin-bottom: 1rem;
    align-self: center;
  }

  .icon-image {
    width: 50px;
    height: 50px;
  }

  .software-meta {
    justify-content: center;
    gap: 0.75rem;
  }

  .download-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .download-stats {
    justify-content: center;
  }

  .download-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }

  .software-preview {
    flex-direction: column;
    text-align: center;
  }

  .preview-icon {
    align-self: center;
    margin-bottom: 1rem;
  }

  .modal-actions,
  .form-actions {
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
    justify-content: center;
  }

  .upload-modal {
    max-width: 95%;
    max-height: 95%;
  }

  .file-drop-zone {
    padding: 1.5rem;
    min-height: 100px;
  }

  .drop-icon {
    font-size: 2.5rem;
  }

  .features-input {
    gap: 0.75rem;
  }

  .feature-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .remove-feature-btn {
    align-self: flex-end;
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .main-content {
    padding: 0.5rem;
  }

  .download-header {
    padding: 0.75rem;
  }

  .download-title {
    font-size: 1.2rem;
  }

  .download-item {
    padding: 0.75rem;
  }

  .software-name {
    font-size: 1.1rem;
  }

  .software-description {
    font-size: 0.85rem;
  }

  .download-list {
    padding: 0.5rem;
  }

  .icon-image {
    width: 45px;
    height: 45px;
  }

  .software-meta {
    gap: 0.5rem;
  }

  .meta-item {
    font-size: 0.75rem;
  }

  .download-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .upload-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }

  .modal-content {
    padding: 1rem;
  }

  .file-drop-zone {
    padding: 1rem;
    min-height: 80px;
  }

  .drop-icon {
    font-size: 2rem;
  }

  .drop-text {
    font-size: 0.9rem;
  }

  .drop-hint {
    font-size: 0.8rem;
  }
}

/* 动画效果 */
.glass-navbar {
  animation: slideDown 0.6s ease-out;
}

.download-container {
  animation: fadeInUp 0.8s ease-out 0.2s both;
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

/* 下载项进入动画 */
.download-item {
  animation: fadeInScale 0.5s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 进度条动画 */
.progress-fill {
  animation: progressGlow 2s ease-in-out infinite alternate;
}

@keyframes progressGlow {
  from {
    box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
  }
  to {
    box-shadow: 0 0 15px rgba(34, 197, 94, 0.8);
  }
}

/* 弹窗进入动画 */
.modal-overlay {
  animation: fadeIn 0.3s ease-out;
}

.detail-modal,
.upload-modal {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 文件拖拽动画 */
.file-drop-zone {
  animation: dropZonePulse 2s ease-in-out infinite;
}

@keyframes dropZonePulse {
  0%, 100% {
    border-color: rgba(255, 255, 255, 0.3);
  }
  50% {
    border-color: rgba(255, 255, 255, 0.5);
  }
}

.file-drop-zone.dragover {
  animation: dropZoneActive 0.3s ease-out;
}

@keyframes dropZoneActive {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.02);
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