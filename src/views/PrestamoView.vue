<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <Button variant="outline" @click="goBack" :startIcon="ArrowLeftIcon">
          Volver
        </Button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !prestamo" class="flex justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <template v-else-if="prestamo">
        <!-- Loan Details Card -->
        <ComponentCard title="Información del Préstamo">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">Cliente Asociado</p>
              <p class="text-lg font-medium text-gray-800 dark:text-white">ID: {{ prestamo.clienteId }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">Monto Prestado</p>
              <p class="text-lg font-medium text-gray-800 dark:text-white">{{ formatCurrency(prestamo.montoPrestado) }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">Monto Total (Con Intereses)</p>
              <p class="text-lg font-medium text-gray-800 dark:text-white">{{ formatCurrency(prestamo.montoTotal) }}</p>
            </div>
             <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">Interés / Porcentaje</p>
              <p class="text-lg font-medium text-gray-800 dark:text-white">{{ prestamo.porcentaje }}%</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">Saldo Pendiente</p>
              <p class="text-lg font-medium text-gray-800 dark:text-white">{{ formatCurrency(prestamo.saldoPendiente) }}</p>
            </div>
             <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">Estado</p>
              <span :class="getStatusClass(prestamo.estado)" class="px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ prestamo.estado }}
              </span>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">Fecha de Registro</p>
              <p class="text-lg font-medium text-gray-800 dark:text-white">{{ formatDate(prestamo.fechaRegistro) }}</p>
            </div>
          </div>
        </ComponentCard>

        <!-- Payments Table -->
        <ComponentCard title="Pagos Asociados">
          <DataTable :columns="pagoColumns" :data="pagos">
            <template #cell-monto="{ item }">
              {{ formatCurrency(item.monto) }}
            </template>
            <template #cell-fechaPago="{ item }">
              {{ formatDate(item.fechaPago) }}
            </template>
          </DataTable>
          <div v-if="pagos.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
            Este préstamo no tiene pagos registrados.
          </div>
        </ComponentCard>
      </template>

      <!-- Error/Not Found State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">No se encontró información del préstamo.</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePrestamosStore } from "@/store/prestamos";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import DataTable from "@/components/tables/DataTable.vue";
import Button from "@/components/ui/Button.vue";

const route = useRoute();
const router = useRouter();
const prestamosStore = usePrestamosStore();

const loading = ref(false);
const prestamo = ref(null);
const pagos = ref([]);

// Icon component definition
const ArrowLeftIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>`
};

const pageTitle = computed(() => prestamo.value ? `Detalle de Préstamo` : 'Cargando...');

const pagoColumns = [
  { key: "monto", label: "Monto", headerClass: "text-left" },
  { key: "fechaPago", label: "Fecha", headerClass: "text-left" },
];

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    // 1. Fetch Payments independently (The endpoint exists)
    loading.value = true;
    try {
      // getPagosByPrestamo in store now has internal try-catch and returns array
      const pagosData = await prestamosStore.getPagosByPrestamo(id);
      pagos.value = pagosData || [];
    } catch (error) {
       console.error("Error fetching pagos:", error);
    }

    // 2. Resolve Prestamo Details
    // The backend does NOT have a GET /prestamos/:id endpoint.
    // We must find the loan in the existing list or fetch the list.
    let foundPrestamo = prestamosStore.prestamos.find(p => p.id == id);
    
    if (!foundPrestamo) {
      try {
        await prestamosStore.fetchPrestamos({ limit: 100 }); // Try to fetch a larger batch to improve chances of finding it
        foundPrestamo = prestamosStore.prestamos.find(p => p.id == id);
      } catch (error) {
        console.error("Error fetching prestamos list:", error);
      }
    }

    if (foundPrestamo) {
      prestamo.value = foundPrestamo;
    }
    
    loading.value = false;
  }
});

const goBack = () => {
  router.push("/prestamos");
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("es-VE");
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "-";
  return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(value);
};

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
  
  switch (status.toLowerCase()) {
    case 'pagado': 
    case 'finalizado':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
      case 'vencido':
        return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
    default: 
      return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
  }
};
</script>