<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'

const store = useProductStore()
const router = useRouter()

const currentPage = ref(1)

onMounted(() => {
  store.fetchProducts(currentPage.value)
})

function goDetail(id: number) {
  router.push(`/products/${id}`)
}

function changePage(page: number) {
  currentPage.value = page
  store.fetchProducts(page)
}

/* 將 products 切成每 4 個一列 */
const productRows = computed(() => {
  const rows = []
  for (let i = 0; i < store.products.length; i += 4) {
    rows.push(store.products.slice(i, i + 4))
  }
  return rows
})
</script>

<template>
  <div class="page-wrapper">

    <!-- 商品列表 -->
    <div class="table-wrapper">
      <table class="product-table">
        <tbody>
          <tr v-for="(row, rowIndex) in productRows" :key="rowIndex">
            <td 
              v-for="product in row" 
              :key="product.id"
              class="product-cell"
              @click="goDetail(product.id)"
            >
              <div class="card">
                <img :src="product.image_url" class="product-image" />
                <h4 class="product-title">{{ product.name }}</h4>
                <p class="price">NT$ {{ product.price }}</p>
                <p class="stock">庫存 {{ product.stock }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分頁 -->
    <div class="pagination">
      <button
        v-for="page in store.lastPage"
        :key="page"
        :class="['page-btn', { active: page === currentPage }]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </div>

  </div>
</template>

<style scoped>

/* ===== 整體頁面 ===== */
.page-wrapper {
  max-width: 1200px;
  margin: 40px auto;
  text-align: center;
}

/* ===== Table 外層置中 ===== */
.table-wrapper {
  display: flex;
  justify-content: center;
}

/* ===== 表格樣式 ===== */
.product-table {
  border-collapse: separate;
  border-spacing: 20px 25px; /* 卡片間距 */
}

/* ===== 每格 ===== */
.product-cell {
  width: 250px;
  vertical-align: top;
  cursor: pointer;
}

/* ===== 卡片設計 ===== */
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 18px;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

/* ===== 圖片比例固定 ===== */
.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

/* ===== 文字樣式 ===== */
.product-title {
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0;
  min-height: 40px;
}

.price {
  color: #e63946;
  font-weight: bold;
  margin: 6px 0;
}

.stock {
  color: #666;
  font-size: 14px;
}

/* ===== 分頁 ===== */
.pagination {
  margin-top: 30px;
}

.page-btn {
  margin: 0 6px;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  background: #f1f1f1;
  cursor: pointer;
  transition: 0.2s;
}

.page-btn:hover {
  background: #dcdcdc;
}

.page-btn.active {
  background: #2a9d8f;
  color: white;
}

</style>