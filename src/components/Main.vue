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
            <li><a href="#home" @click="showPosts">首页</a></li>
            <li><a href="#about">wiki</a></li>
            <li><a href="#services" @click="showService">服务</a></li>
            <li><a href="#contact" @click="showContact">联系</a></li>
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
                <li class="dropdown-item" @click="showContact">
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
      <!-- 帖子展示容器 -->
      <div v-if="currentView === 'posts'" class="posts-container">
        <div class="posts-header">
          <h2 class="posts-title">最新动态</h2>
          <div class="posts-filter">
            <button
                v-for="filter in filters"
                :key="filter.key"
                :class="['filter-btn', { 'active': activeFilter === filter.key }]"
                @click="setActiveFilter(filter.key)"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- 帖子列表 - 支持独立滚动 -->
        <div class="posts-list" ref="postsListRef">
          <div
              v-for="post in filteredPosts"
              :key="post.id"
              class="post-item"
              @click="openPost(post)"
          >
            <!-- 帖子头部 -->
            <div class="post-header">
              <div class="post-author">
                <img :src="post.author.avatar" :alt="post.author.name" class="author-avatar">
                <div class="author-info">
                  <div class="author-name">{{ post.author.name }}</div>
                  <div class="post-time">{{ formatTime(post.createdAt) }}</div>
                </div>
              </div>
              <div class="post-actions">
                <button class="action-btn" @click.stop="toggleLike(post)">
                  <span :class="['like-icon', { 'liked': post.isLiked }]">❤️</span>
                  <span class="action-count">{{ post.likes }}</span>
                </button>
              </div>
            </div>

            <!-- 帖子内容 -->
            <div class="post-content">
              <p class="post-text">{{ post.content }}</p>
              <div v-if="post.image" class="post-image">
                <img :src="post.image" :alt="post.title" class="content-image">
              </div>
            </div>

            <!-- 帖子底部 -->
            <div class="post-footer">
              <div class="post-stats">
                <span class="stat-item">
                  <span class="stat-icon">💬</span>
                  <span class="stat-count">{{ post.comments }}</span>
                </span>
                <span class="stat-item">
                  <span class="stat-icon">👁️</span>
                  <span class="stat-count">{{ post.views }}</span>
                </span>
              </div>
              <div class="post-tags">
                <span
                    v-for="tag in post.tags"
                    :key="tag"
                    class="post-tag"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- 加载更多指示器 -->
          <div class="load-more" v-if="hasMore">
            <button class="load-more-btn" @click="loadMorePosts">
              加载更多
            </button>
          </div>
        </div>
      </div>

      <!-- 联系我们页面 -->
      <div v-if="currentView === 'contact'" class="contact-container">
        <div class="contact-header">
          <h2 class="contact-title">联系我们</h2>
          <p class="contact-subtitle">多种方式与我们取得联系，我们将竭诚为您服务</p>
        </div>

        <!-- 联系方式列表 -->
        <div class="contact-list">
          <!-- 官方QQ群 -->
          <div class="contact-item">
            <div class="contact-icon">
              <div class="icon-wrapper qq-group">
                <span class="icon">👥</span>
              </div>
            </div>
            <div class="contact-info">
              <h3 class="contact-name">官方QQ群</h3>
              <p class="contact-description">加入我们的官方QQ群，与更多用户交流互动</p>
              <div class="contact-value">
                <span class="value-text">701312028</span>
                <button class="copy-btn" @click="copyToClipboard('701312028', 'QQ群号')">
                  <span class="copy-icon">📋</span>
                  <span>复制</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 官方QQ -->
          <div class="contact-item">
            <div class="contact-icon">
              <div class="icon-wrapper qq">
                <span class="icon">💬</span>
              </div>
            </div>
            <div class="contact-info">
              <h3 class="contact-name">官方QQ</h3>
              <p class="contact-description">一对一客服支持，快速解决您的问题</p>
              <div class="contact-value">
                <span class="value-text">2569736791</span>
                <button class="copy-btn" @click="copyToClipboard('2569736791', 'QQ号')">
                  <span class="copy-icon">📋</span>
                  <span>复制</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 官方邮箱 -->
          <div class="contact-item">
            <div class="contact-icon">
              <div class="icon-wrapper email">
                <span class="icon">📧</span>
              </div>
            </div>
            <div class="contact-info">
              <h3 class="contact-name">官方邮箱</h3>
              <p class="contact-description">发送邮件给我们，我们会在24小时内回复</p>
              <div class="contact-value">
                <span class="value-text">2569736791@qq.com</span>
                <button class="copy-btn" @click="copyToClipboard('2569736791@qq.com', '邮箱地址')">
                  <span class="copy-icon">📋</span>
                  <span>复制</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系提示 -->
        <div class="contact-tips">
          <h3 class="tips-title">联系提示</h3>
          <ul class="tips-list">
            <li class="tip-item">
              <span class="tip-icon">💡</span>
              <span>QQ群内可以与其他用户交流经验，获得更快的帮助</span>
            </li>
            <li class="tip-item">
              <span class="tip-icon">⚡</span>
              <span>紧急问题建议通过官方QQ联系，响应更及时</span>
            </li>
            <li class="tip-item">
              <span class="tip-icon">📝</span>
              <span>邮件联系请详细描述问题，便于我们更好地为您服务</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 复制成功提示 -->
    <div v-if="showCopyTip" class="copy-tip" :class="{ 'show': showCopyTip }">
      <span class="tip-icon">✅</span>
      <span class="tip-text">{{ copyTipText }}</span>
    </div>
  </div>
</template>

<script setup>
// Vue 3 Composition API
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from "axios";
import {useRouter} from "vue-router";
const router = useRouter()
// 用户数据
const userData = ref({
  username: '',
  avatarUrl: '',
  email: ''
})
// 示例：如果需要动态背景图片
const backgroundImage = ref('/placeholder.svg?height=1080&width=1920')

