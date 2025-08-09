<template>
  <div class="carousel-container" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <!-- 轮播图主容器 -->
    <div class="carousel" ref="carouselRef">
      <!-- 使用Vue的Transition组件实现动画效果 -->
      <transition :name="transitionName">
        <!-- 当前显示的图片 -->
        <div class="carousel-item" :key="currentIndex">
          <img :src="images[currentIndex].url" :alt="images[currentIndex].alt" />
        </div>
      </transition>
    </div>

    <!-- 粒子动画画布 -->
    <canvas ref="particleCanvas" class="particle-canvas" v-show="showParticles"></canvas>

    <!-- 鼠标跟随粒子画布 -->
    <canvas ref="mouseParticleCanvas" class="mouse-particle-canvas" v-show="showMouseParticles"></canvas>

    <!-- 按钮容器 -->
    <div class="buttons-container" v-show="!showParticles && !showForm">
      <div class="buttons-group">
        <button class="action-button left-button" @click="handleLoginClick" ref="loginButton">玩家登录</button>
        <button class="action-button right-button" ref="aboutButton">了解我们</button>
      </div>
    </div>

    <!-- 登录表单 -->
    <transition :name="formTransition">
      <div class="form-container" v-if="showForm && formType === 'login'" ref="loginFormContainer">
        <div class="form login-form">
          <button class="back-button" @click="handleBackClick">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2>玩家登录</h2>
          <div class="form-group">
            <label for="username">用户名</label>
            <input type="text" id="username" placeholder="请输入用户名" v-model="loginForm.username"/>
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input type="password" id="password" placeholder="请输入密码" v-model="loginForm.password"/>
          </div>
          <div class="form-actions">
            <button class="submit-button" @click="handleLoginSubmit">登录</button>
            <button class="cancel-button" @click="handleBackClick">取消</button>
          </div>
          <div class="form-links">
            <a href="#" @click.prevent="handleForgotPassword">忘记密码?</a>
            <a href="#" @click.prevent="handleRegisterClick">注册账号</a>
          </div>
        </div>
      </div>
    </transition>

    <!-- 注册表单 -->
    <transition :name="formTransition">
      <div class="form-container" v-if="showForm && formType === 'register'" ref="registerFormContainer">
        <div class="form register-form">
          <button class="back-button" @click="handleBackClick">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2>注册账号</h2>
          <div class="form-group">
            <label for="reg-username">用户名</label>
            <input
                type="text"
                id="reg-username"
                placeholder="请输入用户名"
                v-model="registerForm.username"
                @blur="validateField('username')"
            />
          </div>
          <div class="form-group">
            <label for="reg-email">电子邮箱</label>
            <input
                type="email"
                id="reg-email"
                placeholder="请输入电子邮箱"
                v-model="registerForm.email"
                @blur="validateField('email')"
            />
          </div>
          <div class="form-group">
            <label for="reg-password">密码</label>
            <input
                type="password"
                id="reg-password"
                placeholder="请输入密码"
                v-model="registerForm.password"
                @blur="validateField('password')"
            />
          </div>
          <div class="form-group">
            <label for="reg-confirm-password">确认密码</label>
            <input
                type="password"
                id="reg-confirm-password"
                placeholder="请再次输入密码"
                v-model="registerForm.confirmPassword"
                @blur="validateField('confirmPassword')"
            />
          </div>
          <div class="form-actions">
            <button class="submit-button" @click="handleRegisterSubmit">注册</button>
            <button class="cancel-button" @click="handleBackClick">取消</button>
          </div>
          <div class="form-links">
            <a href="#" @click.prevent="handleReturnToLogin">返回登录</a>
          </div>
        </div>
      </div>
    </transition>

    <!-- 隐藏的表单用于测量尺寸 -->
    <div class="hidden-forms">
      <div class="form login-form" ref="hiddenLoginForm" style="visibility: hidden; position: absolute; right: -9999px;">
        <h2>玩家登录</h2>
        <div class="form-group">
          <label>用户名</label>
          <input type="text" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" />
        </div>
        <div class="form-actions">
          <button>登录</button>
          <button>取消</button>
        </div>
        <div class="form-links">
          <a href="#">忘记密码?</a>
          <a href="#">注册账号</a>
        </div>
      </div>
      <div class="form register-form" ref="hiddenRegisterForm" style="visibility: hidden; position: absolute; right: -9999px;">
        <h2>注册账号</h2>
        <div class="form-group">
          <label>用户名</label>
          <input type="text" />
        </div>
        <div class="form-group">
          <label>电子邮箱</label>
          <input type="email" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" />
        </div>
        <div class="form-group">
          <label>确认密码</label>
          <input type="password" />
        </div>
        <div class="form-actions">
          <button>注册</button>
          <button>取消</button>
        </div>
        <div class="form-links">
          <a href="#">返回登录</a>
        </div>
      </div>
    </div>

    <!-- 通知系统 -->
    <transition-group name="notification" tag="div" class="notifications-container">
      <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="notification.type"
      >
        <div class="notification-icon" v-if="notification.type === 'error'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <div class="notification-icon" v-else-if="notification.type === 'success'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="16 12 12 16 8 12"></polyline>
            <line x1="12" y1="8" x2="12" y2="16"></line>
          </svg>
        </div>
        <div class="notification-icon" v-else-if="notification.type === 'warning'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="notification-icon" v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <div class="notification-content">
          <div class="notification-message">{{ notification.message }}</div>
        </div>
        <button class="notification-close" @click="removeNotification(notification.id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </transition-group>

    <!-- 时间显示容器 -->
    <div class="time-container">
      <!-- 时间显示 -->
      <div class="time-display">
        <div class="current-time" :data-content="currentTime">{{ currentTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, reactive } from 'vue';
import { useRouter } from 'vue-router'
import pic1 from '../assets/picture/picture1.jpg'
import pic2 from '../assets/picture/picture2.jpg'
import pic3 from '../assets/picture/picture3.jpg'
import pic4 from '../assets/picture/picture4.jpg'
import axios from "axios";

const router = useRouter()
// 定义图片数据
const images = [
  { url: pic1, alt: '图片1' },
  { url: pic2, alt: '图片2' },
  { url: pic3, alt: '图片3' },
  { url: pic4, alt: '图片4' },
];

// 当前显示的图片索引
const currentIndex = ref(0);
// 轮播容器引用
const carouselRef = ref(null);
// 动画方向名称
const transitionName = ref('slide-left');
// 自动轮播定时器
let autoplayTimer = null;

// 当前时间
const currentTime = ref('');
let clockTimer = null;

// 粒子动画相关
const particleCanvas = ref(null);
let particleCtx = null;
const showParticles = ref(false);
let particles = [];
let animationFrameId = null;
let particleAnimationType = ''; // 'toForm', 'toLogin', 'toRegister'

// 鼠标跟随粒子相关
const mouseParticleCanvas = ref(null);
let mouseParticleCtx = null;
const showMouseParticles = ref(false);
let mouseParticles = [];
let mouseAnimationFrameId = null;
let mousePosition = { x: 0, y: 0 };
let lastMousePosition = { x: 0, y: 0 };
let mouseMovementTimer = null;
let isMouseMoving = false;

// 表单显示状态
const showForm = ref(false);
// 表单类型：'login' 或 'register'
const formType = ref('login');
// 表单动画名称
const formTransition = ref('');

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
});

