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
      <div v-if="loading && !cliente" class="flex justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <template v-else-if="cliente">
        <!-- Client Details Card -->
        <ComponentCard title="Información del Cliente">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">Nombre Completo</p>
              <p class="text-lg font-medium text-gray-800 dark:text-white">{{ cliente.nombre }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">Cédula de Identidad</p>
              <p class="text-lg font-medium text-gray-800 dark:text-white">{{ cliente.cedula }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
              <p class="text-lg font-medium text-gray-800 dark:text-white">{{ cliente.telefono || 'No registrado' }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">Fecha de Registro</p>
              <p class="text-lg font-medium text-gray-800 dark:text-white">{{ formatDate(cliente.createdAt) }}</p>
            </div>
          </div>
        </ComponentCard>

        <!-- Loans Table -->
        <ComponentCard title="Préstamos Asociados">
          <DataTable :columns="loanColumns" :data="prestamos">
            <template #cell-montoPrestado="{ item }">
              {{ formatCurrency(item.montoPrestado) }}
            </template>
            <template #cell-porcentaje="{ item }">
              {{ item.porcentaje }}%
            </template>
            <template #cell-saldoPendiente="{ item }">
              {{ formatCurrency(item.saldoPendiente) }}
            </template>
            <template #cell-fechaRegistro="{ item }">
              {{ formatDate(item.fechaRegistro) }}
            </template>
            <template #cell-estado="{ item }">
              <span :class="getStatusClass(item.estado)" class="px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ item.estado }}
              </span>
            </template>
          </DataTable>
          <div v-if="prestamos.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
            Este cliente no tiene préstamos registrados.
          </div>
        </ComponentCard>
      </template>

      <!-- Error/Not Found State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">No se encontró información del cliente.</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClientesStore } from "@/store/clientes";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import DataTable from "@/components/tables/DataTable.vue";
import Button from "@/components/ui/Button.vue";

const route = useRoute();
const router = useRouter();
const clientesStore = useClientesStore();

const loading = ref(false);
const cliente = ref(null);
const prestamos = ref([]);

// Icon component definition using render function to avoid runtime compiler warning
const ArrowLeftIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    'stroke-width': '1.5',
    stroke: 'currentColor',
    class: 'w-5 h-5'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
    })
  ])
};

const pageTitle = computed(() => cliente.value ? `Detalle de Cliente` : 'Cargando...');

const loanColumns = [
  { key: "montoPrestado", label: "Monto", headerClass: "text-left" },
  { key: "porcentaje", label: "Tasa (%)", headerClass: "text-left" },
  { key: "saldoPendiente", label: "Saldo Pendiente", headerClass: "text-left" },
  { key: "fechaRegistro", label: "Fecha Inicio", headerClass: "text-left" },
  { key: "estado", label: "Estado", headerClass: "text-left" },
];

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    loading.value = true;
    
    try {
      // 1. Intentar obtener el cliente
      // Primero verificamos si ya está en el store
      let currentClient = clientesStore.clientes.find(c => c.id == id);
      
      // Si no está, cargamos la lista completa de clientes (ya que no existe endpoint individual)
      if (!currentClient) {
        await clientesStore.fetchClientes();
        currentClient = clientesStore.clientes.find(c => c.id == id);
      }
      
      if (currentClient) {
        cliente.value = currentClient;
      } else {
        console.error("Cliente no encontrado incluso después de cargar la lista.");
      }

      // 2. Obtener los préstamos del cliente
      const loansData = await clientesStore.getPrestamosByCliente(id);
      prestamos.value = loansData || [];
      
    } catch (error) {
      console.error("Error cargando los datos:", error);
    } finally {
      loading.value = false;
    }
  }
});

const goBack = () => {
  router.push("/clientes");
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("es-VE");
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(value);
};

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
  
  switch (status.toLowerCase()) {
    case 'activo': 
    case 'aprobado':
      return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
    case 'pagado': 
    case 'finalizado':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    case 'mora': 
    case 'vencido':
      return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
    default: 
      return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
  }
};
</script>