// 页面视图状态
const currentView = ref('posts') // 'posts' 或 'contact'

// 下拉菜单状态
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const postsListRef = ref(null)

// 复制提示状态
const showCopyTip = ref(false)
const copyTipText = ref('')

// 帖子过滤器
const filters = ref([
  { key: 'all', label: '全部' },
  { key: 'hot', label: '热门' },
  { key: 'latest', label: '最新' },
  { key: 'following', label: '关注' }
])

const activeFilter = ref('all')
const hasMore = ref(true)

// 示例帖子数据
const posts = ref([
  {
    id: 1,
    author: {
      name: '李小明',
      avatar: '/placeholder.svg?height=40&width=40'
    },
    content: '今天天气真不错，和朋友们一起去公园散步，看到了很多美丽的花朵。春天真的来了！🌸',
    image: '/placeholder.svg?height=200&width=300',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    likes: 24,
    comments: 8,
    views: 156,
    tags: ['生活', '春天', '散步'],
    isLiked: false,
    type: 'latest'
  },
  {
    id: 2,
    author: {
      name: '王小红',
      avatar: '/placeholder.svg?height=40&width=40'
    },
    content: '分享一个超好用的Vue3技巧！使用Composition API可以让代码更加简洁和易维护。',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5小时前
    likes: 89,
    comments: 23,
    views: 445,
    tags: ['技术', 'Vue3', '前端'],
    isLiked: true,
    type: 'hot'
  },
  {
    id: 3,
    author: {
      name: '张大伟',
      avatar: '/placeholder.svg?height=40&width=40'
    },
    content: '刚刚完成了一个新项目的设计稿，用了很多毛玻璃效果，感觉很现代化。设计师的工作真的很有趣！',
    image: '/placeholder.svg?height=250&width=400',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8小时前
    likes: 56,
    comments: 15,
    views: 289,
    tags: ['设计', '毛玻璃', 'UI'],
    isLiked: false,
    type: 'hot'
  },
  {
    id: 4,
    author: {
      name: '陈小美',
      avatar: '/placeholder.svg?height=40&width=40'
    },
    content: '今天学会了一个新的CSS技巧，backdrop-filter真的太强大了！可以轻松实现毛玻璃效果。',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12小时前
    likes: 34,
    comments: 11,
    views: 178,
    tags: ['CSS', '前端', '学习'],
    isLiked: true,
    type: 'latest'
  },
  {
    id: 5,
    author: {
      name: '刘小强',
      avatar: '/placeholder.svg?height=40&width=40'
    },
    content: '周末和家人一起做饭，做了一桌子好菜。家人在一起的时光总是最珍贵的。❤️',
    image: '/placeholder.svg?height=180&width=320',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
    likes: 67,
    comments: 19,
    views: 234,
    tags: ['家庭', '美食', '周末'],
    isLiked: false,
    type: 'following'
  }
])

// 预加载数据
onMounted(async () => {
  console.log('Preloading data...')
  try {
    const response = await axios.get('/api/user/profile');
    console.log('User profile:', response.data);
    userData.value = response.data.data
    console.log(userData)
    console.log(userData.value.avatarUrl)
  } catch (error) {
    console.error('Error login:', error);
    return false;
  }
})

// 过滤后的帖子
const filteredPosts = computed(() => {
  if (activeFilter.value === 'all') {
    return posts.value
  }
  return posts.value.filter(post => post.type === activeFilter.value)
})

// 显示帖子页面
const showPosts = () => {
  currentView.value = 'posts'
  closeDropdown()
}

// 显示服务页面
const showService = async () => {
  console.log('跳转到服务页面')
  await router.push('/service')
}

// 显示联系页面
const showContact = () => {
  currentView.value = 'contact'
  closeDropdown()
}

// 复制到剪贴板
const copyToClipboard = async (text, type) => {
  try {
    await navigator.clipboard.writeText(text)
    copyTipText.value = `${type}已复制到剪贴板`
    showCopyTip.value = true

    // 3秒后隐藏提示
    setTimeout(() => {
      showCopyTip.value = false
    }, 3000)
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案：使用传统方法复制
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      copyTipText.value = `${type}已复制到剪贴板`
      showCopyTip.value = true
      setTimeout(() => {
        showCopyTip.value = false
      }, 3000)
    } catch (fallbackErr) {
      console.error('降级复制也失败:', fallbackErr)
      copyTipText.value = '复制失败，请手动复制'
      showCopyTip.value = true
      setTimeout(() => {
        showCopyTip.value = false
      }, 3000)
    }
    document.body.removeChild(textArea)
  }
}

// 切换下拉菜单显示状态
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  isDropdownOpen.value = false
}

// 点击外部区域关闭下拉菜单
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

// 设置活跃过滤器
const setActiveFilter = (filterKey) => {
  activeFilter.value = filterKey
}

// 格式化时间
const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return `${days}天前`
  }
}

// 切换点赞状态
const toggleLike = (post) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

// 打开帖子详情
const openPost = (post) => {
  console.log('打开帖子:', post.id)
  // 这里可以添加路由跳转或弹窗逻辑
}

// 加载更多帖子
const loadMorePosts = () => {
  console.log('加载更多帖子')
  // 这里可以添加加载更多数据的逻辑
  // 模拟加载完成
  setTimeout(() => {
    hasMore.value = false
  }, 1000)
}

