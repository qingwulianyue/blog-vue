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
            <li><a href="#home" @click="goBack">返回首页</a></li>
            <li><a href="#profile" class="active">个人中心</a></li>
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

              <ul class="dropdown-list">
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
      <!-- 个人中心容器 -->
      <div class="profile-container">
        <!-- 左侧导航菜单 -->
        <div class="sidebar-menu">
          <div class="menu-header">
            <div class="user-avatar-large">
              <img :src="userData.avatarUrl" :alt="userData.username" class="avatar-large" />
              <div class="avatar-status">
                <div class="status-dot"></div>
                <span class="status-text">在线</span>
              </div>
            </div>
            <div class="user-info-large">
              <h3 class="username-large">{{ userData.username }}</h3>
            </div>
          </div>

          <nav class="menu-nav">
            <ul class="menu-list">
              <li class="menu-item" :class="{ 'active': activeTab === 'avatar' }" @click="setActiveTab('avatar')">
                <div class="menu-icon">📷</div>
                <span class="menu-text">头像设置</span>
              </li>
              <li class="menu-item" :class="{ 'active': activeTab === 'profile' }" @click="setActiveTab('profile')">
                <div class="menu-icon">👤</div>
                <span class="menu-text">个人信息</span>
              </li>
              <li class="menu-item" :class="{ 'active': activeTab === 'history' }" @click="setActiveTab('history')">
                <div class="menu-icon">📋</div>
                <span class="menu-text">历史记录</span>
              </li>
              <li class="menu-item" :class="{ 'active': activeTab === 'servers' }" @click="setActiveTab('servers')">
                <div class="menu-icon">🖥️</div>
                <span class="menu-text">服务器绑定</span>
              </li>
            </ul>
          </nav>
        </div>

        <!-- 右侧内容区域 -->
        <div class="content-area">
          <!-- 头像设置页面 -->
          <div v-if="activeTab === 'avatar'" class="tab-content">
            <div class="content-header">
              <h2 class="content-title">头像设置</h2>
              <p class="content-subtitle">管理您的个人头像和显示设置</p>
            </div>

            <div class="avatar-settings">
              <!-- 当前头像显示 -->
              <div class="current-avatar-section">
                <div class="avatar-upload-container">
                  <div class="current-avatar" @click="triggerFileInput">
                    <img
                        :src="userData.avatarUrl"
                        :alt="userData.username + '的头像'"
                        class="avatar-preview"
                        v-if="userData.avatarUrl"
                    />
                    <div class="avatar-placeholder" v-else>
                      <span class="placeholder-icon">👤</span>
                      <span class="placeholder-text">点击上传头像</span>
                    </div>

                    <!-- 上传覆盖层 -->
                    <div class="upload-overlay">
                      <div class="upload-icon">📷</div>
                      <div class="upload-text">更换头像</div>
                    </div>

                    <!-- 上传进度环 -->
                    <div class="upload-progress" v-if="uploadProgress > 0 && uploadProgress < 100">
                      <svg class="progress-ring" width="120" height="120">
                        <circle
                            class="progress-ring-circle"
                            stroke="rgba(255, 255, 255, 0.3)"
                            stroke-width="4"
                            fill="transparent"
                            r="56"
                            cx="60"
                            cy="60"
                        />
                        <circle
                            class="progress-ring-circle progress-ring-fill"
                            stroke="rgba(255, 255, 255, 0.8)"
                            stroke-width="4"
                            fill="transparent"
                            r="56"
                            cx="60"
                            cy="60"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="circumference - (uploadProgress / 100) * circumference"
                        />
                      </svg>
                      <div class="progress-text">{{ Math.round(uploadProgress) }}%</div>
                    </div>
                  </div>

                  <!-- 隐藏的文件输入框 -->
                  <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      @change="handleFileSelect"
                      class="hidden-file-input"
                  />
                </div>

                <!-- 头像操作按钮 -->
                <div class="avatar-actions">
                  <button class="action-btn primary" @click="triggerFileInput">
                    <span class="btn-icon">📁</span>
                    <span>选择图片</span>
                  </button>
                  <button class="action-btn secondary" @click="resetAvatar">
                    <span class="btn-icon">🔄</span>
                    <span>重置头像</span>
                  </button>
                </div>
              </div>

              <!-- 头像设置选项 -->
              <div class="avatar-options">
                <div class="option-card">
                  <h4 class="option-title">上传要求</h4>
                  <ul class="option-list">
                    <li class="option-item">
                      <span class="option-icon">📏</span>
                      <span>建议尺寸：200x200像素或更高</span>
                    </li>
                    <li class="option-item">
                      <span class="option-icon">📁</span>
                      <span>支持格式：JPG、PNG、GIF</span>
                    </li>
                    <li class="option-item">
                      <span class="option-icon">⚖️</span>
                      <span>文件大小：不超过5MB</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 个人信息页面 -->
          <div v-if="activeTab === 'profile'" class="tab-content">
            <div class="content-header">
              <h2 class="content-title">个人信息</h2>
              <p class="content-subtitle">编辑和管理您的个人资料信息</p>
            </div>

            <div class="profile-form">
              <div class="form-section">
                <h3 class="section-title">基本信息</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">用户名</label>
                    <input
                        type="text"
                        v-model="editableUserData.username"
                        class="form-input"
                        placeholder="请输入用户名"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">邮箱地址</label>
                    <input
                        type="email"
                        v-model="editableUserData.email"
                        class="form-input"
                        placeholder="请输入邮箱地址"
                    />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3 class="section-title">详细信息</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">职业</label>
                    <input
                        type="text"
                        v-model="editableUserData.job"
                        class="form-input"
                        placeholder="请输入职业"
                    />
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button class="action-btn primary" @click="saveProfile" :disabled="!hasProfileChanges">
                  <span class="btn-icon">💾</span>
                  <span>保存更改</span>
                </button>
                <button class="action-btn secondary" @click="resetProfile">
                  <span class="btn-icon">🔄</span>
                  <span>重置</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 历史记录页面 -->
          <div v-if="activeTab === 'history'" class="tab-content">
            <div class="content-header">
              <h2 class="content-title">历史记录</h2>
              <p class="content-subtitle">查看您的活动历史和操作记录</p>
            </div>

            <div class="history-content">
              <!-- 历史记录过滤器 -->
              <div class="history-filters">
                <div class="filter-group">
                  <button
                      v-for="filter in historyFilters"
                      :key="filter.key"
                      :class="['filter-btn', { 'active': activeHistoryFilter === filter.key }]"
                      @click="setHistoryFilter(filter.key)"
                  >
                    <span class="filter-icon">{{ filter.icon }}</span>
                    <span>{{ filter.label }}</span>
                  </button>
                </div>
              </div>

              <!-- 历史记录列表 -->
              <div class="history-list">
                <div v-for="record in filteredHistoryRecords" :key="record.id" class="history-item">
                  <div class="history-icon" :class="record.type">
                    <span>{{ getHistoryIcon(record.type) }}</span>
                  </div>
                  <div class="history-content-text">
                    <h4 class="history-title">{{ record.title }}</h4>
                    <p class="history-description">{{ record.description }}</p>
                    <div class="history-meta">
                      <span class="history-time">{{ formatDate(record.time) }}</span>
                      <span class="history-ip" v-if="record.ip">IP: {{ record.ip }}</span>
                    </div>
                  </div>
                  <div class="history-status" :class="record.status">
                    {{ getStatusText(record.status) }}
                  </div>
                </div>
              </div>

              <!-- 加载更多 -->
              <div class="load-more-section" v-if="hasMoreHistory">
                <button class="load-more-btn" @click="loadMoreHistory">
                  <span class="btn-icon">⬇️</span>
                  <span>加载更多</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 服务器绑定页面 -->
          <div v-if="activeTab === 'servers'" class="tab-content">
            <div class="content-header">
              <h2 class="content-title">服务器绑定</h2>
              <p class="content-subtitle">管理您绑定的游戏服务器账号</p>
            </div>

            <div class="servers-content">
              <!-- 添加服务器按钮 -->
              <div class="add-server-section">
                <button class="add-server-btn" @click="showAddServer = true">
                  <span class="btn-icon">➕</span>
                  <span>绑定新服务器</span>
                </button>
              </div>

              <!-- 服务器列表 -->
              <div class="servers-list">
                <div v-for="server in boundServers" :key="server.id" class="server-card">
                  <div class="server-header">
                    <div class="server-info">
                      <div class="server-icon" :class="server.type">
                        <span>{{ getServerIcon(server.type) }}</span>
                      </div>
                      <div class="server-details">
                        <h4 class="server-name">{{ server.name }}</h4>
                        <p class="server-type">{{ server.typeName }}</p>
                      </div>
                    </div>
                    <div class="server-status" :class="server.status">
                      <div class="status-dot"></div>
                      <span>{{ getServerStatus(server.status) }}</span>
                    </div>
                  </div>

                  <div class="server-content">
                    <div class="server-stats">
                      <div class="stat-item">
                        <span class="stat-label">游戏ID</span>
                        <span class="stat-value">{{ server.gameId }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">等级</span>
                        <span class="stat-value">{{ server.level }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">绑定时间</span>
                        <span class="stat-value">{{ formatDate(server.bindTime) }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">最后同步</span>
                        <span class="stat-value">{{ formatDate(server.lastSync) }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="server-actions">
                    <button class="server-btn sync" @click="syncServer(server.id)">
                      <span class="btn-icon">🔄</span>
                      <span>同步数据</span>
                    </button>
                    <button class="server-btn edit" @click="editServer(server.id)">
                      <span class="btn-icon">✏️</span>
                      <span>编辑</span>
                    </button>
                    <button class="server-btn danger" @click="unbindServer(server.id)">
                      <span class="btn-icon">🗑️</span>
                      <span>解绑</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 各种弹窗和提示 -->
    <!-- 操作成功提示 -->
    <div v-if="showTip" class="tip-message" :class="{ 'show': showTip, 'success': tipType === 'success', 'error': tipType === 'error' }">
      <span class="tip-icon">{{ tipType === 'success' ? '✅' : '❌' }}</span>
      <span class="tip-text">{{ tipText }}</span>
    </div>

    <!-- 图片裁剪弹窗 -->
    <div v-if="showCropModal" class="crop-modal" @click.self="closeCropModal">
      <div class="crop-container">
        <div class="crop-header">
          <h3 class="crop-title">裁剪头像</h3>
          <button class="close-btn" @click="closeCropModal">✕</button>
        </div>

        <div class="crop-content">
          <div class="crop-preview-area">
            <canvas
                ref="cropCanvas"
                class="crop-canvas"
                @mousedown="handleMouseDown"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="handleTouchEnd"
                style="cursor: grab; user-select: none;"
            ></canvas>
          </div>

          <div class="crop-controls">
            <div class="control-group">
              <label class="control-label">缩放</label>
              <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  v-model="cropScale"
                  @input="updateCrop"
                  class="scale-slider"
              />
            </div>
            <div class="control-group">
              <button
                  class="reset-position-btn"
                  @click="resetCropPosition"
                  type="button"
              >
                <span class="btn-icon">🎯</span>
                <span>重置位置</span>
              </button>
            </div>
          </div>
        </div>

        <div class="crop-actions">
          <button class="crop-btn cancel" @click="closeCropModal">取消</button>
          <button class="crop-btn confirm" @click="confirmCrop">确认裁剪</button>
        </div>
      </div>
    </div>

    <!-- 添加服务器弹窗 -->
    <div v-if="showAddServer" class="modal-overlay" @click.self="showAddServer = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">绑定服务器账号</h3>
          <button class="close-btn" @click="showAddServer = false">✕</button>
        </div>

        <div class="modal-content">
          <div class="form-group">
            <label class="form-label">服务器类型</label>
            <select v-model="newServer.type" class="form-select">
              <option value="">请选择服务器类型</option>
              <option value="minecraft">Minecraft</option>
              <option value="steam">Steam</option>
              <option value="origin">Origin</option>
              <option value="battlenet">Battle.net</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">服务器名称</label>
            <input
                type="text"
                v-model="newServer.name"
                class="form-input"
                placeholder="请输入服务器名称"
            />
          </div>
          <div class="form-group">
            <label class="form-label">游戏ID</label>
            <input
                type="text"
                v-model="newServer.gameId"
                class="form-input"
                placeholder="请输入游戏ID"
            />
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showAddServer = false">取消</button>
          <button class="modal-btn confirm" @click="addServer" :disabled="!canAddServer">绑定</button>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showChangePassword" class="modal-overlay" @click.self="showChangePassword = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">修改密码</h3>
          <button class="close-btn" @click="showChangePassword = false">✕</button>
        </div>

        <div class="modal-content">
          <div class="form-group">
            <label class="form-label">当前密码</label>
            <input
                type="password"
                v-model="passwordForm.currentPassword"
                class="form-input"
                placeholder="请输入当前密码"
            />
          </div>
          <div class="form-group">
            <label class="form-label">新密码</label>
            <input
                type="password"
                v-model="passwordForm.newPassword"
                class="form-input"
                placeholder="请输入新密码"
            />
          </div>
          <div class="form-group">
            <label class="form-label">确认新密码</label>
            <input
                type="password"
                v-model="passwordForm.confirmPassword"
                class="form-input"
                placeholder="请再次输入新密码"
            />
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showChangePassword = false">取消</button>
          <button class="modal-btn confirm" @click="changePassword" :disabled="!canChangePassword">确认修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vue 3 Composition API 导入
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import {useRouter} from "vue-router";
const router = useRouter()
import axios from "axios";

// 用户数据响应式变量
const userData = ref({
  username: '',
  avatarUrl: '',
  email: '',
  job: '',
})

// 可编辑的用户数据
const editableUserData = ref({ ...userData.value })

// 页面状态管理
const activeTab = ref('avatar') // 当前激活的标签页
const isDropdownOpen = ref(false) // 下拉菜单显示状态
const dropdownRef = ref(null) // 下拉菜单DOM引用
const fileInput = ref(null) // 文件输入框引用

// 头像上传相关状态
const uploadProgress = ref(0) // 上传进度
const showTip = ref(false) // 显示提示
const tipText = ref('') // 提示文本
const tipType = ref('success') // 提示类型：success 或 error

// 头像设置
const avatarSettings = ref({
  showInPosts: true,
  showInComments: true
})

// 图片裁剪相关状态
const showCropModal = ref(false) // 显示裁剪弹窗
const cropCanvas = ref(null) // 裁剪画布引用
const cropScale = ref(1) // 裁剪缩放比例
const originalImage = ref(null) // 原始图片对象

// 新增移动功能相关状态
const cropOffsetX = ref(0) // 图片X轴偏移
const cropOffsetY = ref(0) // 图片Y轴偏移
const isDragging = ref(false) // 是否正在拖拽
const lastMouseX = ref(0) // 上次鼠标X位置
const lastMouseY = ref(0) // 上次鼠标Y位置

// 安全设置相关
const showChangePassword = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 登录记录数据
const loginRecords = ref([
  {
    id: 1,
    device: 'Chrome 浏览器 (Windows)',
    location: '北京市',
    time: new Date(),
    status: 'current'
  },
  {
    id: 2,
    device: 'Safari 浏览器 (iPhone)',
    location: '上海市',
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'history'
  },
  {
    id: 3,
    device: 'Firefox 浏览器 (macOS)',
    location: '广州市',
    time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'history'
  }
])

// 历史记录相关
const activeHistoryFilter = ref('all')
const historyFilters = ref([
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'login', label: '登录', icon: '🔐' },
  { key: 'profile', label: '资料', icon: '👤' },
  { key: 'security', label: '安全', icon: '🔒' },
  { key: 'server', label: '服务器', icon: '🖥️' }
])

const historyRecords = ref([
  {
    id: 1,
    type: 'login',
    title: '账户登录',
    description: '从 Chrome 浏览器登录账户',
    time: new Date(),
    ip: '192.168.1.100',
    status: 'success'
  },
  {
    id: 2,
    type: 'profile',
    title: '修改个人信息',
    description: '更新了个人简介和联系方式',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'success'
  },
  {
    id: 3,
    type: 'security',
    title: '修改密码',
    description: '成功修改登录密码',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'success'
  },
  {
    id: 4,
    type: 'server',
    title: '绑定服务器',
    description: '绑定了新的 Minecraft 服务器账号',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'success'
  },
  {
    id: 5,
    type: 'login',
    title: '异常登录尝试',
    description: '检测到来自异地的登录尝试',
    time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ip: '203.208.60.1',
    status: 'warning'
  }
])

const hasMoreHistory = ref(true)

// 服务器绑定相关
const showAddServer = ref(false)
const newServer = ref({
  type: '',
  name: '',
  gameId: ''
})

const boundServers = ref([
  {
    id: 1,
    type: 'minecraft',
    typeName: 'Minecraft',
    name: '我的世界服务器',
    gameId: 'Steve_2023',
    level: 45,
    status: 'online',
    bindTime: new Date('2024-01-15'),
    lastSync: new Date()
  },
  {
    id: 2,
    type: 'steam',
    typeName: 'Steam',
    name: 'Steam 账户',
    gameId: 'player_12345',
    level: 28,
    status: 'offline',
    bindTime: new Date('2024-02-01'),
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
])

// 偏好设置
const preferences = ref({
  theme: 'auto',
  language: 'zh-CN',
  emailNotifications: true,
  desktopNotifications: false,
  soundNotifications: true,
  profileVisibility: 'public',
  showOnlineStatus: true
})

const originalPreferences = ref({ ...preferences.value })

// 预加载数据
onMounted(async () => {
  console.log('Preloading data...')
  try {
    const response = await axios.get('/api/user/profile');
    console.log('User profile:', response.data);
    userData.value = response.data.data
    console.log(userData)
    editableUserData.value = { ...userData.value }
  } catch (error) {
    console.error('Error login:', error);
    return false;
  }
})

// 计算属性
const circumference = computed(() => 2 * Math.PI * 56)

const hasProfileChanges = computed(() => {
  return JSON.stringify(editableUserData.value) !== JSON.stringify(userData.value)
})

const hasPreferenceChanges = computed(() => {
  return JSON.stringify(preferences.value) !== JSON.stringify(originalPreferences.value)
})

const filteredHistoryRecords = computed(() => {
  if (activeHistoryFilter.value === 'all') {
    return historyRecords.value
  }
  return historyRecords.value.filter(record => record.type === activeHistoryFilter.value)
})

const canAddServer = computed(() => {
  return newServer.value.type && newServer.value.name && newServer.value.gameId
})

const canChangePassword = computed(() => {
  return passwordForm.value.currentPassword &&
      passwordForm.value.newPassword &&
      passwordForm.value.confirmPassword &&
      passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
      passwordForm.value.newPassword.length >= 6
})

// 方法定义
const setActiveTab = (tab) => {
  activeTab.value = tab
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    showTipMessage('请选择图片文件！', 'error')
    return
  }

  // 验证文件大小（5MB限制）
  if (file.size > 5 * 1024 * 1024) {
    showTipMessage('文件大小不能超过5MB！', 'error')
    return
  }

  // 读取文件并显示裁剪界面
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      originalImage.value = img
      showCropModal.value = true
      nextTick(() => {
        initializeCrop()
      })
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)

  // 清空文件输入框
  event.target.value = ''
}

const initializeCrop = () => {
  if (!cropCanvas.value || !originalImage.value) return

  const canvas = cropCanvas.value
  const ctx = canvas.getContext('2d')

  canvas.width = 300
  canvas.height = 300

  // 重置移动相关状态
  cropOffsetX.value = 0
  cropOffsetY.value = 0
  isDragging.value = false

  updateCrop()
}

const updateCrop = () => {
  if (!cropCanvas.value || !originalImage.value) return

  const canvas = cropCanvas.value
  const ctx = canvas.getContext('2d')
  const img = originalImage.value

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 计算缩放后的图片尺寸
  const scale = cropScale.value
  const imgWidth = img.width * scale
  const imgHeight = img.height * scale

  // 计算图片绘制位置（包含偏移）
  const x = (canvas.width - imgWidth) / 2 + cropOffsetX.value
  const y = (canvas.height - imgHeight) / 2 + cropOffsetY.value

  // 保存当前状态
  ctx.save()

  // 创建圆形裁剪路径
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI)
  ctx.clip()

  // 绘制图片
  ctx.drawImage(img, x, y, imgWidth, imgHeight)

  // 恢复状态
  ctx.restore()

  // 绘制裁剪框边框
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 1, 0, 2 * Math.PI)
  ctx.stroke()

  // 绘制中心十字线（帮助用户对齐）
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  // 水平线
  ctx.moveTo(canvas.width / 2 - 20, canvas.height / 2)
  ctx.lineTo(canvas.width / 2 + 20, canvas.height / 2)
  // 垂直线
  ctx.moveTo(canvas.width / 2, canvas.height / 2 - 20)
  ctx.lineTo(canvas.width / 2, canvas.height / 2 + 20)
  ctx.stroke()
}

