import { createRouter, createWebHistory } from 'vue-router'
import MovieDashboardView from '@/views/MovieDashboardView.vue'
import MovieDetailView from '@/views/MovieDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MovieDashboardView,
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetailView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
