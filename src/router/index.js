import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'group-chat',
      component: () => import('../views/GroupChat.vue')
    },
    {
      path: '/private-chat',
      name: 'private-chat',
      component: () => import('../views/PrivateChat.vue')
    }
  ]
})

export default router