// 菜单项点击事件处理
const goToProfile = async () => {
  console.log('跳转到个人中心')
  await router.push('/user_profile')
  closeDropdown()
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

// 签到相关状态
const isCheckedIn = ref(false)
const todayPoints = ref(0)
const consecutiveDays = ref(0)
const totalCheckIns = ref(0)

// 检查今日是否已签到
const checkTodayCheckIn = () => {
  const today = new Date().toDateString()
  const lastCheckIn = localStorage.getItem('lastCheckIn')
  const checkInData = JSON.parse(localStorage.getItem('checkInData') || '{}')

  if (lastCheckIn === today) {
    isCheckedIn.value = true
    todayPoints.value = checkInData.todayPoints || 0
    consecutiveDays.value = checkInData.consecutiveDays || 0
    totalCheckIns.value = checkInData.totalCheckIns || 0
  }
}

// 签到功能
const checkIn = () => {
  if (isCheckedIn.value) {
    console.log('今日已签到')
    return
  }

  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
  const lastCheckIn = localStorage.getItem('lastCheckIn')
  const checkInData = JSON.parse(localStorage.getItem('checkInData') || '{}')

  // 计算连续签到天数
  let newConsecutiveDays = 1
  if (lastCheckIn === yesterday) {
    newConsecutiveDays = (checkInData.consecutiveDays || 0) + 1
  }

  // 计算今日获得积分（连续签到有奖励）
  const basePoints = 10
  const bonusPoints = Math.min(Math.floor(newConsecutiveDays / 7) * 5, 50) // 每7天连续签到额外奖励5分，最多50分
  const points = basePoints + bonusPoints

  // 更新状态
  isCheckedIn.value = true
  todayPoints.value = points
  consecutiveDays.value = newConsecutiveDays
  totalCheckIns.value = (checkInData.totalCheckIns || 0) + 1

  // 保存到本地存储
  localStorage.setItem('lastCheckIn', today)
  localStorage.setItem('checkInData', JSON.stringify({
    todayPoints: points,
    consecutiveDays: newConsecutiveDays,
    totalCheckIns: totalCheckIns.value
  }))

  console.log(`签到成功！获得 ${points} 积分，连续签到 ${newConsecutiveDays} 天`)
  closeDropdown()

  // 可以在这里添加签到成功的提示动画或通知
}

// 组件挂载后的操作
onMounted(() => {
  console.log('背景页面已加载完成')

  // 确保页面没有滚动条 - 动态设置body样式
  document.body.style.margin = '0'
  document.body.style.padding = '0'
  document.body.style.overflow = 'hidden'
  document.documentElement.style.margin = '0'
  document.documentElement.style.padding = '0'
  document.documentElement.style.overflow = 'hidden'

  // 添加全局点击事件监听器
  document.addEventListener('click', handleClickOutside)

  // 检查今日签到状态
  checkTodayCheckIn()
})

// 组件卸载时清理事件监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 主容器样式 - 设置全屏显示 */
.main-container {
  position: fixed; /* 改为fixed定位，确保完全固定在视窗 */
  top: 0; /* 明确设置顶部位置 */
  left: 0; /* 明确设置左侧位置 */
  width: 100vw; /* 视窗宽度 */
  height: 100vh; /* 视窗高度 */
  margin: 0; /* 清除外边距 */
  padding: 0; /* 清除内边距 */
  overflow: hidden; /* 隐藏溢出内容 */
  box-sizing: border-box; /* 边框盒模型，确保尺寸计算准确 */
}

/* 背景图片样式 */
.background-image {
  position: absolute; /* 绝对定位 */
  top: 0;
  left: 0;
  width: 100%; /* 占满容器宽度 */
  height: 100%; /* 占满容器高度 */
  margin: 0; /* 清除外边距 */
  padding: 0; /* 清除内边距 */

  /* 背景图片设置 */
  background-image: url('@/assets/picture/picture5.jpg');

  background-size: cover; /* 覆盖整个容器，保持图片比例 */
  background-position: center center; /* 图片居中显示 */
  background-repeat: no-repeat; /* 不重复显示 */

  /* 图片优化 */
  image-rendering: crisp-edges; /* 边缘清晰化 */

  /* 确保不会产生额外空间 */
  box-sizing: border-box;
}

/* 毛玻璃导航栏样式 */
.glass-navbar {
  position: absolute; /* 绝对定位在背景图片之上 */
  top: 0; /* 固定在页面顶部 */
  left: 0;
  width: 100%; /* 横跨整个页面宽度 */
  height: 80px; /* 导航栏高度 */
  z-index: 1000; /* 确保在最上层 */

  /* 毛玻璃效果 */
  background: rgba(255, 255, 255, 0.15); /* 半透明白色背景 */
  backdrop-filter: blur(20px); /* 背景模糊效果 */
  -webkit-backdrop-filter: blur(20px); /* Safari兼容性 */

  /* 边框和阴影 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* 底部细边框 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* 轻微阴影 */

  /* 确保不会产生额外空间 */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 导航栏内容容器 - 修改为相对定位 */
.navbar-content {
  position: relative; /* 相对定位，为子元素提供定位参考 */
  height: 100%; /* 占满导航栏高度 */
  max-width: 1200px; /* 最大宽度限制 */
  margin: 0 auto; /* 水平居中 */
  padding: 0 2rem; /* 左右内边距 */
  box-sizing: border-box;
}

/* Logo区域 - 绝对定位到左侧 */
.navbar-logo {
  position: absolute; /* 绝对定位 */
  left: 2rem; /* 距离左边距离 */
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%); /* 垂直居中调整 */
  z-index: 1002; /* 确保在最上层 */
}

/* Logo样式 */
.logo {
  font-size: 1.5rem; /* 字体大小 */
  font-weight: bold; /* 粗体 */
  color: rgba(255, 255, 255, 0.9); /* 白色文字，略微透明 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* 文字阴影 */
  white-space: nowrap; /* 防止换行 */
}

/* 导航栏中间区域 - 绝对居中 */
.navbar-center {
  position: absolute; /* 绝对定位 */
  left: 50%; /* 水平居中 */
  top: 50%; /* 垂直居中 */
  transform: translate(-50%, -50%); /* 完全居中 */
  z-index: 1001; /* 确保在合适层级 */
}

/* 导航菜单样式 */
.nav-menu {
  display: flex; /* 水平排列 */
  list-style: none; /* 移除列表样式 */
  margin: 0;
  padding: 0;
  gap: 2rem; /* 菜单项之间的间距 */
  white-space: nowrap; /* 防止换行 */
}

.nav-menu li {
  margin: 0;
  padding: 0;
}

.nav-menu a {
  color: rgba(255, 255, 255, 0.8); /* 白色文字，半透明 */
  text-decoration: none; /* 移除下划线 */
  font-size: 1rem; /* 字体大小 */
  font-weight: 500; /* 中等粗细 */
  padding: 0.5rem 1rem; /* 内边距 */
  border-radius: 6px; /* 圆角 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
  cursor: pointer; /* 鼠标指针 */
  display: block; /* 块级元素 */
}

.nav-menu a:hover {
  color: rgba(255, 255, 255, 1); /* 悬停时完全不透明 */
  background: rgba(255, 255, 255, 0.1); /* 悬停背景 */
  transform: translateY(-1px); /* 轻微上移效果 */
}

/* 导航栏右侧区域 - 绝对定位到右侧 */
.navbar-right {
  position: absolute; /* 绝对定位 */
  right: 2rem; /* 距离右边距离 */
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%); /* 垂直居中调整 */
  z-index: 1002; /* 确保在最上层 */
}

