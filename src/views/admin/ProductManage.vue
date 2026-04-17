<template>
  <div class="product-manage p-6 bg-gray-50 min-h-screen">
    <h1 class="page-title">商品管理</h1>

    <!-- 新增商品按鈕 -->
    <div class="flex justify-end mb-6">
      <button @click="openForm()"
              class="btn-add">
        新增商品
      </button>
    </div>

    <!-- 商品列表 -->
    <div class="products-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image">
          <img :src="product.image_url" alt="商品圖片" />
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-price">NT$ {{ product.price }}</p>
          <p class="product-stock">庫存: {{ product.stock }}</p>
          <p class="product-status" :class="product.is_active ? 'status-active' : 'status-inactive'">
            {{ product.is_active ? '上架中' : '已下架' }}
          </p>
        </div>
        <div class="product-actions">
          <button @click="openForm(product)" class="btn-edit">修改</button>
          <button @click="toggleStatus(product)"
                  :class="product.is_active ? 'btn-deactivate' : 'btn-activate'">
            {{ product.is_active ? '下架' : '上架' }}
          </button>
          <button @click="deleteProduct(product.id)" class="btn-delete">刪除</button>
        </div>
      </div>
    </div>

    <!-- 新增/修改商品表單浮動卡片 -->
    <transition name="fade">
      <div v-if="showForm" class="form-overlay">
        <div class="form-card">
          <h3>{{ form.id ? '修改商品' : '新增商品' }}</h3>
          <div class="form-fields">
            <input v-model="form.name" type="text" placeholder="名稱" class="input-field" />
            <input v-model.number="form.price" type="number" placeholder="價格" class="input-field" />
            <input v-model.number="form.stock" type="number" placeholder="庫存" class="input-field" />
            <input v-model="form.image_url" type="text" placeholder="圖片 URL" class="input-field" />
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="form.is_active" class="accent-green-500">
              上架
            </label>
          </div>
          <div class="form-actions">
            <button @click="saveProduct" class="btn-save">儲存</button>
            <button @click="closeForm" class="btn-cancel">取消</button>
          </div>
          <button @click="closeForm" class="form-close">&times;</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios'

const products = ref([])
const showForm = ref(false)
const form = ref({
  id: null,
  name: '',
  price: 0,
  stock: 0,
  image_url: '',
  is_active: true
})

const fetchProducts = async () => {
  try {
    const res = await axios.get('/admin/products')
    products.value = res.data.data
  } catch (err) {
    console.error(err)
    alert('取得商品失敗')
  }
}

const openForm = (product = null) => {
  form.value = product ? { ...product } : { id: null, name: '', price: 0, stock: 0, image_url: '', is_active: true }
  showForm.value = true
}
const closeForm = () => { showForm.value = false }

const saveProduct = async () => {
  try {
    if (form.value.id) {
      await axios.put(`/admin/products/${form.value.id}`, form.value)
      alert('修改成功')
    } else {
      await axios.post('/admin/products', form.value)
      alert('新增成功')
    }
    closeForm()
    fetchProducts()
  } catch (err) {
    console.error(err)
    alert('儲存失敗')
  }
}

const deleteProduct = async (id) => {
  if (!confirm('確定刪除嗎？')) return
  try {
    await axios.delete(`/admin/products/${id}`)
    alert('刪除成功')
    fetchProducts()
  } catch (err) {
    console.error(err)
    alert('刪除失敗')
  }
}

const toggleStatus = async (product) => {
  try {
    await axios.patch(`/admin/products/${product.id}/toggle`)
    fetchProducts()
  } catch (err) {
    console.error(err)
    alert('操作失敗')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.products-list {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
  gap: 20px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

.product-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.product-info {
  padding: 12px;
  flex: 1;
}
.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}
.product-price {
  font-weight: 700;
  color: #38b000;
  margin-bottom: 4px;
}
.product-stock {
  color: #555;
  font-size: 0.9rem;
}
.status-active {
  color: green;
  font-weight: 500;
}
.status-inactive {
  color: red;
  font-weight: 500;
}

.product-actions {
  display: flex;
  gap: 5px;
  padding: 12px;
  border-top: 1px solid #eee;
}

.product-actions button {
  flex: 1;
  padding: 6px 0;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-edit {
  background: #3b82f6;
  color: #fff;
}
.btn-edit:hover { background: #2563eb; }
.btn-deactivate {
  background: #facc15;
  color: #fff;
}
.btn-deactivate:hover { background: #eab308; }
.btn-activate {
  background: #22c55e;
  color: #fff;
}
.btn-activate:hover { background: #16a34a; }
.btn-delete {
  background: #ef4444;
  color: #fff;
}
.btn-delete:hover { background: #dc2626; }

/* 浮動表單 */
.form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 30px 24px;
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}
.form-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
}
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.input-field {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  transition: 0.2s;
}
.input-field:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34,197,94,0.25);
}
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}
.btn-save {
  background: #22c55e;
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 500;
}
.btn-save:hover { background: #16a34a; }
.btn-cancel {
  background: #e5e7eb;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 500;
}
.btn-cancel:hover { background: #d1d5db; }
.form-close {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
}
.form-close:hover { color: #555; }

/* 過渡動畫 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>