// 鼠标按下事件
const handleMouseDown = (event) => {
  isDragging.value = true
  const rect = cropCanvas.value.getBoundingClientRect()
  lastMouseX.value = event.clientX - rect.left
  lastMouseY.value = event.clientY - rect.top
  cropCanvas.value.style.cursor = 'grabbing'
}

// 鼠标移动事件
const handleMouseMove = (event) => {
  if (!isDragging.value) return

  const rect = cropCanvas.value.getBoundingClientRect()
  const currentX = event.clientX - rect.left
  const currentY = event.clientY - rect.top

  // 计算移动距离
  const deltaX = currentX - lastMouseX.value
  const deltaY = currentY - lastMouseY.value

  // 更新偏移量
  cropOffsetX.value += deltaX
  cropOffsetY.value += deltaY

  // 更新上次鼠标位置
  lastMouseX.value = currentX
  lastMouseY.value = currentY

  // 重新绘制
  updateCrop()
}

// 鼠标释放事件
const handleMouseUp = () => {
  isDragging.value = false
  cropCanvas.value.style.cursor = 'grab'
}

// 触摸事件处理（移动端支持）
const handleTouchStart = (event) => {
  event.preventDefault()
  const touch = event.touches[0]
  const rect = cropCanvas.value.getBoundingClientRect()
  isDragging.value = true
  lastMouseX.value = touch.clientX - rect.left
  lastMouseY.value = touch.clientY - rect.top
}