/* 用户下拉菜单容器 */
.user-dropdown {
  position: relative; /* 相对定位，为下拉菜单提供定位参考 */
  cursor: pointer; /* 鼠标指针 */
}

/* 用户头像容器 */
.user-avatar {
  position: relative; /* 相对定位，为在线指示器提供定位参考 */
  width: 40px; /* 头像宽度 */
  height: 40px; /* 头像高度 */
  border-radius: 50%; /* 圆形头像 */
  overflow: hidden; /* 隐藏溢出部分 */
  border: 2px solid rgba(255, 255, 255, 0.3); /* 白色边框 */
  transition: all 0.3s ease; /* 平滑过渡 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* 阴影效果 */
}

.user-avatar:hover {
  border-color: rgba(255, 255, 255, 0.6); /* 悬停时边框更明显 */
  transform: scale(1.05); /* 轻微放大效果 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 悬停阴影 */
}

/* 头像图片 */
.avatar-image {
  width: 100%; /* 占满容器 */
  height: 100%; /* 占满容器 */
  object-fit: cover; /* 保持比例裁剪 */
  border-radius: 50%; /* 圆形 */
}

/* 在线状态指示器 */
.online-indicator {
  position: absolute; /* 绝对定位 */
  bottom: 2px; /* 距离底部 */
  right: 2px; /* 距离右侧 */
  width: 12px; /* 指示器宽度 */
  height: 12px; /* 指示器高度 */
  background: #4ade80; /* 绿色表示在线 */
  border: 2px solid white; /* 白色边框 */
  border-radius: 50%; /* 圆形 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); /* 阴影 */
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute; /* 绝对定位 */
  top: calc(100% + 8px); /* 位于头像下方，留出较小间距 */
  right: 0; /* 右对齐 */
  width: 200px; /* 更紧凑的宽度 */
  background: rgba(255, 255, 255, 0.1); /* 更透明的背景，符合毛玻璃风格 */
  backdrop-filter: blur(20px); /* 强化毛玻璃效果 */
  -webkit-backdrop-filter: blur(20px); /* Safari兼容性 */
  border-radius: 8px; /* 较小的圆角 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); /* 更明显的阴影 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 更透明的边框 */
  opacity: 0; /* 初始透明 */
  visibility: hidden; /* 初始隐藏 */
  transform: translateY(-10px) scale(0.95); /* 初始位置和缩放 */
  transition: all 0.2s ease; /* 更快的过渡 */
  z-index: 1003; /* 确保在导航栏之上 */
  overflow: hidden; /* 确保圆角效果 */
}

/* 下拉菜单显示状态 */
.dropdown-menu.show {
  opacity: 1; /* 完全不透明 */
  visibility: visible; /* 显示 */
  transform: translateY(0) scale(1); /* 正常位置和大小 */
}

/* 下拉菜单头部 */
.dropdown-header {
  padding: 0.75rem; /* 减少内边距 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.15); /* 更透明的分割线 */
  background: rgba(255, 255, 255, 0.05); /* 轻微的背景色差 */
}

/* 用户信息 */
.user-info {
  text-align: left; /* 左对齐 */
}

