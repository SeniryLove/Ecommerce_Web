<template>
  <div class="cart-page" v-if="auth.isAuthenticated">
    <button class="back-btn" @click="prevPage">← 回主頁</button>

    <h2 class="page-title">我的購物車</h2>

    <div v-if="cart.items.length > 0" class="cart-items">
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="cart-item-card"
      >
        <img :src="item.image_url" alt="" class="product-img" />
        <div class="item-info">
          <p class="product-name">{{ item.name }}</p>
          <p class="product-price">NT$ {{ item.price }}</p>
          <div class="quantity-control">
            <button @click="cart.updateQuantity(item.id, item.quantity - 1)" 
                    :disabled="item.quantity <= 1">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="cart.updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
        </div>
        <button class="remove-btn" @click="cart.removeItem(item.id)">刪除</button>
      </div>
    </div>
    <div v-else class="empty-cart">
      <p>購物車目前沒有商品</p>
    </div>

    <div class="cart-summary" v-if="cart.items.length > 0">
      <h3>總金額：NT$ {{ cart.totalAmount }}</h3>
      <button class="checkout-btn" @click="checkout">前往結帳</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

function openCart() {
  if (!auth.isAuthenticated) {
    router.push('/login')
  }
}

async function checkout() {
  const res = await cart.checkout()
  router.push(`/payment/${res.order.id}`)
}

function prevPage() {
  router.push('/')
}



</script>

<style scoped>
.cart-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Noto Sans TC', sans-serif;
}

.back-btn {
  background: #f2f2f2;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #d9d9d9;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  gap: 15px;
}

.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.product-name {
  font-weight: 600;
}

.product-price {
  color: #555;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-control button {
  width: 28px;
  height: 28px;
  border: none;
  background: #f2f2f2;
  cursor: pointer;
  border-radius: 4px;
  font-size: 16px;
}

.quantity-control button:hover {
  background: #d9d9d9;
}

.remove-btn {
  background: #ff4d4f;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #d9363e;
}

.cart-summary {
  text-align: right;
  margin-top: 20px;
}

.checkout-btn {
  background: #409eff;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.checkout-btn:hover {
  background: #3071d1;
}

.empty-cart {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
  margin-top: 50px;
}
</style>