// 按钮引用
const loginButton = ref(null);
const aboutButton = ref(null);
const loginFormContainer = ref(null);
const registerFormContainer = ref(null);
const hiddenLoginForm = ref(null);
const hiddenRegisterForm = ref(null);

// 存储按钮位置信息
let buttonPositions = [];
// 存储表单位置信息
let formPosition = null;
// 存储目标表单尺寸
let targetFormDimensions = null;

// 通知系统
const notifications = ref([]);
let notificationIdCounter = 0;

// 显示通知的函数
const showNotification = (message, type = 'info', duration = 5000) => {
  const id = notificationIdCounter++;

  // 添加通知
  notifications.value.push({
    id,
    message,
    type,
    timestamp: Date.now()
  });

  // 设置自动移除
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }

  return id;
};

// 移除通知的函数
const removeNotification = (id) => {
  const index = notifications.value.findIndex(notification => notification.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
  }
};

// 鼠标跟随粒子类
class MouseParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.size = Math.random() * 3 + 1;
    this.color = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
    this.gravity = 0.1;
    this.friction = 0.98;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.life -= this.decay;
    this.size = Math.max(0, this.size * 0.99);
  }

  draw(ctx) {
    if (this.life <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // 添加发光效果
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  isDead() {
    return this.life <= 0 || this.size <= 0.1;
  }
}

// 粒子类
class Particle {
  constructor(x, y, targetX, targetY, color, size) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    this.size = size;
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.95;
    this.ease = 0.1;
    this.distanceToTarget = 100;
    this.stage = 'explode'; // 'explode' or 'reform'
    this.explosionSpeed = Math.random() * 6 + 2;
    this.explosionAngle = Math.random() * Math.PI * 2;
    this.life = 1;
    this.decay = 0.01;
  }

  update() {
    if (this.stage === 'explode') {
      // 爆炸阶段 - 粒子向随机方向飞散
      this.vx = Math.cos(this.explosionAngle) * this.explosionSpeed;
      this.vy = Math.sin(this.explosionAngle) * this.explosionSpeed;
      this.x += this.vx;
      this.y += this.vy;
      this.explosionSpeed *= 0.95;

      // 当粒子减速到一定程度，切换到重组阶段
      if (this.explosionSpeed < 0.5) {
        this.stage = 'reform';
      }
    } else if (this.stage === 'reform') {
      // 重组阶段 - 粒子向目标位置移动
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      this.distanceToTarget = Math.sqrt(dx * dx + dy * dy);

      // 使用缓动效果移动到目标位置
      this.vx = dx * this.ease;
      this.vy = dy * this.ease;
      this.x += this.vx;
      this.y += this.vy;

      // 当接近目标位置时，减小粒子大小
      if (this.distanceToTarget < 10) {
        this.size = Math.max(1, this.size * 0.95);
      }
    }

    // 应用摩擦力
    this.vx *= this.friction;
    this.vy *= this.friction;

    // 粒子生命周期（用于淡出效果）
    if (this.stage === 'explode') {
      this.life -= this.decay * 0.2; // 爆炸阶段缓慢衰减
    } else if (this.distanceToTarget < 5) {
      this.life -= this.decay * 2; // 接近目标位置时快速衰减
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

// 处理鼠标移动
const handleMouseMove = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  mousePosition.x = event.clientX - rect.left;
  mousePosition.y = event.clientY - rect.top;

  // 检查鼠标是否真的在移动
  const distance = Math.sqrt(
      Math.pow(mousePosition.x - lastMousePosition.x, 2) +
      Math.pow(mousePosition.y - lastMousePosition.y, 2)
  );

  if (distance > 2) { // 只有移动距离大于2像素才算移动
    if (!isMouseMoving) {
      isMouseMoving = true;
      startMouseParticles();
    }

    // 创建新的鼠标跟随粒子
    if (showMouseParticles.value) {
      for (let i = 0; i < 3; i++) {
        mouseParticles.push(new MouseParticle(
            mousePosition.x + (Math.random() - 0.5) * 10,
            mousePosition.y + (Math.random() - 0.5) * 10
        ));
      }
    }

    lastMousePosition.x = mousePosition.x;
    lastMousePosition.y = mousePosition.y;

    // 重置停止计时器
    clearTimeout(mouseMovementTimer);
    mouseMovementTimer = setTimeout(() => {
      isMouseMoving = false;
      stopMouseParticles();
    }, 150); // 150ms后停止粒子
  }
};

// 处理鼠标离开
const handleMouseLeave = () => {
  isMouseMoving = false;
  clearTimeout(mouseMovementTimer);
  stopMouseParticles();
};

// 开始鼠标粒子动画
const startMouseParticles = () => {
  if (!showMouseParticles.value) {
    showMouseParticles.value = true;

    nextTick(() => {
      if (mouseParticleCanvas.value) {
        mouseParticleCtx = mouseParticleCanvas.value.getContext('2d');
        mouseParticleCanvas.value.width = window.innerWidth;
        mouseParticleCanvas.value.height = window.innerHeight;
        animateMouseParticles();
      }
    });
  }
};

// 停止鼠标粒子动画
const stopMouseParticles = () => {
  // 不立即隐藏画布，让现有粒子自然消失
  // showMouseParticles.value = false;

  // 等待所有粒子消失后再隐藏画布
  setTimeout(() => {
    if (!isMouseMoving && mouseParticles.length === 0) {
      showMouseParticles.value = false;
      if (mouseAnimationFrameId) {
        cancelAnimationFrame(mouseAnimationFrameId);
        mouseAnimationFrameId = null;
      }
    }
  }, 2000);
};

// 动画鼠标跟随粒子
const animateMouseParticles = () => {
  if (!mouseParticleCtx || !showMouseParticles.value) return;

  // 清除画布
  mouseParticleCtx.clearRect(0, 0, mouseParticleCanvas.value.width, mouseParticleCanvas.value.height);

  // 更新并绘制所有鼠标粒子
  for (let i = mouseParticles.length - 1; i >= 0; i--) {
    const particle = mouseParticles[i];
    particle.update();
    particle.draw(mouseParticleCtx);

    // 移除死亡的粒子
    if (particle.isDead()) {
      mouseParticles.splice(i, 1);
    }
  }

  // 如果没有粒子且鼠标不在移动，停止动画
  if (mouseParticles.length === 0 && !isMouseMoving) {
    showMouseParticles.value = false;
    mouseAnimationFrameId = null;
    return;
  }

  // 继续下一帧动画
  mouseAnimationFrameId = requestAnimationFrame(animateMouseParticles);
};

// 更新当前时间
const updateTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;
};

// 切换到下一张图片
const nextImage = () => {
  // 设置动画方向为向左滑动（当前图片向左后方移动，下一张从右上方进入）
  transitionName.value = 'slide-left';
  // 更新索引，如果到达最后一张，则回到第一张
  currentIndex.value = (currentIndex.value + 1) % images.length;
};

// 启动自动轮播
const startAutoplay = () => {
  // 每3秒自动切换到下一张图片
  autoplayTimer = setInterval(() => {
    nextImage();
  }, 3000);
};

// 停止自动轮播
const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
};

