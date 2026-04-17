import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/ProductList.vue'),
        },
        {
          path: 'products/:id',
          name: 'product-detail',
          component: () => import('@/views/ProductDetail.vue'),
        },
        {
          path: 'orders',
          component: () => import('@/views/OrderList.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'orders/:id',
          component: () => import('@/views/OrderDetail.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'cart',
          component: () => import('@/views/CartDrawer.vue'),
          meta: { requiresAuth: true }
        },
      ]
  },
  {
    path: '/oauth-success',
    component: () => import('@/views/OAuthSuccess.vue'),
  },  
  {
    path: '/register',
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
  },  
  {
    path: '/admin',
    children: [
      {
        path: 'products',
        component: () => import('@/views/admin/ProductManage.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      }
    ]
  },
  {
    path: '/payment/:orderId',
    component: () => import('@/views/PaymentPage.vue'),
  },
  {
    path: '/payment/result',
    component: () => import('@/views/PaymentResult.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
    return
  }

  if (to.meta.role && auth.user?.role !== to.meta.role) {
    next('/')
    return
  }

  next()
})

export default router