const handleTouchMove = (event) => {
  event.preventDefault()
  if (!isDragging.value) return

  const touch = event.touches[0]
  const rect = cropCanvas.value.getBoundingClientRect()
  const currentX = touch.clientX - rect.left
  const currentY = touch.clientY - rect.top

  const deltaX = currentX - lastMouseX.value
  const deltaY = currentY - lastMouseY.value

  cropOffsetX.value += deltaX
  cropOffsetY.value += deltaY

  lastMouseX.value = currentX
  lastMouseY.value = currentY

  updateCrop()
}

const handleTouchEnd = (event) => {
  event.preventDefault()
  isDragging.value = false
}

// 重置裁剪位置
const resetCropPosition = () => {
  cropOffsetX.value = 0
  cropOffsetY.value = 0
  updateCrop()
}

const confirmCrop = async () => {
  if (!cropCanvas.value) return
  const canvas = cropCanvas.value
  const dataURL = canvas.toDataURL('image/png', 0.9)
  canvas.toBlob(async (blob) => {
    if (!blob) return
    const formData = new FormData()
    formData.append('file', blob, 'avatar.png') // 添加文件，后端收到文件名
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      const response = await axios.post('/api/user/profile/avatar', formData);
      console.log('User profile:', response.data);
      userData.value = response.data.data
      console.log(userData)
      editableUserData.value = { ...userData.value }
    } catch (error) {
      console.error('Error login:', error);
      return false;
    }
  }, 'image/png', 0.9)
  //uploadAvatar(dataURL)
  closeCropModal()
}