.user-name {
  font-size: 0.9rem; /* 较小字体 */
  font-weight: 600; /* 粗体 */
  color: rgba(255, 255, 255, 0.9); /* 白色文字 */
  margin-bottom: 0.2rem; /* 减少下边距 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.user-email {
  font-size: 0.75rem; /* 更小字体 */
  color: rgba(255, 255, 255, 0.7); /* 半透明白色文字 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

/* 下拉菜单分割线 */
.dropdown-divider {
  height: 1px; /* 高度 */
  background: rgba(255, 255, 255, 0.15); /* 半透明白色分割线 */
  margin: 0.25rem 0; /* 减少上下边距 */
}

/* 下拉菜单列表 */
.dropdown-list {
  list-style: none; /* 移除列表样式 */
  margin: 0;
  padding: 0.25rem 0; /* 减少上下内边距 */
}

/* 下拉菜单项 */
.dropdown-item {
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中 */
  padding: 0.5rem 0.75rem; /* 减少内边距 */
  cursor: pointer; /* 鼠标指针 */
  transition: all 0.2s ease; /* 平滑过渡 */
  color: rgba(255, 255, 255, 0.8); /* 白色文字 */
  font-size: 0.85rem; /* 较小字体 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1); /* 半透明白色悬停背景 */
  color: rgba(255, 255, 255, 1); /* 悬停时完全不透明 */
  transform: translateX(2px); /* 轻微右移效果 */
}

/* 退出登录项特殊样式 */
.dropdown-item.logout {
  color: rgba(255, 100, 100, 0.9); /* 浅红色文字 */
}

.dropdown-item.logout:hover {
  background: rgba(255, 100, 100, 0.15); /* 红色半透明悬停背景 */
  color: rgba(255, 80, 80, 1); /* 深红色文字 */
}

/* 菜单项图标 */
.item-icon {
  margin-right: 0.5rem; /* 减少右边距 */
  font-size: 0.9rem; /* 较小图标 */
  width: 16px; /* 减少固定宽度 */
  text-align: center; /* 居中对齐 */
  opacity: 0.8; /* 轻微透明 */
}

/* 主要内容区域 */
.main-content {
  position: absolute; /* 绝对定位 */
  top: 80px; /* 从导航栏下方开始 */
  left: 0;
  width: 100%;
  height: calc(100% - 80px); /* 减去导航栏高度 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: flex-start; /* 顶部对齐 */
  padding: 2rem; /* 外边距 */
  box-sizing: border-box;
  overflow: hidden; /* 防止整体页面滚动 */
}

/* 帖子容器 */
.posts-container {
  width: 100%;
  max-width: 600px; /* 最大宽度限制 */
  height: 100%; /* 占满可用高度 */
  background: rgba(255, 255, 255, 0.1); /* 半透明白色背景 */
  backdrop-filter: blur(20px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(20px); /* Safari兼容性 */
  border-radius: 16px; /* 圆角 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 半透明边框 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* 阴影 */
  overflow: hidden; /* 确保圆角效果 */
  display: flex;
  flex-direction: column; /* 垂直布局 */
}

/* 联系我们容器 */
.contact-container {
  width: 100%;
  max-width: 700px; /* 稍大的最大宽度 */
  height: 100%; /* 占满可用高度 */
  background: rgba(255, 255, 255, 0.1); /* 半透明白色背景 */
  backdrop-filter: blur(20px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(20px); /* Safari兼容性 */
  border-radius: 16px; /* 圆角 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 半透明边框 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* 阴影 */
  overflow: hidden; /* 确保圆角效果 */
  display: flex;
  flex-direction: column; /* 垂直布局 */
}

/* 联系页面头部 */
.contact-header {
  padding: 1.5rem; /* 内边距 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.15); /* 底部分割线 */
  background: rgba(255, 255, 255, 0.05); /* 轻微背景色差 */
  position: relative; /* 相对定位 */
}


.back-icon {
  margin-right: 0.5rem; /* 右边距 */
  font-size: 1rem; /* 图标大小 */
}

.contact-title {
  font-size: 1.8rem; /* 标题字体大小 */
  font-weight: 700; /* 粗体 */
  color: rgba(255, 255, 255, 0.9); /* 白色文字 */
  margin: 0 0 0.5rem 0; /* 下边距 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.contact-subtitle {
  font-size: 1rem; /* 副标题字体大小 */
  color: rgba(255, 255, 255, 0.7); /* 半透明白色文字 */
  margin: 0; /* 清除边距 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

/* 联系方式列表 */
.contact-list {
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto; /* 垂直滚动 */
  padding: 1.5rem; /* 内边距 */

  /* 自定义滚动条样式 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent; /* Firefox */
}

/* Webkit浏览器滚动条样式 */
.contact-list::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
}

.contact-list::-webkit-scrollbar-track {
  background: transparent; /* 滚动条轨道背景 */
}

.contact-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3); /* 滚动条颜色 */
  border-radius: 3px; /* 滚动条圆角 */
}

.contact-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5); /* 滚动条悬停颜色 */
}

/* 联系方式项 */
.contact-item {
  display: flex;
  align-items: flex-start; /* 顶部对齐 */
  background: rgba(255, 255, 255, 0.08); /* 半透明背景 */
  border-radius: 12px; /* 圆角 */
  padding: 1.5rem; /* 内边距 */
  margin-bottom: 1.5rem; /* 下边距 */
  border: 1px solid rgba(255, 255, 255, 0.1); /* 边框 */
  transition: all 0.3s ease; /* 过渡效果 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px); /* Safari兼容性 */
}

.contact-item:hover {
  background: rgba(255, 255, 255, 0.12); /* 悬停背景 */
  border-color: rgba(255, 255, 255, 0.2); /* 悬停边框 */
  transform: translateY(-2px); /* 轻微上移 */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* 悬停阴影 */
}

/* 联系方式图标 */
.contact-icon {
  margin-right: 1.5rem; /* 右边距 */
  flex-shrink: 0; /* 不缩放 */
}

.icon-wrapper {
  width: 60px; /* 图标容器宽度 */
  height: 60px; /* 图标容器高度 */
  border-radius: 50%; /* 圆形 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  font-size: 1.5rem; /* 图标大小 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px); /* Safari兼容性 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
}

.icon-wrapper.qq-group {
  background: rgba(52, 152, 219, 0.2); /* QQ群蓝色 */
}

.icon-wrapper.qq {
  background: rgba(46, 204, 113, 0.2); /* QQ绿色 */
}

.icon-wrapper.email {
  background: rgba(231, 76, 60, 0.2); /* 邮箱红色 */
}

.icon-wrapper.time {
  background: rgba(155, 89, 182, 0.2); /* 时间紫色 */
}

/* 联系方式信息 */
.contact-info {
  flex: 1; /* 占据剩余空间 */
}

.contact-name {
  font-size: 1.2rem; /* 字体大小 */
  font-weight: 600; /* 粗体 */
  color: rgba(255, 255, 255, 0.9); /* 文字颜色 */
  margin: 0 0 0.5rem 0; /* 下边距 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.contact-description {
  font-size: 0.9rem; /* 字体大小 */
  color: rgba(255, 255, 255, 0.7); /* 文字颜色 */
  margin: 0 0 1rem 0; /* 下边距 */
  line-height: 1.5; /* 行高 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.contact-value {
  display: flex;
  align-items: center; /* 垂直居中 */
  gap: 1rem; /* 间距 */
}

