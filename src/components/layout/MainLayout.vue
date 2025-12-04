<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    <main class="container mx-auto">
      <slot />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
</script>