// 验证表单字段
const validateField = async (field) => {
  let isValid = true;
  let message = '';

  switch (field) {
    case 'username':
      if (!registerForm.username) {
        isValid = false;
        message = '用户名不能为空';
      } else {
        try {
          const response = await axios.get('/api/register/checkUsername', {
            params: {
              username: registerForm.username
            }
          });
          console.log(response)
          if (response.data.code === 0) {
            isValid = false;
            message = response.data.msg;
          }
        } catch (error) {
          console.error('Error checking username:', error);
          isValid = false;
          message = '验证失败，网络异常';
        }
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!registerForm.email) {
        isValid = false;
        message = '电子邮箱不能为空';
      } else if (!emailRegex.test(registerForm.email)) {
        isValid = false;
        message = '请输入有效的电子邮箱地址';
      } else {
        try {
          const response = await axios.get('/api/register/checkEmail', {
            params: {
              email: registerForm.email
            }
          });
          if (response.data.code === 0) {
            isValid = false;
            message = response.data.msg;
          }
        } catch (error) {
          console.error('Error checking email:', error);
          isValid = false;
          message = '验证失败，网络异常';
        }
      }
      break;
    case 'password':
      if (!registerForm.password) {
        isValid = false;
        message = '密码不能为空';
      } else if (registerForm.password.length < 6) {
        isValid = false;
        message = '密码长度不能少于6个字符';
      }
      break;
    case 'confirmPassword':
      if (!registerForm.confirmPassword) {
        isValid = false;
        message = '请确认密码';
      } else if (registerForm.password !== registerForm.confirmPassword) {
        isValid = false;
        message = '两次输入的密码不一致';
      }
      break;
  }
  // 如果验证失败，显示通知
  if (!isValid) {
    showNotification(message, 'error');
  }
  return isValid;
};