const closeCropModal = () => {
  showCropModal.value = false
  cropScale.value = 1
  cropOffsetX.value = 0
  cropOffsetY.value = 0
  isDragging.value = false
  originalImage.value = null
}

const uploadAvatar = async (imageData) => {
  try {
    uploadProgress.value = 0

    const uploadInterval = setInterval(() => {
      uploadProgress.value += Math.random() * 15
      if (uploadProgress.value >= 100) {
        uploadProgress.value = 100
        clearInterval(uploadInterval)

        setTimeout(() => {
          userData.value.avatarUrl = imageData
          editableUserData.value.avatarUrl = imageData
          uploadProgress.value = 0
          showTipMessage('头像上传成功！', 'success')
        }, 500)
      }
    }, 200)

  } catch (error) {
    console.error('头像上传失败:', error)
    uploadProgress.value = 0
    showTipMessage('头像上传失败，请重试！', 'error')
  }
}

const resetAvatar = () => {
  userData.value.avatarUrl = '/placeholder.svg?height=200&width=200'
  editableUserData.value.avatarUrl = '/placeholder.svg?height=200&width=200'
  showTipMessage('头像已重置为默认头像', 'success')
}

const saveProfile = async () => {
  try {
    console.log('保存用户信息:', editableUserData.value)
    const response = await axios.put('/api/user/profile',  editableUserData.value);
    console.log(response)
    userData.value = response.data
    editableUserData.value = { ...userData.value }
    showTipMessage('个人信息保存成功！', 'success')
  } catch (error) {
    console.error('保存失败:', error)
    showTipMessage('保存失败，请重试！', 'error')
  }
}

