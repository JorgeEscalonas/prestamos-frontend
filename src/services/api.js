import axios from 'axios'
import { useAuthStore } from '@/store/auth'

// Instancia principal
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // ajusta al backend real
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/* ------------------------------------------------------------------
   1) INTERCEPTOR DE REQUEST
   - Inserta el JWT automáticamente en cada request
------------------------------------------------------------------ */
api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()

    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/* ------------------------------------------------------------------
   2) INTERCEPTOR DE RESPUESTA
   Manejo global de:
    - 401: no autenticado
    - 403: prohibido
    - 422: errores de validación
    - 500: error servidor
------------------------------------------------------------------ */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const auth = useAuthStore()
    const originalRequest = error.config

    // ====== 401 Unauthorized ======
    if (error.response?.status === 401) {
      // Token inválido → cerrar sesión
      auth.logout()
      return Promise.reject({ message: 'Sesión expirada. Inicia sesión nuevamente.' })
    }

    // ====== 403 Forbidden ======
    if (error.response?.status === 403) {
      return Promise.reject({ message: 'No tienes permisos para esta acción.' })
    }

    // ====== 422 Validación (backend) ======
    if (error.response?.status === 422) {
      return Promise.reject(error.response.data)
    }

    // ====== 500 ======
    if (error.response?.status >= 500) {
      return Promise.reject({
        message: 'Error inesperado en el servidor. Intenta más tarde.'
      })
    }

    return Promise.reject(error)
  }
)

export default api
