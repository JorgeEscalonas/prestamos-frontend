<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <!-- Logo o título -->
      <div class="flex items-center">
        <router-link to="/dashboard" class="flex items-center space-x-2">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            Sistema de Préstamos
          </h1>
        </router-link>
      </div>

      <!-- User menu -->
      <div class="flex items-center space-x-4">
        <!-- User info -->
        <div v-if="authStore.user" class="hidden sm:flex items-center space-x-3">
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ authStore.user.nombre || authStore.user.cedula || 'Usuario' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ authStore.user.cedula || '' }}
            </p>
          </div>
        </div>

        <!-- Logout button -->
        <button
          @click="handleLogout"
          class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          title="Cerrar sesión"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span class="hidden sm:inline">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  // El router guard redirigirá automáticamente a /login
  router.push('/login')
}
</script>