// 验证整个表单
const validateForm = async () => {
  if (!await validateField('username'))
    return false;
  if (!await validateField('email'))
    return false;
  if (!await validateField('password'))
    return false;
  if (!await validateField('confirmPassword'))
    return false;
  try {
    const response = await axios.post('/api/register',  registerForm);
    if (response.data.code === 1)
      return true
    showNotification(response.data.msg, 'error');
    return false;
  } catch (error) {
    console.error('Error registering:', error);
    showNotification('注册失败，网络异常', 'error');
    return false;
  }
};

// 处理注册提交
const handleRegisterSubmit = async () => {
  if (await validateForm()) {
    showNotification('注册成功！请登录您的账号', 'success');

    // 延迟后返回登录页面
    setTimeout(() => {
      handleReturnToLogin();
    }, 2000);
  }
};

// 处理登录提交
const handleLoginSubmit = async () => {
  try {
    const response = await axios.post('/api/login',  loginForm);
    console.log(response)
    if (response.data.code === 1){
      showNotification('登录成功！', 'success');
      localStorage.setItem("elysiaBlogId", response.data.data.id)
      /**
      localStorage.setItem("elysiaBlogToken", response.data.data.token)
      localStorage.setItem("elysiaBlogTokenName", response.data.data.tokenName)
      **/
      await router.push('/main')
      console.log("跳转命令已发出")
      return
    }
    showNotification(response.data.msg, 'error');
  } catch (error) {
    console.error('Error login:', error);
    showNotification('登录失败，网络异常', 'error');
    return false;
  }
};

