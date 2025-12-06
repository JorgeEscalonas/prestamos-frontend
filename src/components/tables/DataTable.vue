<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3"
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
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
    // Formato esperado: { key: 'id', label: 'ID', headerClass: '', cellClass: '' }
  },
  data: {
    type: Array,
    required: true,
  },
});
</script>