const resetProfile = () => {
  editableUserData.value = { ...userData.value }
  showTipMessage('已重置为原始信息', 'success')
}

const savePreferences = async () => {
  try {
    console.log('保存偏好设置:', preferences.value)

    await new Promise(resolve => setTimeout(resolve, 1000))

    originalPreferences.value = { ...preferences.value }
    showTipMessage('偏好设置保存成功！', 'success')
  } catch (error) {
    console.error('保存失败:', error)
    showTipMessage('保存失败，请重试！', 'error')
  }
}

const resetPreferences = () => {
  preferences.value = {
    theme: 'auto',
    language: 'zh-CN',
    emailNotifications: true,
    desktopNotifications: false,
    soundNotifications: true,
    profileVisibility: 'public',
    showOnlineStatus: true
  }
  showTipMessage('已恢复默认设置', 'success')
}

const toggleSmsVerification = () => {
  userData.value.smsVerification = !userData.value.smsVerification
  showTipMessage(
      userData.value.smsVerification ? '短信验证已启用' : '短信验证已关闭',
      'success'
  )
}

const toggleEmailVerification = () => {
  userData.value.emailVerification = !userData.value.emailVerification
  showTipMessage(
      userData.value.emailVerification ? '邮箱验证已启用' : '邮箱验证已关闭',
      'success'
  )
}

