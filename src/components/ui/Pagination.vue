<template>
  <div class="flex justify-center items-center gap-3 mt-4">
    <button
      class="px-3 py-1 border rounded"
      :disabled="page === 1"
      @click="$emit('update:page', page - 1)"
    >
      Anterior
    </button>

    <span class="text-sm font-medium">
      Página {{ page }} de {{ totalPages }}
    </span>

    <button
      class="px-3 py-1 border rounded"
      :disabled="page === totalPages"
      @click="$emit('update:page', page + 1)"
    >
      Siguiente
    </button>
  </div>
</template>

<script setup>
defineProps({
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 }
});
defineEmits(["update:page"]);
</script>
