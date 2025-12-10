<template>
  <div class="flex flex-col gap-1 relative" ref="container">
    <label v-if="label" class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
    
    <div class="relative">
      <input
        type="text"
        class="w-full border rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        :placeholder="placeholder"
        v-model="searchQuery"
        @focus="isOpen = true"
        @input="isOpen = true"
      />
      
      <div v-if="isOpen" class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        <div v-if="filteredOptions.length > 0">
          <div
            v-for="opt in filteredOptions"
            :key="opt.value"
            class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            @click="selectOption(opt)"
          >
            {{ opt.label }}
          </div>
        </div>
        <div v-else class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
          No se encontraron resultados
        </div>

        <!-- Create New Option -->
        <div 
          class="border-t border-gray-100 dark:border-gray-700 px-4 py-2 cursor-pointer bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium flex items-center justify-center gap-2"
          @click="createNew"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Registrar nuevo cliente
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  options: { type: Array, default: () => [] },
  placeholder: String,
});

const emit = defineEmits(["update:modelValue", "create-new"]);

const isOpen = ref(false);
const searchQuery = ref("");
const container = ref(null);

// Watch for modelValue changes to update the input display if needed (reverse mapping)
watch(() => props.modelValue, (newVal) => {
  const selected = props.options.find(o => o.value === newVal);
  if (selected) {
    searchQuery.value = selected.label;
  } else if (!newVal) {
    searchQuery.value = "";
  }
}, { immediate: true });

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const lowerQuery = searchQuery.value.toLowerCase();
  
  // If the search query exactly matches an option label, we might want to still show others or just that one.
  // Standard combobox behavior: filter by containment.
  return props.options.filter(opt => 
    String(opt.label).toLowerCase().includes(lowerQuery)
  );
});

const selectOption = (opt) => {
  searchQuery.value = opt.label;
  emit('update:modelValue', opt.value);
  isOpen.value = false;
};

const createNew = () => {
  emit('create-new');
  isOpen.value = false;
};

// Click outside to close
const handleClickOutside = (e) => {
  if (container.value && !container.value.contains(e.target)) {
    isOpen.value = false;
    // If input has text but no option selected (and no match), revert or clear?
    // Be nice: Revert to label of modelValue
    const selected = props.options.find(o => o.value === props.modelValue);
    if (selected) {
      searchQuery.value = selected.label;
    } else {
      searchQuery.value = "";
    }
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>
