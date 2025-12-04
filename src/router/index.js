import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// Lazy load views (mejor rendimiento)
const LoginView = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const ClientesView = () => import('@/views/ClientesView.vue')
const ClienteView = () => import('@/views/ClienteView.vue')
const PrestamosView = () => import('@/views/PrestamosView.vue')
const PrestamoView = () => import('@/views/PrestamoView.vue')
const PagosView = () => import('@/views/PagosView.vue')
const ConfigView = () => import('@/views/ConfigView.vue')
const ReportsView = () => import('@/views/ReportsView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true }
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },

    {
      path: '/clientes',
      name: 'clientes',
      component: ClientesView
    },

    {
      path: '/clientes/:id',
      name: 'cliente-detalle',
      component: ClienteView,
      props: true
    },

    {
      path: '/prestamos',
      name: 'prestamos',
      component: PrestamosView
    },

    {
      path: '/prestamos/:id',
      name: 'prestamo-detalle',
      component: PrestamoView,
      props: true
    },

    {
      path: '/pagos',
      name: 'pagos',
      component: PagosView
    },

    {
      path: '/config',
      name: 'config',
      component: ConfigView
    },

    {
      path: '/reports',
      name: 'reports',
      component: ReportsView
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
      component: NotFoundView
    }
  ]
})

/* ------------------------------------------------------------------
   PROTECCIÓN DE RUTAS (GUARD GLOBAL)
   - Bloquea rutas privadas si no hay sesión
   - Permite libre acceso a /login
------------------------------------------------------------------ */
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.public) {
    return next()
  }

  if (!auth.token) {
    return next('/login')
  }

  next()
})

export default router