.value-text {
  font-size: 1rem; /* 字体大小 */
  font-weight: 500; /* 中等粗细 */
  color: rgba(255, 255, 255, 0.9); /* 文字颜色 */
  background: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  padding: 0.5rem 1rem; /* 内边距 */
  border-radius: 8px; /* 圆角 */
  border: 1px solid rgba(255, 255, 255, 0.1); /* 边框 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px); /* Safari兼容性 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
  flex: 1; /* 占据剩余空间 */
}

.copy-btn {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15); /* 半透明背景 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 边框 */
  border-radius: 8px; /* 圆角 */
  padding: 0.5rem 1rem; /* 内边距 */
  color: rgba(255, 255, 255, 0.8); /* 文字颜色 */
  font-size: 0.85rem; /* 字体大小 */
  cursor: pointer; /* 鼠标指针 */
  transition: all 0.3s ease; /* 过渡效果 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px); /* Safari兼容性 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.25); /* 悬停背景 */
  border-color: rgba(255, 255, 255, 0.5); /* 悬停边框 */
  color: rgba(255, 255, 255, 1); /* 悬停文字 */
  transform: translateY(-1px); /* 轻微上移 */
}

.copy-icon {
  margin-right: 0.3rem; /* 右边距 */
  font-size: 0.9rem; /* 图标大小 */
}

/* 联系提示 */
.contact-tips {
  padding: 1.5rem; /* 内边距 */
  border-top: 1px solid rgba(255, 255, 255, 0.15); /* 顶部分割线 */
  background: rgba(255, 255, 255, 0.05); /* 轻微背景色差 */
}

.tips-title {
  font-size: 1.1rem; /* 字体大小 */
  font-weight: 600; /* 粗体 */
  color: rgba(255, 255, 255, 0.9); /* 文字颜色 */
  margin: 0 0 1rem 0; /* 下边距 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.tips-list {
  list-style: none; /* 移除列表样式 */
  margin: 0;
  padding: 0;
}

.tip-item {
  display: flex;
  align-items: flex-start; /* 顶部对齐 */
  margin-bottom: 0.75rem; /* 下边距 */
  font-size: 0.9rem; /* 字体大小 */
  color: rgba(255, 255, 255, 0.7); /* 文字颜色 */
  line-height: 1.5; /* 行高 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.tip-icon {
  margin-right: 0.75rem; /* 右边距 */
  font-size: 1rem; /* 图标大小 */
  flex-shrink: 0; /* 不缩放 */
  margin-top: 0.1rem; /* 微调位置 */
}

/* 复制成功提示 */
.copy-tip {
  position: fixed; /* 固定定位 */
  top: 50%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%) scale(0.8); /* 居中并缩放 */
  background: rgba(76, 175, 80, 0.9); /* 绿色背景 */
  color: white; /* 白色文字 */
  padding: 1rem 2rem; /* 内边距 */
  border-radius: 12px; /* 圆角 */
  display: flex;
  align-items: center; /* 垂直居中 */
  gap: 0.5rem; /* 间距 */
  font-size: 1rem; /* 字体大小 */
  font-weight: 500; /* 中等粗细 */
  backdrop-filter: blur(20px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(20px); /* Safari兼容性 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); /* 阴影 */
  z-index: 2000; /* 最高层级 */
  opacity: 0; /* 初始透明 */
  visibility: hidden; /* 初始隐藏 */
  transition: all 0.3s ease; /* 过渡效果 */
}

.copy-tip.show {
  opacity: 1; /* 显示时不透明 */
  visibility: visible; /* 显示时可见 */
  transform: translate(-50%, -50%) scale(1); /* 显示时正常大小 */
}

.tip-icon {
  font-size: 1.2rem; /* 图标大小 */
}

.tip-text {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

/* 帖子头部 */
.posts-header {
  padding: 1.5rem 1.5rem 1rem; /* 内边距 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.15); /* 底部分割线 */
  background: rgba(255, 255, 255, 0.05); /* 轻微背景色差 */
}

.posts-title {
  font-size: 1.5rem; /* 标题字体大小 */
  font-weight: 700; /* 粗体 */
  color: rgba(255, 255, 255, 0.9); /* 白色文字 */
  margin: 0 0 1rem 0; /* 下边距 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

/* 过滤器按钮组 */
.posts-filter {
  display: flex;
  gap: 0.5rem; /* 按钮间距 */
}

.filter-btn {
  padding: 0.5rem 1rem; /* 内边距 */
  background: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
  border-radius: 20px; /* 圆角 */
  color: rgba(255, 255, 255, 0.8); /* 文字颜色 */
  font-size: 0.85rem; /* 字体大小 */
  cursor: pointer; /* 鼠标指针 */
  transition: all 0.3s ease; /* 过渡效果 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px); /* Safari兼容性 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.2); /* 悬停背景 */
  border-color: rgba(255, 255, 255, 0.4); /* 悬停边框 */
  color: rgba(255, 255, 255, 1); /* 悬停文字 */
  transform: translateY(-1px); /* 轻微上移 */
}

.filter-btn.active {
  background: rgba(255, 255, 255, 0.25); /* 激活状态背景 */
  border-color: rgba(255, 255, 255, 0.5); /* 激活状态边框 */
  color: rgba(255, 255, 255, 1); /* 激活状态文字 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* 激活状态阴影 */
}

/* 帖子列表 - 支持独立滚动 */
.posts-list {
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto; /* 垂直滚动 */
  padding: 1rem; /* 内边距 */

  /* 自定义滚动条样式 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent; /* Firefox */
}

/* Webkit浏览器滚动条样式 */
.posts-list::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
}

.posts-list::-webkit-scrollbar-track {
  background: transparent; /* 滚动条轨道背景 */
}

.posts-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3); /* 滚动条颜色 */
  border-radius: 3px; /* 滚动条圆角 */
}

