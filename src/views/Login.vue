<template>
  <div class="login-container">
    <h2 class="title">會員登入</h2>

    <form class="login-form" @submit.prevent="login">
      <div class="form-group">
        <label>使用者名稱/Email</label>
        <input v-model="form.login" type="text" placeholder="輸入帳號或 Email" required />
      </div>

      <div class="form-group">
        <label>密碼</label>
        <input v-model="form.password" type="password" placeholder="輸入密碼" required />
      </div>

      <button type="submit" class="login-btn">登入</button>
    </form>

    <div class="divider"><span>或</span></div>

    <!-- OAuth 登入 -->
    <div class="oauth-section">
      <button class="oauth-btn google" @click="loginWithGoogle">
        <img :src="GoogleIcon" alt="Google" /> 使用 Google 登入
      </button>

      <button class="oauth-btn line" @click="loginWithLine">
        <img :src="LineIcon" alt="LINE" /> 使用 LINE 登入
      </button>
    </div>

    <div class="register-section">
      <span>還沒有帳號？</span>
      <button class="register-btn" @click="goRegister">立即註冊</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/axios'
import { useUserStore } from '@/stores/userStore'

// 匯入圖示
import GoogleIcon from '@/assets/icons/google.svg'
import LineIcon from '@/assets/icons/line.png'

const router = useRouter()
const userStore = useUserStore()
const BACKEND_BASE = import.meta.env.VITE_BACKEND_HOST;

const form = reactive({
  login: '',
  password: ''
})

const login = async () => {
  try {
    const { data } = await request.post('/login', form)
    userStore.setUser(data.user, data.token)
    window.location.href = "/"
  } catch (error: any) {
    alert(error.response?.data?.message || '登入失敗')
  }
}

const loginWithGoogle = () => {
  window.location.href = `${BACKEND_BASE}/auth/google/redirect`
}

const loginWithLine = () => {
  window.location.href = `${BACKEND_BASE}/auth/line/redirect`
}

const goRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 40px 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  font-family: 'Noto Sans TC', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #333;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #409eff;
  outline: none;
}

.login-btn {
  background: #409eff;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.login-btn:hover {
  background: #3071d1;
}

.divider {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #ddd;
  line-height: 0.1em;
  margin: 20px 0;
}

.divider span {
  background: #fff;
  padding: 0 10px;
  color: #999;
}

.oauth-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 0;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.oauth-btn img {
  width: 28px;   /* 改大尺寸 */
  height: 28px;  /* 改大尺寸 */
}

.oauth-btn.google {
  background: #fff;
  border: 1px solid #ccc;
}

.oauth-btn.google:hover {
  background: #f2f2f2;
}

.oauth-btn.line {
  background: #00c300;
  color: #fff;
}

.oauth-btn.line:hover {
  background: #00a200;
}

.register-section {
  margin-top: 25px;
  text-align: center;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #555;
}

.register-btn {
  background: none;
  border: none;
  color: #409eff;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.register-btn:hover {
  color: #3071d1;
}
</style>