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
const ReportsView = () => import('@/views/ReportsView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

// Config Views
const TasasView = () => import('@/views/config/TasasView.vue')
const UsuariosView = () => import('@/views/config/UsuariosView.vue')

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

    // Rutas de Configuración
    {
      path: '/config/tasas',
      name: 'config-tasas',
      component: TasasView,
      meta: { requiresAuth: true, role: "admin" }
    },
    {
      path: '/config/usuarios',
      name: 'config-usuarios',
      component: UsuariosView,
      meta: { requiresAuth: true, role: "admin" }
    },
    {
      path: '/config',
      redirect: '/config/tasas'
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

    // 404 fallback (ruta privada)
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
      // No tiene meta.public, por lo que requiere autenticación
    }
  ]
})

/* ------------------------------------------------------------------
   PROTECCIÓN DE RUTAS (GUARD GLOBAL)
   - Bloquea rutas privadas si no hay sesión
   - Redirige usuarios autenticados que intentan acceder a /login
   - Permite libre acceso a /login solo si no hay sesión
------------------------------------------------------------------ */
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Si la ruta es pública (como /login)
  if (to.meta.public) {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (auth.isAuthenticated || auth.token) {
      return next('/dashboard')
    }
    // Si no está autenticado, permitir acceso a rutas públicas
    return next()
  }

  // Si la ruta es privada y no hay token, redirigir al login
  if (!auth.isAuthenticated && !auth.token) {
    return next('/login')
  }

  next()
})

export default router