.posts-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5); /* 滚动条悬停颜色 */
}

/* 帖子项 */
.post-item {
  background: rgba(255, 255, 255, 0.08); /* 半透明背景 */
  border-radius: 12px; /* 圆角 */
  padding: 1.25rem; /* 内边距 */
  margin-bottom: 1rem; /* 下边距 */
  border: 1px solid rgba(255, 255, 255, 0.1); /* 边框 */
  cursor: pointer; /* 鼠标指针 */
  transition: all 0.3s ease; /* 过渡效果 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px); /* Safari兼容性 */
}

.post-item:hover {
  background: rgba(255, 255, 255, 0.12); /* 悬停背景 */
  border-color: rgba(255, 255, 255, 0.2); /* 悬停边框 */
  transform: translateY(-2px); /* 轻微上移 */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* 悬停阴影 */
}

/* 帖子头部 */
.post-header {
  display: flex;
  justify-content: space-between; /* 两端对齐 */
  align-items: center; /* 垂直居中 */
  margin-bottom: 1rem; /* 下边距 */
}

.post-author {
  display: flex;
  align-items: center; /* 垂直居中 */
}

.author-avatar {
  width: 36px; /* 头像大小 */
  height: 36px;
  border-radius: 50%; /* 圆形 */
  margin-right: 0.75rem; /* 右边距 */
  border: 2px solid rgba(255, 255, 255, 0.2); /* 边框 */
  object-fit: cover; /* 保持比例 */
}

.author-info {
  display: flex;
  flex-direction: column; /* 垂直布局 */
}

.author-name {
  font-size: 0.9rem; /* 字体大小 */
  font-weight: 600; /* 粗体 */
  color: rgba(255, 255, 255, 0.9); /* 文字颜色 */
  margin-bottom: 0.2rem; /* 下边距 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.post-time {
  font-size: 0.75rem; /* 字体大小 */
  color: rgba(255, 255, 255, 0.6); /* 文字颜色 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

/* 帖子操作按钮 */
.post-actions {
  display: flex;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
  border-radius: 20px; /* 圆角 */
  padding: 0.4rem 0.8rem; /* 内边距 */
  cursor: pointer; /* 鼠标指针 */
  transition: all 0.3s ease; /* 过渡效果 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px); /* Safari兼容性 */
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2); /* 悬停背景 */
  transform: scale(1.05); /* 轻微放大 */
}

.like-icon {
  font-size: 0.9rem; /* 图标大小 */
  margin-right: 0.3rem; /* 右边距 */
  transition: all 0.3s ease; /* 过渡效果 */
}

.like-icon.liked {
  transform: scale(1.2); /* 已点赞时放大 */
  filter: brightness(1.2); /* 增加亮度 */
}