// 捕获按钮位置
const captureButtonPositions = () => {
  buttonPositions = [];

  if (loginButton.value && aboutButton.value) {
    const buttons = [loginButton.value, aboutButton.value];

    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      buttonPositions.push({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2
      });
    });

    return true;
  }

  return false;
};

// 捕获表单位置
const captureFormPosition = (formRef) => {
  if (!formRef) return false;

  const formElement = formRef.querySelector('.form');
  if (!formElement) return false;

  const rect = formElement.getBoundingClientRect();
  formPosition = {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2
  };

  return true;
};

// 获取目标表单尺寸
const getTargetFormDimensions = (targetType) => {
  let targetFormRef = targetType === 'login' ? hiddenLoginForm.value : hiddenRegisterForm.value;

  if (!targetFormRef) return null;

  const rect = targetFormRef.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height
  };
};

// 初始化粒子 - 从按钮到表单
const initParticlesToForm = () => {
  particles = [];

  // 确保有按钮位置信息
  if (buttonPositions.length === 0) {
    console.error('没有按钮位置信息');
    return;
  }

  // 获取画布上下文
  particleCtx = particleCanvas.value.getContext('2d');

  // 设置画布大小
  particleCanvas.value.width = window.innerWidth;
  particleCanvas.value.height = window.innerHeight;

  // 计算表单的位置和大小
  const formWidth = Math.min(500, window.innerWidth * 0.8);
  const formHeight = 400;
  const formLeft = window.innerWidth - formWidth - 40;
  const formTop = (window.innerHeight - formHeight) / 2;

  // 为每个按钮创建粒子
  buttonPositions.forEach(buttonPos => {
    // 为按钮创建粒子网格
    const particlesPerButton = 200;
    const particleSize = 3;
    const gridSize = Math.sqrt(particlesPerButton);

    for (let i = 0; i < particlesPerButton; i++) {
      // 计算粒子在按钮上的位置
      const gridX = i % gridSize;
      const gridY = Math.floor(i / gridSize);
      const offsetX = (gridX / gridSize) * buttonPos.width - buttonPos.width / 2;
      const offsetY = (gridY / gridSize) * buttonPos.height - buttonPos.height / 2;
      const x = buttonPos.centerX + offsetX;
      const y = buttonPos.centerY + offsetY;

      // 计算粒子的目标位置（表单区域内的随机位置）
      const targetX = formLeft + Math.random() * formWidth;
      const targetY = formTop + Math.random() * formHeight;

      // 创建粒子
      const color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
      particles.push(new Particle(x, y, targetX, targetY, color, particleSize));
    }
  });

  // 设置粒子动画类型
  particleAnimationType = 'toForm';

  // 开始动画
  animateParticles();
};

// 初始化粒子 - 从登录表单到注册表单
const initParticlesLoginToRegister = () => {
  particles = [];

  // 确保有表单位置信息
  if (!formPosition) {
    console.error('没有表单位置信息');
    return;
  }

  // 获取目标表单（注册表单）的尺寸
  targetFormDimensions = getTargetFormDimensions('register');
  if (!targetFormDimensions) {
    console.error('无法获取目标表单尺寸');
    return;
  }

  // 获取画布上下文
  particleCtx = particleCanvas.value.getContext('2d');

  // 设置画布大小
  particleCanvas.value.width = window.innerWidth;
  particleCanvas.value.height = window.innerHeight;

  // 计算目标表单的位置
  const formRight = 40; // 距离右侧的距离
  const formTop = (window.innerHeight - targetFormDimensions.height) / 2;
  const formLeft = window.innerWidth - targetFormDimensions.width - formRight;

  // 为表单创建粒子
  const particlesTotal = 400;
  const particleSize = 3;

  for (let i = 0; i < particlesTotal; i++) {
    // 计算粒子在当前登录表单上的位置
    const x = formPosition.left + Math.random() * formPosition.width;
    const y = formPosition.top + Math.random() * formPosition.height;

    // 计算粒子的目标位置（注册表单区域内的随机位置）
    const targetX = formLeft + Math.random() * targetFormDimensions.width;
    const targetY = formTop + Math.random() * targetFormDimensions.height;

    // 创建粒子
    const color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
    particles.push(new Particle(x, y, targetX, targetY, color, particleSize));
  }

  // 设置粒子动画类型
  particleAnimationType = 'toRegister';

  // 开始动画
  animateParticles();
};

