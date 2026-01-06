<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <!-- Actions Bar -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {{ paginatedClientes.length }} de {{ clientes.length }} clientes
        </div>
        
        <button
          @click="openCreateModal"
          class="inline-flex items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          Registrar Cliente
        </button>
      </div>

      <ComponentCard title="Historial de Clientes">
        <DataTable :columns="clientColumns" :data="paginatedClientes">
          <template #cell-nombre="{ item }">
            <span class="text-gray-800 dark:text-white font-medium">
              {{ item.nombre }}
            </span>
          </template>

          <template #cell-cedula="{ item }">
            <span class="text-gray-800 dark:text-white">
              {{ item.cedula }}
            </span>
          </template>

          <template #cell-telefono="{ item }">
            <span class="text-gray-800 dark:text-white">
              {{ item.telefono || '-' }}
            </span>
          </template>

          <template #cell-createdAt="{ item }">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(item.createdAt) }}
            </span>
          </template>
          <template #cell-actions="{ item }">
            <div class="flex items-center justify-end gap-2">
              <button
                @click="handleView(item.id)"
                class="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                title="Ver Detalles"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <button
                @click="handleEdit(item.id)"
                class="text-gray-500 hover:text-success-500 dark:text-gray-400 dark:hover:text-success-400"
                title="Editar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
              <button
                @click="handleDelete(item.id)"
                class="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
                title="Eliminar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </template>
        </DataTable>

        <!-- Pagination Controls -->
        <div class="flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600 dark:text-gray-400">Registros por página:</label>
            <select
              v-model.number="pagination.perPage"
              @change="pagination.currentPage = 1"
              class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="pagination.currentPage--"
              :disabled="pagination.currentPage === 1"
              class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Anterior
            </button>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Página {{ pagination.currentPage }} de {{ totalPages }}
            </span>
            <button
              @click="pagination.currentPage++"
              :disabled="pagination.currentPage >= totalPages"
              class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Siguiente
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>

    <Modal v-if="showCreateModal" :fullScreenBackdrop="true" @close="closeCreateModal">
      <template #body>
        <div class="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-10">
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
              {{ isEditing ? 'Editar Cliente' : 'Registrar Nuevo Cliente' }}
            </h3>
            <button
              @click="closeCreateModal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <DataForm
            :fields="clientFields"
            :initial-values="currentClient"
            :loading="formLoading"
            @submit="handleFormSubmit"
            @cancel="closeCreateModal"
          />
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useClientesStore } from "@/store/clientes";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import DataTable from "@/components/tables/DataTable.vue";
import Modal from "@/components/ui/Modal.vue";
import DataForm from "@/components/Forms/DataForm.vue";

const currentPageTitle = ref("Clientes");
const clientesStore = useClientesStore();
const { clientes, loading } = storeToRefs(clientesStore);
const router = useRouter();

const showCreateModal = ref(false);
const formLoading = ref(false);
const isEditing = ref(false);
const currentClient = ref({});

// Pagination
const pagination = ref({
  currentPage: 1,
  perPage: 10
});

const totalPages = computed(() => {
  return Math.ceil(clientes.value.length / pagination.value.perPage);
});

const paginatedClientes = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.perPage;
  const end = start + pagination.value.perPage;
  return clientes.value.slice(start, end);
});

const clientColumns = [
  { key: "nombre", label: "Nombre", headerClass: "w-1/4" },
  { key: "cedula", label: "Cédula", headerClass: "w-1/4" },
  { key: "telefono", label: "Teléfono", headerClass: "w-1/4" },
  { key: "createdAt", label: "Fecha de Registro", headerClass: "w-1/4" },
  { key: "actions", label: "Acciones", headerClass: "w-1/4 text-right" },
];

const clientFields = [
  { name: "nombre", label: "Nombre Completo", type: "input", required: true, placeholder: "Ej. Juan Pérez" },
  { name: "cedula", label: "Cédula", type: "input", required: true, placeholder: "Ej. 12345678" },
  { name: "telefono", label: "Teléfono", type: "input", required: true, placeholder: "Ej. 0414-1234567" },
];

onMounted(() => {
  clientesStore.fetchClientes();
});

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("es-VE");
};

const handleView = (id) => {
  router.push(`/clientes/${id}`);
};

const handleEdit = (id) => {
  const client = clientes.value.find(c => c.id === id);
  if (client) {
    currentClient.value = { ...client };
    isEditing.value = true;
    showCreateModal.value = true;
  }
};

const handleDelete = async (id) => {
  if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
    await clientesStore.deleteCliente(id);
    await clientesStore.fetchClientes(); // Recargar lista
  }
};

const openCreateModal = () => {
  currentClient.value = {};
  isEditing.value = false;
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  currentClient.value = {};
  isEditing.value = false;
};

const handleFormSubmit = async (formData) => {
  formLoading.value = true;
  try {
    if (isEditing.value) {
      await clientesStore.updateCliente(currentClient.value.id, formData);
    } else {
      await clientesStore.createCliente(formData);
    }
    await clientesStore.fetchClientes();
    closeCreateModal();
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    alert("Error al guardar cliente");
  } finally {
    formLoading.value = false;
  }
};
</script>