.action-count {
  font-size: 0.8rem; /* 字体大小 */
  color: rgba(255, 255, 255, 0.8); /* 文字颜色 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

/* 帖子内容 */
.post-content {
  margin-bottom: 1rem; /* 下边距 */
}

.post-text {
  font-size: 0.95rem; /* 字体大小 */
  line-height: 1.6; /* 行高 */
  color: rgba(255, 255, 255, 0.85); /* 文字颜色 */
  margin-bottom: 0.75rem; /* 下边距 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.post-image {
  border-radius: 8px; /* 圆角 */
  overflow: hidden; /* 确保圆角效果 */
  margin-top: 0.75rem; /* 上边距 */
}

.content-image {
  width: 100%; /* 占满容器 */
  height: auto; /* 自动高度 */
  object-fit: cover; /* 保持比例 */
  transition: transform 0.3s ease; /* 过渡效果 */
}

.content-image:hover {
  transform: scale(1.02); /* 悬停时轻微放大 */
}

/* 帖子底部 */
.post-footer {
  display: flex;
  justify-content: space-between; /* 两端对齐 */
  align-items: center; /* 垂直居中 */
  padding-top: 0.75rem; /* 上内边距 */
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* 顶部分割线 */
}

.post-stats {
  display: flex;
  gap: 1rem; /* 统计项间距 */
}

.stat-item {
  display: flex;
  align-items: center; /* 垂直居中 */
  font-size: 0.8rem; /* 字体大小 */
  color: rgba(255, 255, 255, 0.7); /* 文字颜色 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.stat-icon {
  margin-right: 0.3rem; /* 右边距 */
  font-size: 0.9rem; /* 图标大小 */
}

.stat-count {
  font-weight: 500; /* 字体粗细 */
}

/* 帖子标签 */
.post-tags {
  display: flex;
  gap: 0.5rem; /* 标签间距 */
  flex-wrap: wrap; /* 换行 */
}

.post-tag {
  background: rgba(255, 255, 255, 0.15); /* 半透明背景 */
  color: rgba(255, 255, 255, 0.8); /* 文字颜色 */
  padding: 0.2rem 0.6rem; /* 内边距 */
  border-radius: 12px; /* 圆角 */
  font-size: 0.75rem; /* 字体大小 */
  border: 1px solid rgba(255, 255, 255, 0.1); /* 边框 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px); /* Safari兼容性 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
  transition: all 0.3s ease; /* 过渡效果 */
}

.post-tag:hover {
  background: rgba(255, 255, 255, 0.2); /* 悬停背景 */
  border-color: rgba(255, 255, 255, 0.2); /* 悬停边框 */
  transform: translateY(-1px); /* 轻微上移 */
}

/* 加载更多 */
.load-more {
  display: flex;
  justify-content: center; /* 居中对齐 */
  padding: 1rem; /* 内边距 */
}

.load-more-btn {
  background: rgba(255, 255, 255, 0.15); /* 半透明背景 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 边框 */
  border-radius: 25px; /* 圆角 */
  padding: 0.75rem 2rem; /* 内边距 */
  color: rgba(255, 255, 255, 0.9); /* 文字颜色 */
  font-size: 0.9rem; /* 字体大小 */
  cursor: pointer; /* 鼠标指针 */
  transition: all 0.3s ease; /* 过渡效果 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px); /* Safari兼容性 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}

.load-more-btn:hover {
  background: rgba(255, 255, 255, 0.25); /* 悬停背景 */
  border-color: rgba(255, 255, 255, 0.5); /* 悬停边框 */
  transform: translateY(-2px); /* 轻微上移 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 悬停阴影 */
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
  /* 移动端导航栏调整 */
  .glass-navbar {
    height: 60px; /* 移动端较小高度 */
  }

  .navbar-content {
    padding: 0 1rem; /* 减少内边距 */
  }

  .navbar-logo {
    left: 1rem; /* 移动端减少左边距 */
  }

  .navbar-right {
    right: 1rem; /* 移动端减少右边距 */
  }

  .logo {
    font-size: 1.2rem; /* 较小字体 */
  }

  /* 移动端隐藏中间菜单 */
  .navbar-center {
    display: none;
  }

  /* 移动端头像调整 */
  .user-avatar {
    width: 35px; /* 较小头像 */
    height: 35px;
  }

  /* 移动端下拉菜单调整 */
  .dropdown-menu {
    width: 180px; /* 移动端更小宽度 */
    right: -5px; /* 微调位置 */
  }

  /* 移动端主要内容调整 */
  .main-content {
    top: 60px; /* 移动端导航栏高度 */
    height: calc(100% - 60px);
    padding: 1rem; /* 减少外边距 */
  }

  .posts-container,
  .contact-container {
    max-width: 100%; /* 移动端占满宽度 */
  }

  .posts-header,
  .contact-header {
    padding: 1rem; /* 减少内边距 */
  }

  .posts-title,
  .contact-title {
    font-size: 1.3rem; /* 较小标题 */
  }

  .posts-filter {
    flex-wrap: wrap; /* 允许换行 */
  }

  .filter-btn {
    font-size: 0.8rem; /* 较小字体 */
    padding: 0.4rem 0.8rem; /* 较小内边距 */
  }

  .post-item,
  .contact-item {
    padding: 1rem; /* 减少内边距 */
  }

  .author-avatar {
    width: 32px; /* 较小头像 */
    height: 32px;
  }

  .post-footer {
    flex-direction: column; /* 垂直布局 */
    align-items: flex-start; /* 左对齐 */
    gap: 0.5rem; /* 间距 */
  }

  .contact-item {
    flex-direction: column; /* 移动端垂直布局 */
    text-align: center; /* 居中对齐 */
  }

  .contact-icon {
    margin-right: 0; /* 移除右边距 */
    margin-bottom: 1rem; /* 添加下边距 */
  }

  .contact-value {
    flex-direction: column; /* 垂直布局 */
    gap: 0.5rem; /* 减少间距 */
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .main-content {
    padding: 0.5rem; /* 更小外边距 */
  }

  .posts-header,
  .contact-header {
    padding: 0.75rem; /* 更小内边距 */
  }

  .posts-title,
  .contact-title {
    font-size: 1.2rem; /* 更小标题 */
  }

  .post-item,
  .contact-item {
    padding: 0.75rem; /* 更小内边距 */
  }

  .post-text {
    font-size: 0.9rem; /* 较小字体 */
  }

  .contact-list {
    padding: 1rem; /* 减少内边距 */
  }

  .icon-wrapper {
    width: 50px; /* 较小图标容器 */
    height: 50px;
    font-size: 1.2rem; /* 较小图标 */
  }
}

/* 动画效果 */
.glass-navbar {
  animation: slideDown 0.6s ease-out; /* 导航栏下滑动画 */
}

.posts-container,
.contact-container {
  animation: fadeInUp 0.8s ease-out 0.2s both; /* 内容区域淡入上移动画 */
}

@keyframes slideDown {
  from {
    transform: translateY(-100%); /* 从上方滑入 */
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0; /* 起始透明 */
    transform: translateY(30px); /* 起始位置下移 */
  }
  to {
    opacity: 1; /* 结束不透明 */
    transform: translateY(0); /* 结束位置正常 */
  }
}

/* 签到菜单项特殊样式 */
.dropdown-item.checked-in {
  background: rgba(76, 175, 80, 0.1); /* 绿色半透明背景 */
  color: rgba(76, 175, 80, 0.9); /* 绿色文字 */
  cursor: default; /* 已签到时不显示手型指针 */
}

.dropdown-item.checked-in:hover {
  background: rgba(76, 175, 80, 0.15); /* 悬停时稍微深一点的绿色 */
  color: rgba(76, 175, 80, 1);
  transform: none; /* 已签到时不移动 */
}

/* 签到积分徽章 */
.check-in-badge {
  margin-left: auto; /* 推到右侧 */
  background: rgba(255, 193, 7, 0.2); /* 金色半透明背景 */
  color: rgba(255, 193, 7, 0.9); /* 金色文字 */
  padding: 0.2rem 0.5rem; /* 内边距 */
  border-radius: 10px; /* 圆角 */
  font-size: 0.7rem; /* 较小字体 */
  font-weight: 600; /* 粗体 */
  border: 1px solid rgba(255, 193, 7, 0.3); /* 金色边框 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px); /* Safari兼容性 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 文字阴影 */
}
</style>

<!-- 全局样式重置 - 确保没有默认边距和滚动条 -->
<style>
/* 重置全局样式，消除默认边距和滚动条 */
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
  overflow: hidden !important; /* 强制隐藏滚动条 */
}

/* 确保Vue应用根元素也没有边距 */
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>