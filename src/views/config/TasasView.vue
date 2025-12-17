<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Configuración de Tasas" />
    <TasasConfig />
  </AdminLayout>
</template>

<script setup>
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import TasasConfig from "@/components/config/TasasConfig.vue";
</script>
