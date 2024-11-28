import { createRouter, createWebHistory } from 'vue-router'
import UserSummary from '@/views/UserSummary.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'user-summary',
      component: UserSummary,
    },
  ],
})

export default router
