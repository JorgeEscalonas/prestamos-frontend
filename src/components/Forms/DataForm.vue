<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div v-for="field in fields" :key="field.name" :class="field.class || ''">
        <component
          :is="getComponent(field.type)"
          v-model="formData[field.name]"
          :label="field.label"
          :type="field.inputType || 'text'"
          :options="field.options"
          :placeholder="field.placeholder"
          :required="field.required"
          @create-new="handleCreateNew"
        />
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        :disabled="loading"
      >
        <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        {{ loading ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Combobox from '@/components/ui/Combobox.vue';

const props = defineProps({
  fields: {
    type: Array,
    required: true,
    // { name, label, type: 'input'|'select'|'combobox', inputType: 'text'|'number'|..., options: [], required: bool, class: string }
  },
  initialValues: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel', 'create-new']);

const formData = ref({ ...props.initialValues });

// Initialize formData with empty strings for fields not in initialValues to avoid uncontrolled input warnings
props.fields.forEach(field => {
  if (formData.value[field.name] === undefined) {
    formData.value[field.name] = '';
  }
});

watch(() => props.initialValues, (newVal) => {
  formData.value = { ...newVal };
}, { deep: true });

const getComponent = (type) => {
  if (type === 'select') return Select;
  if (type === 'combobox') return Combobox;
  return Input;
};

const handleCreateNew = () => {
  emit('create-new');
};

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