// 初始化粒子 - 从注册表单到登录表单
const initParticlesRegisterToLogin = () => {
  particles = [];

  // 确保有表单位置信息
  if (!formPosition) {
    console.error('没有表单位置信息');
    return;
  }

  // 获取目标表单（登录表单）的尺寸
  targetFormDimensions = getTargetFormDimensions('login');
  if (!targetFormDimensions) {
    console.error('无法获取目标表单尺寸');
    return;
  }

  // 获取画布上下文
  particleCtx = particleCanvas.value.getContext('2d');

  // 设置画布大小
  particleCanvas.value.width = window.innerWidth;
  particleCanvas.value.height = window.innerHeight;

  // 计算目标表单的位置
  const formRight = 40; // 距离右侧的距离
  const formTop = (window.innerHeight - targetFormDimensions.height) / 2;
  const formLeft = window.innerWidth - targetFormDimensions.width - formRight;

  // 为表单创建粒子
  const particlesTotal = 400;
  const particleSize = 3;

  for (let i = 0; i < particlesTotal; i++) {
    // 计算粒子在当前注册表单上的位置
    const x = formPosition.left + Math.random() * formPosition.width;
    const y = formPosition.top + Math.random() * formPosition.height;

    // 计算粒子的目标位置（登录表单区域内的随机位置）
    const targetX = formLeft + Math.random() * targetFormDimensions.width;
    const targetY = formTop + Math.random() * targetFormDimensions.height;

    // 创建粒子
    const color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
    particles.push(new Particle(x, y, targetX, targetY, color, particleSize));
  }

  // 设置粒子动画类型
  particleAnimationType = 'toLogin';

  // 开始动画
  animateParticles();
};

// 动画粒子
const animateParticles = () => {
  if (!particleCtx) return;

  // 清除画布
  particleCtx.clearRect(0, 0, particleCanvas.value.width, particleCanvas.value.height);

  // 更新并绘制所有粒子
  let allParticlesReformed = true;
  let allParticlesDead = true;

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw(particleCtx);

    // 检查是否所有粒子都已重组
    if (particles[i].stage === 'explode' || particles[i].distanceToTarget > 5) {
      allParticlesReformed = false;
    }

    // 检查是否所有粒子都已消失
    if (particles[i].life > 0.1) {
      allParticlesDead = false;
    }
  }

  // 根据粒子动画类型处理完成后的操作
  if (allParticlesReformed) {
    if (particleAnimationType === 'toForm' && !showForm.value) {
      // 从按钮到表单的动画完成，显示登录表单（无动画）
      formTransition.value = '';
      formType.value = 'login';
      showForm.value = true;
    } else if (particleAnimationType === 'toRegister' && formType.value !== 'register') {
      // 从登录表单到注册表单的动画完成，显示注册表单（无动画）
      formTransition.value = '';
      formType.value = 'register';
      showForm.value = true;
    } else if (particleAnimationType === 'toLogin' && formType.value !== 'login') {
      // 从注册表单到登录表单的动画完成，显示登录表单（无动画）
      formTransition.value = '';
      formType.value = 'login';
      showForm.value = true;
    }
  }

  // 当所有粒子都已消失，停止动画
  if (allParticlesDead) {
    showParticles.value = false;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    return;
  }

  // 继续下一帧动画
  animationFrameId = requestAnimationFrame(animateParticles);
};

// 处理登录按钮点击
const handleLoginClick = () => {
  // 先捕获按钮位置，然后再隐藏按钮
  if (captureButtonPositions()) {
    // 立即显示粒子并隐藏按钮
    showParticles.value = true;

    // 等待下一帧，确保画布已显示
    nextTick(() => {
      initParticlesToForm();
    });
  }
};

// 处理注册账号点击
const handleRegisterClick = (event) => {
  // 阻止默认行为
  event.preventDefault();

  // 捕获当前登录表单的位置
  if (captureFormPosition(loginFormContainer.value)) {
    // 隐藏登录表单，显示粒子
    showForm.value = false;
    showParticles.value = true;

    // 等待下一帧，确保画布已显示
    nextTick(() => {
      initParticlesLoginToRegister();
    });
  }
};

// 处理返回登录点击
const handleReturnToLogin = (event) => {
  // 阻止默认行为
  if (event) event.preventDefault();

  // 捕获当前注册表单的位置
  if (captureFormPosition(registerFormContainer.value)) {
    // 隐藏注册表单，显示粒子
    showForm.value = false;
    showParticles.value = true;

    // 等待下一帧，确保画布已显示
    nextTick(() => {
      initParticlesRegisterToLogin();
    });
  }
};

