<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Reportes y Estadísticas" />
    
    <div class="space-y-6">
      <!-- Header section with description -->
      <div class="max-w-3xl">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Centro de Reportes</h1>
        <p class="text-gray-500 dark:text-gray-400">
          Obtenga una visión detallada de su cartera de préstamos. Genere documentos PDF actualizados para auditoría, gestión de cobranza y análisis estratégico.
        </p>
      </div>

      <!-- Reports Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ComponentCard 
          v-for="report in reports" 
          :key="report.id" 
          :title="report.title"
          :desc="report.description"
          className="hover:shadow-lg transition-shadow duration-300"
        >
          <div class="flex flex-col items-center justify-center py-4">
            <!-- Icon Container with Dynamic Background -->
            <div 
              class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-transform hover:scale-110 duration-300"
              :style="{ backgroundColor: report.bgColor, color: report.color }"
            >
               <component :is="report.icon" class="h-10 w-10" />
            </div>
            
            <!-- Download Button -->
            <Button 
              @click="handleDownload(report)" 
              variant="primary" 
              className="w-full justify-center gap-2 group"
              :disabled="loadingReport === report.id"
            >
              <template v-if="loadingReport === report.id">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando PDF...
              </template>
              <template v-else>
                <span>Descargar Reporte</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke-width="2" 
                  stroke="currentColor" 
                  class="w-5 h-5 transition-transform group-hover:translate-y-1"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5" />
                </svg>
              </template>
            </Button>
          </div>
        </ComponentCard>
      </div>

      <!-- FAQ or Information section -->
      <div class="mt-12 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <InfoCircleIcon class="h-5 w-5 text-blue-500" />
          Información Importante
        </h2>
        <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li class="flex items-start gap-2">
            <div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></div>
            <span>Todos los reportes se generan en tiempo real con la información más reciente registrada en el sistema.</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></div>
            <span>Los documentos se descargan en formato PDF estándar, compatible con cualquier lector de documentos y navegadores modernos.</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></div>
            <span>Si encuentra alguna discrepancia en los datos, verifique los registros de préstamos y pagos correspondientes.</span>
          </li>
        </ul>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/ui/Button.vue'
import api from '@/services/api'
import { DocsIcon, BarChartIcon, PieChartIcon, InfoCircleIcon } from '@/icons'

/**
 * SEO: Update document title
 */
onMounted(() => {
  document.title = 'Reportes | Sistema de Gestión de Préstamos'
})

/**
 * State to handle loading for individual reports
 */
const loadingReport = ref(null)

/**
 * Report configuration list
 */
const reports = [
  {
    id: 'general',
    title: 'Resumen Ejecutivo General',
    description: 'Dashboard en PDF con métricas clave: préstamos totales, comparación de estados, capital otorgado y saldo acumulado.',
    endpoint: '/pdf/general',
    filename: 'Reporte_General_Dashboard.pdf',
    icon: PieChartIcon,
    color: '#3B82F6', // blue-500
    bgColor: 'rgba(59, 130, 246, 0.1)'
  },
  {
    id: 'pendientes',
    title: 'Cartera de Pendientes',
    description: 'Detalle de préstamos activos con saldo a cobrar. Incluye datos del cliente, monto original y saldo actual.',
    endpoint: '/pdf/pendientes',
    filename: 'Reporte_Prestamos_Pendientes.pdf',
    icon: DocsIcon,
    color: '#F59E0B', // amber-500
    bgColor: 'rgba(245, 158, 11, 0.1)'
  },
  {
    id: 'pagados',
    title: 'Historial de Préstamos Pagados',
    description: 'Registro histórico de préstamos finalizados. Ideal para auditoría de ingresos y cierres de caja históricos.',
    endpoint: '/pdf/pagados',
    filename: 'Reporte_Prestamos_Pagados.pdf',
    icon: BarChartIcon,
    color: '#10B981', // emerald-500
    bgColor: 'rgba(16, 185, 129, 0.1)'
  }
]

/**
 * Downloads the report PDF from the API
 * @param {Object} report The report object to download
 */
const handleDownload = async (report) => {
  if (loadingReport.value) return
  
  loadingReport.value = report.id
  
  try {
    const response = await api.get(report.endpoint, {
      responseType: 'blob'
    })
    
    // Create a URL for the blob and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', report.filename)
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error al generar el reporte PDF:', error)
    alert('Ocurrió un error al generar el reporte. Asegúrese de estar autenticado e intente de nuevo.')
  } finally {
    loadingReport.value = null
  }
}
</script>

<style scoped>
/* Optional: specific styles if needed beyond Tailwind */
</style>