const changePassword = async () => {
  try {
    console.log('修改密码')

    await new Promise(resolve => setTimeout(resolve, 1000))

    userData.value.lastPasswordChange = new Date()
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    showChangePassword.value = false
    showTipMessage('密码修改成功！', 'success')
  } catch (error) {
    console.error('密码修改失败:', error)
    showTipMessage('密码修改失败，请重试！', 'error')
  }
}

const setHistoryFilter = (filter) => {
  activeHistoryFilter.value = filter
}

const loadMoreHistory = () => {
  console.log('加载更多历史记录')
  // 模拟加载更多
  setTimeout(() => {
    hasMoreHistory.value = false
  }, 1000)
}

const addServer = async () => {
  try {
    console.log('绑定服务器:', newServer.value)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const serverTypeNames = {
      minecraft: 'Minecraft',
      steam: 'Steam',
      origin: 'Origin',
      battlenet: 'Battle.net'
    }

    boundServers.value.push({
      id: Date.now(),
      type: newServer.value.type,
      typeName: serverTypeNames[newServer.value.type],
      name: newServer.value.name,
      gameId: newServer.value.gameId,
      level: 1,
      status: 'online',
      bindTime: new Date(),
      lastSync: new Date()
    })

    newServer.value = { type: '', name: '', gameId: '' }
    showAddServer.value = false
    showTipMessage('服务器绑定成功！', 'success')
  } catch (error) {
    console.error('绑定失败:', error)
    showTipMessage('绑定失败，请重试！', 'error')
  }
}

const syncServer = (serverId) => {
  console.log('同步服务器:', serverId)
  const server = boundServers.value.find(s => s.id === serverId)
  if (server) {
    server.lastSync = new Date()
    showTipMessage('服务器数据同步成功！', 'success')
  }
}

const editServer = (serverId) => {
  console.log('编辑服务器:', serverId)
  showTipMessage('编辑功能开发中...', 'success')
}

const unbindServer = (serverId) => {
  if (confirm('确定要解绑这个服务器账号吗？')) {
    boundServers.value = boundServers.value.filter(s => s.id !== serverId)
    showTipMessage('服务器账号已解绑', 'success')
  }
}

const showTipMessage = (message, type = 'success') => {
  tipText.value = message
  tipType.value = type
  showTip.value = true

  setTimeout(() => {
    showTip.value = false
  }, 3000)
}