// 处理忘记密码点击
const handleForgotPassword = (event) => {
  // 阻止默认行为
  event.preventDefault();

  // 显示通知
  showNotification('忘记密码功能即将上线，请稍后再试', 'info');
};

// 处理返回按钮点击
const handleBackClick = () => {
  // 设置表单的离开动画
  formTransition.value = 'form';

  // 直接隐藏表单，不显示粒子
  showForm.value = false;

  // 等待表单完全消失后显示按钮
  // 表单动画持续时间为0.5秒，所以等待0.5秒后显示按钮
  setTimeout(() => {
    showParticles.value = false;
  }, 500);
};

// 组件挂载时
onMounted(() => {
  // 启动轮播
  startAutoplay();

  // 启动时钟
  updateTime();
  clockTimer = setInterval(updateTime, 1000);

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (particleCanvas.value) {
      particleCanvas.value.width = window.innerWidth;
      particleCanvas.value.height = window.innerHeight;
    }
    if (mouseParticleCanvas.value) {
      mouseParticleCanvas.value.width = window.innerWidth;
      mouseParticleCanvas.value.height = window.innerHeight;
    }
  });

  // 显示欢迎通知
  // setTimeout(() => {
  //   showNotification('欢迎来到我们的游戏世界！', 'success', 5000);
  // }, 1000);
});

// 组件卸载时
onUnmounted(() => {
  // 清除轮播定时器
  stopAutoplay();

  // 清除时钟定时器
  if (clockTimer) {
    clearInterval(clockTimer);
    clockTimer = null;
  }

  // 清除动画
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  // 清除鼠标粒子动画
  if (mouseAnimationFrameId) {
    cancelAnimationFrame(mouseAnimationFrameId);
    mouseAnimationFrameId = null;
  }

  // 清除鼠标移动计时器
  if (mouseMovementTimer) {
    clearTimeout(mouseMovementTimer);
    mouseMovementTimer = null;
  }

  // 移除事件监听
  window.removeEventListener('resize', () => {});
});

// 暴露通知接口，可以在外部调用
defineExpose({
  showNotification
});
</script>

<style scoped>
/* 确保页面没有默认边距和填充 */
:root, body {
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止出现滚动条 */
  width: 100%;
  height: 100%;
}

/* 轮播容器样式 - 填充整个视口 */
.carousel-container {
  position: fixed; /* 固定定位，覆盖整个视口 */
  top: 0;
  left: 0;
  width: 100vw; /* 100%视口宽度 */
  height: 100vh; /* 100%视口高度 */
  overflow: hidden;
  perspective: 1000px; /* 设置3D透视效果 */
  margin: 0; /* 移除任何边距 */
  padding: 0; /* 移除任何填充 */
}

/* 轮播主体样式 */
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d; /* 保持3D效果 */
}

/* 轮播项样式 */
.carousel-item {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* 隐藏背面 */
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片覆盖整个容器，可能会裁剪部分图片 */
  object-position: center; /* 图片居中 */
  border-radius: 0; /* 移除圆角 */
}

/* 向左滑动的进入动画 - 从右上方进入 */
.slide-left-enter-active {
  animation: slideInFromRightTop 0.6s ease-out forwards;
}

/* 向左滑动的离开动画 - 向左后方移动 */
.slide-left-leave-active {
  animation: slideOutToLeftBack 0.6s ease-in forwards;
}

/* 定义动画关键帧 */
@keyframes slideInFromRightTop {
  0% {
    transform: translate3d(100%, -50px, 0) rotate3d(0, 1, 0, 45deg);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0) rotate3d(0, 0, 0, 0);
    opacity: 1;
  }
}

@keyframes slideOutToLeftBack {
  0% {
    transform: translate3d(0, 0, 0) rotate3d(0, 0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(-100%, 50px, -200px) rotate3d(0, 1, 0, -45deg);
    opacity: 0;
  }
}

/* 时间容器样式 - 左下角定位 */
.time-container {
  position: absolute;
  bottom: 40px; /* 距离底部的距离 */
  left: 40px; /* 距离左侧的距离 */
  pointer-events: none; /* 允许点击穿透到下层元素 */
}

/* 时间显示 */
.time-display {
  position: relative;
  text-align: left;
}

/* 时间文本样式 */
.current-time {
  font-size: 4rem; /* 放大字体 */
  font-weight: bold;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  position: relative;
}

/* 创建倒影效果 */
.current-time::after {
  content: attr(data-content);
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  transform: scaleY(-1);
  opacity: 0.3;
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent);
  -webkit-background-clip: text;
  background-clip: text;
  color: white;
}

