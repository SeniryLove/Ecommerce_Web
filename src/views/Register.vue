<template>
  <div class="auth-container">
    <h2 class="title">建立帳號</h2>

    <form class="register-form" @submit.prevent="handleRegister">

      <!-- 姓名 -->
      <div class="form-group">
        <label>姓名</label>
        <input v-model="form.name" type="text" placeholder="輸入姓名" />
        <span class="error" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="輸入 Email" />
        <span class="error" v-if="errors.email">{{ errors.email }}</span>
      </div>

      <!-- 使用者名稱 -->
      <div class="form-group">
        <label>使用者名稱</label>
        <input v-model="form.username" type="text" placeholder="輸入使用者名稱" />
        <span class="error" v-if="errors.username">{{ errors.username }}</span>
      </div>

      <!-- 密碼 -->
      <div class="form-group">
        <label>密碼</label>
        <input v-model="form.password" type="password" placeholder="至少 8 碼" @input="checkPasswordStrength" />
        <div class="password-strength">
          密碼強度：
          <span :class="strengthClass">{{ passwordStrength }}</span>
        </div>
        <span class="error" v-if="errors.password">{{ errors.password }}</span>
      </div>

      <!-- 確認密碼 -->
      <div class="form-group">
        <label>確認密碼</label>
        <input v-model="form.password_confirmation" type="password" placeholder="再次輸入密碼" />
        <span class="error" v-if="errors.password_confirmation">{{ errors.password_confirmation }}</span>
      </div>

      <!-- 送出 -->
      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? '註冊中...' : '註冊' }}
      </button>

    </form>

    <div class="login-link">
      已經有帳號？
      <router-link to="/login">返回登入</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/axios'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'

export default defineComponent({
  name: 'Register',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const loading = ref(false)

    const form = reactive({
      name: '',
      email: '',
      username: '',
      password: '',
      password_confirmation: ''
    })

    const errors = reactive<any>({})
    const passwordStrength = ref('弱')
    const strengthClass = ref('weak')

    const validate = () => {
      Object.keys(errors).forEach(k => delete errors[k])
      if (!form.name) errors.name = '請輸入姓名'
      if (!form.email) errors.email = '請輸入 Email'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email 格式錯誤'
      if (!form.username) errors.username = '請輸入使用者名稱'
      if (!form.password) errors.password = '請輸入密碼'
      else if (form.password.length < 8) errors.password = '密碼至少 8 碼'
      if (form.password !== form.password_confirmation) errors.password_confirmation = '密碼不一致'
      return Object.keys(errors).length === 0
    }

    const checkPasswordStrength = () => {
      const pwd = form.password
      if (pwd.length < 8) { passwordStrength.value = '弱'; strengthClass.value = 'weak' }
      else if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) { passwordStrength.value = '強'; strengthClass.value = 'strong' }
      else { passwordStrength.value = '中'; strengthClass.value = 'medium' }
    }

    const handleRegister = async () => {
      if (!validate()) return
      loading.value = true
      try {
        const { data } = await request.post('/register', form)
        authStore.setAuth(data)
        router.push('/')
      } catch (error: any) {
        if (error.response?.status === 422) Object.assign(errors, error.response.data.errors)
        else alert('註冊失敗')
      } finally {
        loading.value = false
      }
    }

    return { form, errors, loading, handleRegister, passwordStrength, strengthClass, checkPasswordStrength }
  }
})
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 35px 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  font-family: 'Noto Sans TC', sans-serif;
}

.title {
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 25px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group label {
  font-weight: 500;
  display: block;
  margin-bottom: 6px;
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
  outline: none;
  border-color: #409eff;
}

.error {
  color: #ff4d4f;
  font-size: 13px;
  margin-top: 4px;
  display: block;
}

.password-strength {
  font-size: 13px;
  margin-top: 4px;
}

.password-strength .weak { color: #ff4d4f; }
.password-strength .medium { color: #faad14; }
.password-strength .strong { color: #52c41a; }

.submit-btn {
  padding: 12px;
  background: #409eff;
  color: #fff;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:disabled {
  background: #a0c4ff;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background: #3071d1;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.login-link a {
  color: #409eff;
  font-weight: 500;
  text-decoration: none;
}

.login-link a:hover {
  color: #3071d1;
}
</style>