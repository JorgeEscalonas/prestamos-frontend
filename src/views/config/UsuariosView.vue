<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Gestión de Usuarios" />
    <UsuariosConfig />
  </AdminLayout>
</template>

<script setup>
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import UsuariosConfig from "@/components/config/UsuariosConfig.vue";
</script>