const formatDate = (date) => {
  if (!date) return '未知'

  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}分钟前`
    }
    return `${hours}小时前`
  } else if (days < 30) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const getHistoryIcon = (type) => {
  const icons = {
    login: '🔐',
    profile: '👤',
    security: '🔒',
    server: '🖥️'
  }
  return icons[type] || '📋'
}

const getStatusText = (status) => {
  const texts = {
    success: '成功',
    warning: '警告',
    error: '失败'
  }
  return texts[status] || '未知'
}

const getServerIcon = (type) => {
  const icons = {
    minecraft: '⛏️',
    steam: '🎮',
    origin: '🎯',
    battlenet: '⚔️'
  }
  return icons[type] || '🖥️'
}

const getServerStatus = (status) => {
  const texts = {
    online: '在线',
    offline: '离线',
    error: '错误'
  }
  return texts[status] || '未知'
}

// 导航相关方法
const goBack = async () => {
  await router.push('/main')
  console.log('返回首页')
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const goToSettings = () => {
  console.log('跳转到设置页面')
  closeDropdown()
}

const goToHelp = () => {
  console.log('跳转到帮助页面')
  closeDropdown()
}

const logout = () => {
  console.log('用户退出登录')
  closeDropdown()
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

// 组件挂载后的操作
onMounted(() => {
  console.log('个人中心页面已加载完成')

  document.body.style.margin = '0'
  document.body.style.padding = '0'
  document.body.style.overflow = 'hidden'
  document.documentElement.style.margin = '0'
  document.documentElement.style.padding = '0'
  document.documentElement.style.overflow = 'hidden'

  document.addEventListener('click', handleClickOutside)

  // 添加全局鼠标事件监听（用于拖拽时鼠标移出画布的情况）
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
/* 主容器样式 */
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
  background-image: url('@/assets/picture/picture1.jpg');
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
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden;
}

/* 个人中心容器 */
.profile-container {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 0;
}

/* 左侧导航菜单 */
.sidebar-menu {
  background: rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.sidebar-menu::-webkit-scrollbar {
  width: 6px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 菜单头部 */
.menu-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.user-avatar-large {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.avatar-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
}

.status-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.user-info-large {
  text-align: center;
}

.username-large {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.user-level {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 菜单导航 */
.menu-nav {
  flex: 1;
  padding: 1rem 0;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 1);
  border-left-color: rgba(255, 255, 255, 0.3);
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 1);
  border-left-color: rgba(255, 255, 255, 0.6);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.menu-icon {
  margin-right: 0.75rem;
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.menu-text {
  font-weight: 500;
}

/* 右侧内容区域 */
.content-area {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 内容头部 */
.content-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.content-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.content-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 头像设置样式 */
.avatar-settings {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.avatar-settings::-webkit-scrollbar {
  width: 6px;
}

.avatar-settings::-webkit-scrollbar-track {
  background: transparent;
}

.avatar-settings::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.avatar-settings::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.current-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-upload-container {
  width: 100%;
  max-width: 300px;
}

/* 当前头像显示 */
.current-avatar {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.current-avatar:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* 头像占位符 */
.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.placeholder-text {
  font-size: 0.9rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 上传覆盖层 */
.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.current-avatar:hover .upload-overlay {
  opacity: 1;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: white;
}

.upload-text {
  font-size: 0.9rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 上传进度环 */
.upload-progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  position: absolute;
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* 隐藏的文件输入框 */
.hidden-file-input {
  display: none;
}

/* 头像操作按钮 */
.avatar-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
}

/* 头像设置选项 */
.avatar-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.option-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.option-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.option-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.option-item:last-child {
  margin-bottom: 0;
}

.option-icon {
  margin-right: 0.75rem;
  font-size: 1rem;
  flex-shrink: 0;
}

/* 个人信息表单样式 */
.profile-form {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.profile-form::-webkit-scrollbar {
  width: 6px;
}

.profile-form::-webkit-scrollbar-track {
  background: transparent;
}

.profile-form::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.profile-form::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1.5rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.form-input,
.form-textarea,
.form-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* 操作按钮样式 */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  flex: 1;
}

.action-btn.primary {
  background: rgba(76, 175, 80, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(76, 175, 80, 0.3);
}

.action-btn.primary:hover:not(:disabled) {
  background: rgba(76, 175, 80, 0.3);
  border-color: rgba(76, 175, 80, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 历史记录样式 */
.history-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history-filters {
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.filter-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

.filter-btn.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.filter-icon {
  font-size: 1rem;
}

.history-list {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track {
  background: transparent;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.history-item {
  display: flex;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.history-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 1rem;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.history-icon.login {
  background: rgba(52, 152, 219, 0.2);
}

.history-icon.profile {
  background: rgba(155, 89, 182, 0.2);
}

.history-icon.security {
  background: rgba(231, 76, 60, 0.2);
}

.history-icon.server {
  background: rgba(46, 204, 113, 0.2);
}

.history-content-text {
  flex: 1;
}

.history-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.history-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.history-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.history-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  align-self: flex-start;
}

.history-status.success {
  background: rgba(76, 175, 80, 0.2);
  color: rgba(76, 175, 80, 0.9);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.history-status.warning {
  background: rgba(255, 193, 7, 0.2);
  color: rgba(255, 193, 7, 0.9);
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.history-status.error {
  background: rgba(244, 67, 54, 0.2);
  color: rgba(244, 67, 54, 0.9);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.load-more-section {
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.load-more-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

/* 服务器绑定样式 */
.servers-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.servers-content::-webkit-scrollbar {
  width: 6px;
}

.servers-content::-webkit-scrollbar-track {
  background: transparent;
}

.servers-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.servers-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.add-server-section {
  margin-bottom: 2rem;
}

.add-server-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.add-server-btn:hover {
  background: rgba(76, 175, 80, 0.3);
  border-color: rgba(76, 175, 80, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.servers-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.server-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.server-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.server-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.server-info {
  display: flex;
  align-items: center;
}

.server-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.server-icon.minecraft {
  background: rgba(139, 69, 19, 0.3);
}

.server-icon.steam {
  background: rgba(23, 26, 33, 0.3);
}

.server-icon.origin {
  background: rgba(255, 120, 0, 0.3);
}

.server-icon.battlenet {
  background: rgba(0, 174, 255, 0.3);
}

.server-details {
  flex: 1;
}

.server-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.25rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.server-type {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.server-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.server-status.online {
  background: rgba(76, 175, 80, 0.2);
  color: rgba(76, 175, 80, 0.9);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.server-status.offline {
  background: rgba(158, 158, 158, 0.2);
  color: rgba(158, 158, 158, 0.9);
  border: 1px solid rgba(158, 158, 158, 0.3);
}

.server-status .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.server-status.online .status-dot {
  background: rgba(76, 175, 80, 0.9);
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.5);
}

.server-status.offline .status-dot {
  background: rgba(158, 158, 158, 0.9);
}

.server-content {
  margin-bottom: 1.5rem;
}

.server-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.server-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.server-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.server-btn.sync {
  background: rgba(52, 152, 219, 0.2);
  color: rgba(52, 152, 219, 0.9);
  border-color: rgba(52, 152, 219, 0.3);
}

.server-btn.sync:hover {
  background: rgba(52, 152, 219, 0.3);
  border-color: rgba(52, 152, 219, 0.5);
}

.server-btn.edit {
  background: rgba(255, 193, 7, 0.2);
  color: rgba(255, 193, 7, 0.9);
  border-color: rgba(255, 193, 7, 0.3);
}

.server-btn.edit:hover {
  background: rgba(255, 193, 7, 0.3);
  border-color: rgba(255, 193, 7, 0.5);
}

.server-btn.danger {
  background: rgba(244, 67, 54, 0.2);
  color: rgba(244, 67, 54, 0.9);
  border-color: rgba(244, 67, 54, 0.3);
}

.server-btn.danger:hover {
  background: rgba(244, 67, 54, 0.3);
  border-color: rgba(244, 67, 54, 0.5);
}

/* 提示消息样式 */
.tip-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
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

.tip-message.show {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -50%) scale(1);
}

.tip-message.success {
  background: rgba(76, 175, 80, 0.9);
  color: white;
}

.tip-message.error {
  background: rgba(244, 67, 54, 0.9);
  color: white;
}

.tip-icon {
  font-size: 1.2rem;
}

.tip-text {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 图片裁剪弹窗样式 */
.crop-modal {
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

.crop-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
}

.crop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
}

.crop-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.1);
}

.crop-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.crop-preview-area {
  display: flex;
  justify-content: center;
}

.crop-canvas {
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: border-color 0.3s ease;
}

.crop-canvas:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.crop-controls {
  width: 100%;
  max-width: 300px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.control-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.scale-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
}

.scale-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.scale-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.reset-position-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.reset-position-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.crop-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
}

.crop-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.crop-btn.cancel {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.crop-btn.cancel:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.crop-btn.confirm {
  background: rgba(76, 175, 80, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(76, 175, 80, 0.3);
}

.crop-btn.confirm:hover {
  background: rgba(76, 175, 80, 0.3);
  border-color: rgba(76, 175, 80, 0.5);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

/* 弹窗样式 */
.modal-overlay {
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

.modal-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  overflow: hidden;
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
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.modal-content {
  padding: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
}

.modal-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.modal-btn.cancel {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.modal-btn.cancel:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.modal-btn.confirm {
  background: rgba(76, 175, 80, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(76, 175, 80, 0.3);
}

.modal-btn.confirm:hover {
  background: rgba(76, 175, 80, 0.3);
  border-color: rgba(76, 175, 80, 0.5);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 1024px) {
  .profile-container {
    grid-template-columns: 250px 1fr;
  }

  .avatar-settings {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .server-stats {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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

  .profile-container {
    max-width: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .sidebar-menu {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    max-height: 200px;
    overflow-y: auto;
  }

  .menu-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-align: left;
  }

  .user-avatar-large {
    width: 60px;
    height: 60px;
    margin: 0;
  }

  .menu-nav {
    padding: 0.5rem 0;
  }

  .menu-list {
    display: flex;
    overflow-x: auto;
    gap: 0.5rem;
    padding: 0 1rem;
  }

  .menu-item {
    flex-shrink: 0;
    padding: 0.5rem 1rem;
    border-left: none;
    border-radius: 20px;
    white-space: nowrap;
  }

  .menu-item.active {
    border-left: none;
    background: rgba(255, 255, 255, 0.2);
  }

  .content-header {
    padding: 1rem;
  }

  .content-title {
    font-size: 1.3rem;
  }

  .avatar-settings,
  .profile-form,
  .history-content,
  .servers-content {
    padding: 1rem;
  }

  .current-avatar {
    width: 150px;
    height: 150px;
  }

  .avatar-actions {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }

  .history-filters {
    padding: 1rem;
  }

  .filter-group {
    justify-content: center;
  }

  .history-list {
    padding: 1rem;
  }

  .history-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .history-icon {
    margin-right: 0;
    align-self: center;
  }

  .server-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .server-actions {
    justify-content: center;
  }

  .server-stats {
    grid-template-columns: 1fr 1fr;
  }

  .crop-container,
  .modal-container {
    width: 95%;
    max-width: none;
  }

  .crop-content,
  .modal-content {
    padding: 1.5rem;
  }

  .crop-canvas {
    width: 250px;
    height: 250px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .main-content {
    padding: 0.5rem;
  }

  .content-header {
    padding: 0.75rem;
  }

  .content-title {
    font-size: 1.2rem;
  }

  .avatar-settings,
  .profile-form,
  .servers-content {
    padding: 0.75rem;
  }

  .current-avatar {
    width: 120px;
    height: 120px;
  }

  .menu-header {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .menu-list {
    flex-direction: column;
    gap: 0;
  }

  .menu-item {
    border-radius: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .history-list {
    padding: 0.75rem;
  }

  .server-stats {
    grid-template-columns: 1fr;
  }

  .server-actions {
    flex-direction: column;
  }

  .crop-canvas {
    width: 200px;
    height: 200px;
  }
}

/* 动画效果 */
.glass-navbar {
  animation: slideDown 0.6s ease-out;
}

.profile-container {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.tab-content {
  animation: fadeIn 0.5s ease-out;
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