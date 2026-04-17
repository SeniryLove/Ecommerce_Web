<template>
  <div>
    <h2>¥I´Ú½T»{¤¤...</h2>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/utils/axios'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  try {
    const transactionId = route.query.transactionId
    const orderId = route.query.orderId

    await api.post('/payment/linepay/confirm', {
      transactionId,
      orderId
    })

    router.push('/payment-success')
  } catch (e) {
    router.push('/payment-failed')
  }
})
</script>