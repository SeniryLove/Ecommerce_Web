<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import axios from '@/utils/axios'
import type { Product } from '@/types/product'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()

const product = ref<Product | null>(null)
const quantity = ref(1)
const showToast = ref(false)

onMounted(async () => {
  const res = await axios.get(`/products/${route.params.id}`)
  product.value = res.data
})

/* 庫存狀態 */
const stockStatus = computed(() => {
  if (!product.value) return ''
  if (product.value.stock === 0) return 'soldout'
  if (product.value.stock < 5) return 'low'
  return 'normal'
})

/* 數量控制 */
function increase() {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

function decrease() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function addToCart() {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }

  if (product.value) {
    
    cart.addToCart({
      ...product.value,
    }, quantity.value )

    showToast.value = true
    setTimeout(() => showToast.value = false, 2500)
  }
}

function prevPage() {
  router.push('/')
}
</script>

<template>
  <div v-if="product" class="page-wrapper">

    <div class="back-btn" @click="prevPage">
      ← 回主頁
    </div>

    <div class="detail-card">

      <!-- 左側圖片 + 放大鏡效果 -->
      <div class="left">
        <div class="image-wrapper">
          <img :src="product.image_url" class="product-image" />
        </div>
      </div>

      <!-- 右側 -->
      <div class="right">

        <h1 class="title">{{ product.name }}</h1>

        <div class="price">
          NT$ {{ product.price }}
        </div>

        <div class="stock" :class="stockStatus">
          庫存：{{ product.stock }}
        </div>

        <!-- 數量選擇器 -->
        <div class="quantity-wrapper">
          <button @click="decrease">−</button>
          <span>{{ quantity }}</span>
          <button @click="increase">＋</button>
        </div>

        <div class="desc">
          {{ product.description }}
        </div>

        <button 
          class="cart-btn"
          :disabled="stockStatus === 'soldout'"
          @click="addToCart"
        >
          加入購物車
        </button>

      </div>
    </div>

    <!-- Toast -->
    <div v-if="showToast" class="toast">
      ✅ 已成功加入購物車！
    </div>

  </div>
</template>

<style scoped>

/* ===== 基本 ===== */
.page-wrapper {
  max-width: 1100px;
  margin: 50px auto;
  padding: 0 20px;
}

.back-btn {
  margin-bottom: 20px;
  cursor: pointer;
}

/* ===== 卡片 ===== */
.detail-card {
  display: flex;
  gap: 60px;
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

/* ===== 圖片 Hover 放大鏡 ===== */
.image-wrapper {
  overflow: hidden;
  border-radius: 12px;
}

.product-image {
  width: 450px;
  height: 400px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.image-wrapper:hover .product-image {
  transform: scale(1.2);
}

/* ===== 右側 ===== */
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
}

.price {
  font-size: 26px;
  color: #e63946;
  font-weight: bold;
  margin-bottom: 15px;
}

.stock.low {
  color: orange;
}

.stock.soldout {
  color: red;
  font-weight: bold;
}

/* ===== 數量選擇器 ===== */
.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
}

.quantity-wrapper button {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: none;
  background: #f0f0f0;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
}

.quantity-wrapper button:hover {
  background: #ddd;
}

.quantity-wrapper span {
  font-size: 18px;
  min-width: 30px;
  text-align: center;
}

/* ===== 加入購物車按鈕 ===== */
.cart-btn {
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background: #2a9d8f;
  color: white;
  transition: 0.25s;
}

.cart-btn:hover {
  background: #21867a;
}

.cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* ===== Toast ===== */
.toast {
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: #2a9d8f;
  color: white;
  padding: 14px 22px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  animation: fadeInOut 2.5s ease;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  15% { opacity: 1; transform: translateY(0); }
  85% { opacity: 1; }
  100% { opacity: 0; transform: translateY(20px); }
}

/* ===== RWD ===== */
@media (max-width: 768px) {
  .detail-card {
    flex-direction: column;
  }

  .product-image {
    width: 100%;
    height: 280px;
  }
}

</style>