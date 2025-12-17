<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <!-- Panel de Control y Actualización -->
    <ComponentCard title="Control de Tasa">
      <div class="p-6">
        <!-- Current Rate Display -->
        <div class="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg">
          <p class="text-blue-100 font-medium mb-1">Tasa de Cambio del Sistema</p>
          <div class="flex items-baseline gap-2">
            <span class="text-5xl font-bold tracking-tight">
              {{ formatCurrency(tasaActual?.valor) }}
            </span>
            <span class="text-xl text-blue-200">Bs/USD</span>
          </div>
          <p class="mt-4 text-sm text-blue-200 border-t border-blue-400/30 pt-3">
             Última actualización: {{ formatDate(tasaActual?.createdAt || tasaActual?.fecha) }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Option 1: BCV Rate -->
          <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
             <div class="flex justify-between items-start mb-2">
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Tasa Oficial BCV</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                   En línea
                </span>
             </div>
             
             <div v-if="tasaBCV" class="mb-4">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(tasaBCV.valor) }} <span class="text-sm font-normal text-gray-500">Bs</span>
                </p>
                <p class="text-xs text-gray-500 mt-1">
                   Actualizado: {{ tasaBCV.lastUpdate || 'Reciente' }}
                </p>
             </div>
             <div v-else class="mb-4 py-2">
                 <p class="text-sm text-gray-500 italic">Cargando tasa BCV...</p>
             </div>

             <Button 
               @click="usarBCV" 
               :disabled="!tasaBCV"
               variant="outline" 
               class="w-full justify-center"
               size="sm"
             >
               Usar esta tasa
             </Button>
          </div>

          <!-- Option 2: Custom Rate -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Entrada Manual</h4>
            <div>
               <Input
                 v-model="nuevaTasa"
                 type="number"
                 placeholder="0.00"
                 label="Valor personalizado"
               />
            </div>
            <Button 
               @click="actualizar" 
               :disabled="!nuevaTasa || loading" 
               class="w-full justify-center"
               variant="primary"
            >
              <span v-if="loading">Guardando...</span>
              <span v-else>Guardar Nueva Tasa</span>
            </Button>
          </div>
        </div>

      </div>
    </ComponentCard>

    <!-- Historial -->
    <ComponentCard title="Historial de Cambios">
       <DataTable
         :columns="columns"
         :data="paginatedData"
         :showPagination="true"
         :pagination="{ perPage, currentPage, totalPages }"
         @page-change="handlePageChange"
       >
         <!-- Hardcoding simple pagination handling for now or rely on DataTable default if it handles slicing -->
         <!-- Assuming DataTable handles display mostly. If client side pagination isn't built-in to DataTable props, we pass all data. -->
         
         <template #cell-valor="{ item }">
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(item.valor) }} Bs
            </span>
         </template>

         <template #cell-createdAt="{ item }">
            <span class="text-gray-500">
              {{ formatDate(item.createdAt || item.fecha) }}
            </span>
         </template>
       </DataTable>
    </ComponentCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useTasasStore } from "@/store/tasas";
import ComponentCard from "@/components/common/ComponentCard.vue";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import DataTable from "@/components/tables/DataTable.vue";

const store = useTasasStore();
const nuevaTasa = ref("");
const loading = ref(false);

// Pagination state
const currentPage = ref(1);
const perPage = ref(5);

const columns = [
  { key: "valor", label: "Tasa", headerClass: "w-1/2" },
  { key: "createdAt", label: "Fecha", headerClass: "w-1/2" },
];

onMounted(() => {
  store.fetchTasas();
  store.fetchTasaBCV();
});

const tasaActual = computed(() => store.tasaActual);
const tasaBCV = computed(() => store.tasaBCV);

const paginatedData = computed(() => {
  if (!store.tasas) return [];
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return store.tasas.slice(start, end);
});

const totalPages = computed(() => {
  if (!store.tasas) return 1;
  return Math.ceil(store.tasas.length / perPage.value);
});

const handlePageChange = (p) => {
  currentPage.value = p;
};

const actualizar = async () => {
  if (!nuevaTasa.value || nuevaTasa.value <= 0) return;
  loading.value = true;
  await store.updateTasa(nuevaTasa.value);
  nuevaTasa.value = "";
  loading.value = false;
  // Reset to first page to see the new entry
  currentPage.value = 1; 
};

const usarBCV = () => {
  if (tasaBCV.value && tasaBCV.value.valor) {
     nuevaTasa.value = tasaBCV.value.valor;
  }
};

const formatCurrency = (val) => {
  if (!val) return "—";
  return Number(val).toLocaleString("es-VE", { minimumFractionDigits: 2 });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" });
};
</script>
