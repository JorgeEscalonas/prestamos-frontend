<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5 md:p-5 h-full flex flex-col">
    <div class="mb-2">
      <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Distribución de Capital</h3>
    </div>

    <div class="flex-1 flex items-center justify-center min-h-[180px]">
        <VueApexCharts
          type="donut"
          width="100%"
          height="280"
          :options="chartOptions"
          :series="series"
        />
    </div>

     <!-- Leyenda Compacta -->
    <div class="mt-2 flex flex-col gap-2">
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <span class="block h-2.5 w-2.5 rounded-full bg-orange-500"></span>
            <span class="font-medium text-gray-600 dark:text-gray-400">Prestado</span>
          </div>
          <span class="font-bold text-gray-800 dark:text-white">{{ formatCurrency(resumen.montoPrestado) }}</span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
             <span class="block h-2.5 w-2.5 rounded-full bg-green-500"></span>
             <span class="font-medium text-gray-600 dark:text-gray-400">Recaudado</span>
          </div>
          <span class="font-bold text-gray-800 dark:text-white">{{ formatCurrency(resumen.totalRecaudado) }}</span>
        </div>
        
        <div class="flex items-center justify-between text-sm">
           <div class="flex items-center gap-2">
            <span class="block h-2.5 w-2.5 rounded-full bg-blue-600"></span>
            <span class="font-medium text-gray-600 dark:text-gray-400">Pendiente</span>
           </div>
           <span class="font-bold text-gray-800 dark:text-white">{{ formatCurrency(resumen.saldoPendiente) }}</span>
        </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useDashboardStore } from '@/store/dashboard'
import { storeToRefs } from 'pinia'

const dashboardStore = useDashboardStore()
const { resumen } = storeToRefs(dashboardStore)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0)
}

const series = computed(() => [
   parseFloat(resumen.value.totalRecaudado || 0),
   parseFloat(resumen.value.saldoPendiente || 0)
])

const labels = ['Recaudado', 'Pendiente']

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'donut',
    height: 280, 
  },
  colors: ['#10B981', '#3C50E0'],
  labels: labels,
  legend: {
    show: false, 
  },
  plotOptions: {
    pie: {
      donut: {
        size: '60%', 
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '12px',
            offsetY: -5,
            color: '#64748B'
          },
          value: {
            show: true,
            fontSize: '18px',
            fontWeight: 600,
            offsetY: 5,
            color: '#1e293b', 
             formatter: function (val) {
               if(val >= 1000) return (val / 1000).toFixed(1) + 'k';
               return val;
             }
          },
          total: {
            show: true,
            label: 'Total',
            color: '#64748B',
            fontSize: '12px',
            fontWeight: 500,
            formatter: function (w) {
              const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              if(total >= 1000) return '$' + (total / 1000).toFixed(1) + 'k';
              return '$' + total.toFixed(0);
            }
          }
        },
      },
    },
  },
  dataLabels: { enabled: false },
  stroke: { width: 0 }, 
  tooltip: {
    y: {
      formatter: function (val) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
      },
    },
  },
}))
</script>
