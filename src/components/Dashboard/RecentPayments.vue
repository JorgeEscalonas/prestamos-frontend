<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/5 sm:px-6 sm:pt-6 h-full"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Últimos Ingresos</h3>
    </div>

    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-100 dark:border-gray-800">
             <th class="py-2 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Ref</th>
             <th class="py-2 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">Monto</th>
             <th class="py-2 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">Fecha</th>
          </tr>
        </thead>
        <tbody>
           <tr v-if="ultimosPagos.length === 0">
             <td colspan="3" class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
               No hay pagos recientes.
             </td>
           </tr>
           <tr 
             v-for="pago in ultimosPagos" 
             :key="pago.id"
             class="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
           >
             <td class="py-3 text-sm text-gray-800 dark:text-white/90">
                <div class="font-medium">#{{ pago.prestamoId }}</div>
                <div class="text-xs text-gray-500">{{ pago.referencia || 'S/R' }}</div>
             </td>
             <td class="py-3 text-right">
                <div class="text-sm font-bold text-green-600 dark:text-green-400">
                   +{{ formatCurrency(pago.monto) }}
                </div>
             </td>
             <td class="py-3 text-right text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {{ formatDate(pago.fechaPago) }}
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
const { ultimosPagos } = storeToRefs(dashboardStore)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-VE', { 
    day: '2-digit', 
    month: 'short' 
  })
}
</script>
