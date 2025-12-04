<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium">{{ label }}</label>

    <input
      v-bind="$attrs"
      :type="type"
      class="w-full border rounded px-3 py-2 text-gray-900 outline-none 
             focus:ring-2 focus:ring-blue-500"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  type: { type: String, default: "text" }
});
defineEmits(["update:modelValue"]);
</script>
