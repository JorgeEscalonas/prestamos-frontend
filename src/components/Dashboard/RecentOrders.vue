<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/5 sm:px-6"
  >
    <div class="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Nuevos Créditos</h3>
      </div>
      
      <div class="flex items-center gap-3">
         <span class="text-xs text-gray-500 dark:text-gray-400">Últimos 5 registrados</span>
      </div>
    </div>

    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-t border-gray-100 dark:border-gray-800">
            <th class="py-3 text-left">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Cliente</p>
            </th>
            <th class="py-3 text-left">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Fecha Inicio</p>
            </th>
            <th class="py-3 text-right">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Monto</p>
            </th>
             <th class="py-3 text-right">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Total a Pagar</p>
            </th>
            <th class="py-3 text-right">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Estado</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="ultimosPrestamos.length === 0">
             <td colspan="5" class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
               No hay préstamos recientes.
             </td>
          </tr>
          <tr
            v-for="(loan, index) in ultimosPrestamos"
            :key="index"
            class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <td class="py-3 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div>
                  <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {{ loan.cliente?.nombre || 'Cliente #' + loan.clienteId }}
                  </p>
                  <span class="text-gray-500 text-theme-xs dark:text-gray-400"
                    >C.I: {{ loan.cliente?.cedula || 'N/A' }}</span
                  >
                </div>
              </div>
            </td>
            <td class="py-3 whitespace-nowrap">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                {{ formatDate(loan.fechaInicio) }}
              </p>
            </td>
            <td class="py-3 whitespace-nowrap text-right">
              <p class="font-medium text-gray-800 dark:text-white/90">
                {{ formatCurrency(loan.montoPrestado) }}
              </p>
            </td>
            <td class="py-3 whitespace-nowrap text-right">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                 {{ formatCurrency(loan.montoTotal) }}
              </p>
            </td>
            <td class="py-3 whitespace-nowrap text-right">
              <span
                :class="[
                  'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                  getStatusClass(loan.estado)
                ]"
              >
                {{ loan.estado }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useDashboardStore } from '@/store/dashboard'
import { storeToRefs } from 'pinia'

const dashboardStore = useDashboardStore()
const { ultimosPrestamos } = storeToRefs(dashboardStore)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-VE')
}

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'pendiente':
      return 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400'
    case 'pagado':
    case 'finalizado':
      return 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  }
}
</script>
