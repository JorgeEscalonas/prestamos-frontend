<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium">{{ label }}</label>

    <select
      class="w-full border rounded px-3 py-2 text-gray-900 outline-none 
             focus:ring-2 focus:ring-blue-500"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option disabled value="">Seleccione...</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  options: { type: Array, default: () => [] }
});
defineEmits(["update:modelValue"]);
</script>
