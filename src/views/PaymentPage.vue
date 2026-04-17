<template>
  <div class="checkout-page">

    <div class="checkout-container">

      <!-- 左側付款方式 -->
      <div class="payment-section">
        <h2 class="section-title">選擇付款方式</h2>

        <div class="payment-list">

          <!-- ECPay -->
          <div
            class="payment-item ecpay"
            :class="{ disabled: loading }"
            @click="payWithEcpay"
          >
            <div class="payment-left">

              <div class="logo-box">
                <img :src="ecpayLogo" class="ecpay-logo" alt="ECPay" />
              </div>

              <div>
                <div class="payment-title">綠界 ECPay</div>
                <div class="payment-desc">
                  信用卡 / ATM / 超商代碼
                </div>
              </div>

            </div>

            <ChevronRight class="arrow-icon" />
          </div>

          <!-- LINE Pay -->
          <div
            class="payment-item linepay"
            :class="{ disabled: loading }"
            @click="payWithLinePay"
          >
            <div class="payment-left">

              <div class="logo-box line">
                <img :src="linePayLogo" class="line-logo" alt="LINE Pay" />
              </div>

              <div>
                <div class="payment-title">LINE Pay</div>
                <div class="payment-desc">
                  使用 LINE 官方安全付款
                </div>
              </div>

            </div>

            <ChevronRight class="arrow-icon" />
          </div>

        </div>
      </div>

      <!-- 右側訂單摘要 -->
      <div class="summary-section">
        <h3 class="summary-title">訂單摘要</h3>

        <div class="summary-box">
          <div class="summary-row">
            <span>訂單編號</span>
            <span>#{{ order.id }}</span>
          </div>

          <div class="summary-row total">
            <span>應付金額</span>
            <span>NT$ {{ Number(order.total_amount).toLocaleString() }}</span>
          </div>
        </div>

        <div class="security-note">
          <ShieldCheck :size="16" />
          <span>付款資料將透過 SSL 加密保護</span>
        </div>
      </div>

    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <Loader2 class="spinner" />
      <p>正在導向付款頁面...</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/axios'

import {
  ChevronRight,
  Loader2,
  ShieldCheck
} from 'lucide-vue-next'

import linePayLogo from '@/assets/icons/linepay.png'
import ecpayLogo from '@/assets/icons/ecpay.png'

const route = useRoute()
const orderId = route.params.orderId

// ✅ 修正 TS2339：將 total_price 改為 total_amount 以符合 Order 型別
const order = ref<{ id: string | number; total_amount: number }>({
  id: '',
  total_amount: 0
})

const loading = ref(false)

const openEcpay = (html: string) => {
  document.open()
  document.write(html)
  document.close()
}

onMounted(async () => {
  const res = await api.get(`/orders/${orderId}`)
  order.value = res.data
})

const payWithEcpay = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const res = await api.get(`/payment/ecpay/${orderId}`)
    openEcpay(res.data)
  } catch (error: any) {
    loading.value = false
    alert(error.response?.data?.message || 'ECPay 付款錯誤')
  }
}

const payWithLinePay = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const res = await api.post(`/payment/linepay/${orderId}`)
    window.location.href = res.data.redirect_url
  } catch (error: any) {
    loading.value = false
    alert(error.response?.data?.message || 'LINE Pay 付款錯誤')
  }
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc, #eef2f7);
  padding: 50px 20px;
  font-family: 'Noto Sans TC', sans-serif;
}

.checkout-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

/* 左側 */
.payment-section {
  background: #fff;
  padding: 36px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.05);
}

.section-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 28px;
}

.payment-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.payment-item {
  border-radius: 18px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid #eee;
  background: #fff;
}

.payment-item:hover {
  transform: translateY(-4px);
}

.payment-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Logo 區 */
.icon-box img {
  height: 50px;
  width: auto; /* 等比縮放寬度 */
  object-fit: contain;
  margin-right: 12px;
}

.logo-box.line {
  background: white;
}

.ecpay-logo {
  height: 48px; /* 高度固定，等比縮放 */
  object-fit: contain;
}

.line-logo {
  height: 48px; /* 與 ECPay 對齊 */
  object-fit: contain;
}

/* ECPay */
.ecpay {
  border-color: #22c55e;
}

.ecpay:hover {
  background: #f0fdf4;
  box-shadow: 0 10px 30px rgba(34,197,94,0.2);
}

/* LINE */
.linepay {
  border-color: #00c300;
}

.linepay:hover {
  background: #f6fff6;
  box-shadow: 0 10px 30px rgba(0,195,0,0.25);
}

.payment-left {
  display: flex;
  align-items: center; /* 垂直置中 */
}

.payment-title {
  font-weight: 700;
  font-size: 1.05rem;
}

.payment-desc {
  font-size: 0.9rem;
  color: #777;
}

.arrow-icon {
  color: #bbb;
  transition: 0.2s;
}

.payment-item:hover .arrow-icon {
  transform: translateX(5px);
  color: #333;
}

.payment-item.disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* 右側 */
.summary-section {
  background: #fff;
  padding: 36px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.05);
}

.summary-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 22px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
}

.summary-row.total {
  font-size: 1.8rem;
  font-weight: 800;
  color: #e53935;
  border-top: 1px solid #eee;
  padding-top: 14px;
  margin-top: 10px;
}

.security-note {
  margin-top: 22px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #777;
}

/* Loading */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.spinner {
  animation: spin 1s linear infinite;
  margin-bottom: 14px;
  width: 40px;
  height: 40px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* RWD */
@media (max-width: 900px) {
  .checkout-container {
    grid-template-columns: 1fr;
  }
}
</style>