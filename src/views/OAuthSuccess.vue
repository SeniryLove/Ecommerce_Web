<template>
  <div class="oauth-container">

    <!-- 載入中 -->
    <div v-if="loading" class="loading-state">
      <p>驗證中，請稍候...</p>
    </div>

    <!-- 需要註冊 -->
    <div v-else-if="isRegister" class="register-card">
      <h2>完成註冊</h2>

      <form class="register-form" @submit.prevent="register">

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" readonly />
        </div>

        <div class="form-group">
          <label>姓名</label>
          <input v-model="form.name" readonly />
        </div>

        <div class="form-group">
          <label>使用者名稱</label>
          <input v-model="form.username" required placeholder="輸入使用者名稱"/>
        </div>

        <div class="form-group">
          <label>密碼</label>
          <input type="password" v-model="form.password" required placeholder="輸入密碼"/>
        </div>

        <div class="form-group">
          <label>確認密碼</label>
          <input type="password" v-model="form.password_confirmation" required placeholder="再次輸入密碼"/>
        </div>

        <button type="submit" class="submit-btn">建立帳號</button>
      </form>
    </div>

    <!-- 錯誤 -->
    <div v-else class="error-state">
      <p>OAuth 驗證失敗</p>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/axios'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'

export default defineComponent({
  name: 'OAuthSuccess',

  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    const authStore = useAuthStore()

    const loading = ref(true)
    const isRegister = ref(false)

    const form = reactive({
      email: '',
      name: '',
      username: '',
      password: '',
      password_confirmation: '',
      provider: '',
      provider_id: ''
    })

    const register = async () => {
      try {
        const { data } = await axios.post('/auth/register-oauth', form)
        const name = data.user.name
        const role = data.user.role
        // ✅ 修正 TS2345：從 data.user 取得完整 User 物件
        userStore.setUser(data.user, data.token)
        authStore.setAuth({ token: data.token, user: data.user })
        router.push('/')
      } catch (error: any) {
        alert(error.response?.data?.message || '註冊失敗')
      }
    }

    onMounted(() => {
      const token = route.query.token as string
      const name = route.query.name as string
      const role = route.query.role as string
      const exists = route.query.exists as string
      const registerFlag = route.query.register as string

      // ===== 已存在帳號 =====
      if (exists && token) {
        // ✅ 修正 TS2345 / TS2322：補全 User 必要欄位
        const user = {
          id: Number(route.query.id) || 0,
          name,
          email: route.query.email as string ?? '',
          role: role as 'admin' | 'user'
        }
        userStore.setUser(user, token)
        authStore.setAuth({ token, user })
        router.push('/')
        return
      }

      // ===== 需要註冊 =====
      if (registerFlag) {
        form.email = route.query.email as string
        form.name = route.query.name as string
        form.provider = route.query.provider as string
        form.provider_id = route.query.provider_id as string

        isRegister.value = true
        loading.value = false
        return
      }

      // ===== 其他情況 =====
      loading.value = false
    })

    return {
      loading,
      isRegister,
      form,
      register
    }
  }
})
</script>

<style scoped>
.oauth-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  font-family: 'Noto Sans TC', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-state, .error-state {
  text-align: center;
  font-size: 1.1rem;
  color: #555;
}

.register-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.register-card h2 {
  text-align: center;
  color: #333;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
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
  outline: none;
  border-color: #409eff;
}

.submit-btn {
  background: #409eff;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  background: #3071d1;
}
</style>