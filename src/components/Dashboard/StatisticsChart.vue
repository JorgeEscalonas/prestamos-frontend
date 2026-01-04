<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
      <div class="w-full">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Flujo de Caja</h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Ingresos (Pagos) vs Egresos (Préstamos)
        </p>
      </div>

      <div class="relative">
        <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
          <button
            v-for="option in periodOptions"
            :key="option.value"
            @click="selectedPeriod = option.value"
            :class="[
              selectedPeriod === option.value
                ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
                : 'text-gray-500 dark:text-gray-400',
              'px-3 py-2 font-medium rounded-lg text-theme-sm hover:text-gray-900 hover:shadow-theme-xs dark:hover:bg-gray-800 dark:hover:text-white',
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartThree" class="-ml-4 min-w-[1000px] xl:min-w-full pl-2">
        <VueApexCharts type="area" height="310" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDashboardStore } from '@/store/dashboard'
import { storeToRefs } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

const dashboardStore = useDashboardStore()
const { flujoCaja } = storeToRefs(dashboardStore)

const periodOptions = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'anual', label: 'Anual' },
]

const selectedPeriod = ref('mensual')

// Fetch data when period changes
watch(selectedPeriod, (newPeriod) => {
  dashboardStore.fetchFlujoCaja(newPeriod)
})

const series = computed(() => {
  if (!flujoCaja.value || flujoCaja.value.length === 0) {
    return [
      { name: 'Ingresos', data: [] },
      { name: 'Egresos', data: [] }
    ]
  }

  return [
    {
      name: 'Ingresos',
      data: flujoCaja.value.map(item => item.ingresos || 0),
    },
    {
      name: 'Egresos',
      data: flujoCaja.value.map(item => item.egresos || 0),
    },
  ]
})

const chartOptions = computed(() => {
  const categories = flujoCaja.value?.map(item => item.periodo) || []

  return {
    legend: {
      show: false, // Oculto como en el template
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#465FFF', '#9CB9FF'], 
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        enabled: true,
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    stroke: {
      curve: 'straight', // Estilo solicitado
      width: [2, 2],
    },
    markers: {
      size: 0, // Estilo solicitado
    },
    labels: {
      show: false,
      position: 'top',
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (val) => `$${new Intl.NumberFormat('en-US').format(val)}`
      }
    },
    xaxis: {
      type: 'category',
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      labels: {
        formatter: (val) => {
          if (val >= 1000) return (val / 1000).toFixed(1) + 'k'
          return val
        }
      }
    },
  }
})
</script>

<style scoped>
.area-chart {
  width: 100%;
}
</style>