/* 按钮容器样式 */
.buttons-container {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center; /* 居中对齐 */
  transform: translateY(-50%);
  pointer-events: none; /* 容器本身不接收点击事件 */
}

/* 按钮组样式 */
.buttons-group {
  display: flex;
  gap: 20px; /* 按钮之间的间距大幅缩短 */
}

/* 按钮基础样式 */
.action-button {
  background-color: rgba(255, 255, 255, 0.25); /* 半透明白色 */
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 30px; /* 圆角矩形 */
  padding: 15px 40px; /* 增加水平内边距，使按钮更长 */
  min-width: 160px; /* 设置最小宽度确保按钮足够长 */
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px); /* 背景模糊效果 */
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  pointer-events: auto; /* 按钮可以接收点击事件 */
  animation: buttonFadeIn 1s ease-out forwards;
  opacity: 0;
  transform: translateY(50px);
  text-align: center; /* 确保文本居中 */
}

/* 按钮悬停效果 */
.action-button:hover {
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
}

/* 按钮点击效果 */
.action-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* 左侧按钮特定样式 */
.left-button {
  animation-delay: 0.2s; /* 稍微延迟，使两个按钮错开动画 */
}

/* 右侧按钮特定样式 */
.right-button {
  animation-delay: 0.4s; /* 更长的延迟 */
}

/* 按钮渐入动画 */
@keyframes buttonFadeIn {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 粒子画布样式 */
.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
}

/* 鼠标跟随粒子画布样式 */
.mouse-particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5; /* 比表单粒子层级低 */
  pointer-events: none;
}

/* 表单容器 */
.form-container {
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  z-index: 20;
  pointer-events: auto;
}

/* 表单 */
.form {
  position: relative;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 登录表单特定样式 */
.login-form {
  /* 登录表单特定样式可以在这里添加 */
}

/* 注册表单特定样式 */
.register-form {
  /* 注册表单可能需要更多的高度 */
  padding-bottom: 20px;
}

/* 隐藏表单容器 */
.hidden-forms {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  opacity: 0;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.back-button:active {
  transform: scale(0.95);
}

.back-button svg {
  width: 20px;
  height: 20px;
}

/* 表单标题 */
.form h2 {
  color: white;
  text-align: center;
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 1.8rem;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* 表单组 */
.form-group {
  margin-bottom: 20px;
}

/* 表单标签 */
.form-group label {
  display: block;
  color: white;
  margin-bottom: 8px;
  font-size: 1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 表单输入框 */
.form-group input {
  width: 100%;
  padding: 12px 15px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* 表单操作区 */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

/* 提交按钮 */
.submit-button {
  background-color: rgba(255, 255, 255, 0.25);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  margin-right: 10px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.submit-button:hover {
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

/* 取消按钮 */
.cancel-button {
  background-color: rgba(0, 0, 0, 0.25);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 12px 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  margin-left: 10px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.cancel-button:hover {
  background-color: rgba(0, 0, 0, 0.4);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

/* 表单链接 */
.form-links {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.form-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.form-links a:hover {
  color: white;
  text-decoration: underline;
}

/* 表单动画 */
.form-enter-active,
.form-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.form-enter-from,
.form-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(50px);
}

/* 通知系统样式 */
.notifications-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  max-width: 90%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.notification {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border-left: 4px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  pointer-events: auto;
  overflow: hidden;
  position: relative;
}

.notification.error {
  border-left-color: rgba(255, 100, 100, 0.8);
}

.notification.success {
  border-left-color: rgba(100, 255, 100, 0.8);
}

.notification.warning {
  border-left-color: rgba(255, 200, 100, 0.8);
}

.notification.info {
  border-left-color: rgba(100, 200, 255, 0.8);
}

.notification-icon {
  margin-right: 15px;
  color: white;
  flex-shrink: 0;
}

.notification-content {
  flex-grow: 1;
}

.notification-message {
  color: white;
  font-size: 0.95rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.notification-close {
  background: transparent;
  border: none;
  color: white;
  opacity: 0.7;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* 通知动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.4s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .buttons-group {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .action-button {
    padding: 12px 30px;
    font-size: 1rem;
    min-width: 140px;
  }

  .current-time {
    font-size: 3rem;
  }

  .form {
    width: 85%;
    max-width: 350px;
    padding: 20px;
  }

  .form-container {
    right: 50%;
    transform: translate(50%, -50%);
  }

  .notifications-container {
    width: 300px;
    bottom: 10px;
    right: 10px;
  }
}
</style>