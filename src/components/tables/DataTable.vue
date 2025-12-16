<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/5"
  >
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-5 py-3 text-left sm:px-6"
              :class="col.headerClass"
            >
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                {{ col.label }}
              </p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(item, rowIndex) in data"
            :key="rowIndex"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-5 py-4 sm:px-6"
              :class="col.cellClass"
            >
              <!-- Slot dinámico para personalizar el contenido de la celda -->
              <slot :name="`cell-${col.key}`" :item="item">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                  {{ item[col.key] }}
                </p>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination Footer -->
    <div v-if="showPagination && pagination" class="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-3">
        <label class="text-sm text-gray-600 dark:text-gray-400">Filas por página:</label>
        <select
          :value="pagination.perPage"
          @change="handlePerPageChange"
          class="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 text-sm py-1.5 focus:border-blue-500 focus:ring-blue-500"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="changePage(pagination.currentPage - 1)"
          :disabled="pagination.currentPage <= 1"
          class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
        >
          Anterior
        </button>
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[6rem] text-center">
          Página {{ pagination.currentPage }} de {{ pagination.totalPages }}
        </span>
        <button
          @click="changePage(pagination.currentPage + 1)"
          :disabled="pagination.currentPage >= pagination.totalPages"
          class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  showPagination: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      currentPage: 1,
      totalPages: 1,
      perPage: 10
    })
  }
});

const emit = defineEmits(['update:perPage', 'page-change']);

const handlePerPageChange = (e) => {
  emit('update:perPage', Number(e.target.value));
};

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= props.pagination.totalPages) {
    emit('page-change', newPage);
  }
};
</script>
