import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: () => import('../views/ClientesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clientes/:id',
    name: 'cliente-detalle',
    component: () => import('../views/ClienteView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/prestamos',
    name: 'prestamos',
    component: () => import('../views/PrestamosView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/prestamos/:id',
    name: 'prestamo-detalle',
    component: () => import('../views/PrestamoView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pagos',
    name: 'pagos',
    component: () => import('../views/PagosView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/config',
    name: 'config',
    component: () => import('../views/ConfigView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('../views/ReportsView.vue'),
    meta: { requiresAuth: true }
  },
  // Redirect root → dashboard
  {
    path: '/',
    redirect: '/dashboard'
  },
  // 404 fallback
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
