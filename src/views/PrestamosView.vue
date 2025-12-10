<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Listado de Préstamos">
        <template #actions>
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
            Nuevo Préstamo
          </button>
        </template>
        <DataTable :columns="prestamoColumns" :data="prestamos">
          <template #cell-clienteId="{ item }">
            <span class="text-gray-800 dark:text-white">
              {{ getClientName(item.clienteId) }}
            </span>
          </template>
          <template #cell-montoTotal="{ item }">
            {{ formatCurrency(item.montoTotal) }}
          </template>
          <template #cell-saldoPendiente="{ item }">
            {{ formatCurrency(item.saldoPendiente) }}
          </template>
          <template #cell-saldoBolivares="{ item }">
            <span v-if="calculateSaldoBolivares(item) !== null">
              {{ formatCurrency(calculateSaldoBolivares(item)) }}
            </span>
            <span v-else class="text-gray-400 italic">
              -
            </span>
          </template>
          <template #cell-fechaRegistro="{ item }">
            <span class="text-gray-500 text-theme-sm dark:text-gray-400">
              {{ formatDate(item.fechaRegistro) }}
            </span>
          </template>
          <template #cell-estado="{ item }">
             <span :class="getStatusClass(item.estado)" class="px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ item.estado }}
              </span>
          </template>
          <template #cell-actions="{ item }">
            <div class="flex items-center justify-end gap-2">
              <button
                @click="handleView(item.id)"
                class="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                title="Ver Detalle"
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
      </ComponentCard>
    </div>

    <Modal v-if="showCreateModal" :fullScreenBackdrop="true" @close="closeCreateModal">
      <template #body>
        <div class="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-10">
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
              {{ isEditing ? 'Editar Préstamo' : 'Registrar Nuevo Préstamo' }}
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
            :fields="prestamoFields"
            :initial-values="currentPrestamo"
            :loading="formLoading"
            @submit="handleFormSubmit"
            @cancel="closeCreateModal"
            @create-new="openClientModal"
          />
        </div>
      </template>
    </Modal>

    <!-- Client Creation Modal -->
    <Modal v-if="showClientModal" :fullScreenBackdrop="true" @close="closeClientModal">
      <template #body>
         <div class="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-10 z-[60]">
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
              Registrar Nuevo Cliente
            </h3>
            <button
              @click="closeClientModal"
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
            :initial-values="{}"
            :loading="clientFormLoading"
            @submit="handleClientSubmit"
            @cancel="closeClientModal"
          />
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { usePrestamosStore } from "@/store/prestamos";
import { useClientesStore } from "@/store/clientes";
import { useTasasStore } from "@/store/tasas";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import DataTable from "@/components/tables/DataTable.vue";
import Modal from "@/components/ui/Modal.vue";
import DataForm from "@/components/Forms/DataForm.vue";

const currentPageTitle = ref("Préstamos");
const prestamosStore = usePrestamosStore();
const clientesStore = useClientesStore();
const tasasStore = useTasasStore();
const { prestamos, loading } = storeToRefs(prestamosStore);
const { clientes } = storeToRefs(clientesStore);
const { tasas } = storeToRefs(tasasStore);
const router = useRouter();

const showCreateModal = ref(false);
const showClientModal = ref(false);
const formLoading = ref(false);
const clientFormLoading = ref(false);
const isEditing = ref(false);
const currentPrestamo = ref({});

const prestamoColumns = [
  { key: "clienteId", label: "Cliente", headerClass: "w-1/6" },
  { key: "montoTotal", label: "Monto Total", headerClass: "w-1/6" },
  { key: "saldoPendiente", label: "Saldo Pendiente", headerClass: "w-1/6" },
  { key: "saldoBolivares", label: "Saldo Pendiente (Bs)", headerClass: "w-1/6" },
  { key: "fechaRegistro", label: "Fecha de Registro", headerClass: "w-1/6" },
  { key: "estado", label: "Estado", headerClass: "w-1/6" },
  { key: "actions", label: "Acciones", headerClass: "w-1/6 text-right" },
];

const clientOptions = computed(() => {
  return clientes.value
    .filter(c => c.id)
    .map(c => ({
      label: `${c.nombre} - ${c.cedula}`,
      value: c.id
    }));
});

const tasaOptions = computed(() => {
  return tasas.value.map(t => ({
    label: `${t.nombre} (${t.valor})`,
    value: t.id
  }));
});

const getClientName = (id) => {
  const cliente = clientes.value.find(c => c.id === id);
  return cliente ? `${cliente.nombre} (${cliente.cedula})` : `Cliente #${id}`;
};

const prestamoFields = computed(() => [
  { 
    name: "clienteId", 
    label: "Cliente", 
    type: "combobox", 
    required: true, 
    placeholder: "Buscar cliente por nombre o cédula...",
    options: clientOptions.value
  },
  { 
    name: "tasaId", 
    label: "Tasa de Cambio", 
    type: "select", 
    required: true, 
    options: tasaOptions.value
  },
  { name: "montoPrestado", label: "Monto a Prestar", type: "number", required: true, placeholder: "Ej. 1000" },
  { name: "porcentaje", label: "Porcentaje Interés", type: "number", required: true, placeholder: "Ej. 10" },
]);

// Fields for creating a new client on the fly
const clientFields = [
  { name: "nombre", label: "Nombre Completo", type: "input", required: true, placeholder: "Ej. Juan Pérez" },
  { name: "cedula", label: "Cédula", type: "input", required: true, placeholder: "Ej. 12345678" },
  { name: "telefono", label: "Teléfono", type: "input", required: true, placeholder: "Ej. 0414-1234567" },
];

onMounted(() => {
  prestamosStore.fetchPrestamos();
  clientesStore.fetchClientes();
  tasasStore.fetchTasas();
});

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("es-VE");
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(value);
};

const calculateSaldoBolivares = (item) => {
  if (!item.saldoPendiente) return 0;
  const tasa = tasas.value.find(t => t.id == item.tasaId);

  if (!tasa || !tasa.valor) {
    return null;
  }

  return item.saldoPendiente * tasa.valor;
};

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
  
  switch (status.toLowerCase()) {
    case 'pagado': 
    case 'finalizado':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
      case 'vencido':
        return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
    default: 
      return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
  }
};

const handleView = (id) => {
  router.push(`/prestamos/${id}`);
};

const handleEdit = (id) => {
  const item = prestamos.value.find(p => p.id === id);
  if (item) {
    currentPrestamo.value = { ...item };
    isEditing.value = true;
    showCreateModal.value = true;
  }
};

const handleDelete = async (id) => {
  if (confirm("¿Estás seguro de que deseas eliminar este préstamo?")) {
    await prestamosStore.deletePrestamo(id);
    await prestamosStore.fetchPrestamos(); // Recargar lista
  }
};

const openCreateModal = () => {
  currentPrestamo.value = {};
  isEditing.value = false;
  showCreateModal.value = true;
  // Ensure we have latest clients
  if (clientes.value.length === 0) {
    clientesStore.fetchClientes();
  }
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  currentPrestamo.value = {};
  isEditing.value = false;
};

const openClientModal = () => {
  showClientModal.value = true;
};

const closeClientModal = () => {
  showClientModal.value = false;
};

const handleClientSubmit = async (formData) => {
  clientFormLoading.value = true;
  try {
    const newClient = await clientesStore.createCliente(formData);
    await clientesStore.fetchClientes();
    
    // Auto-select the new client
    if (newClient && newClient.id) {
      currentPrestamo.value = { 
        ...currentPrestamo.value, 
        clienteId: newClient.id 
      };
    }
    
    closeClientModal();
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    alert("Error al registrar cliente");
  } finally {
    clientFormLoading.value = false;
  }
};

const handleFormSubmit = async (formData) => {
  // STRICT VALIDATION: Ensure we are sending the ID
  if (!formData.clienteId) {
    alert("Debe seleccionar un cliente válido de la lista.");
    return;
  }

  formLoading.value = true;
  try {
    // We are ensuring that only the ID is sent, as expected by the backend
    // Ensure numbers are numbers
    const payload = { 
      ...formData,
      montoPrestado: Number(formData.montoPrestado),
      porcentaje: Number(formData.porcentaje)
    };
    
    console.log("Enviando payload:", payload);

    if (isEditing.value) {
      await prestamosStore.updatePrestamo(currentPrestamo.value.id, payload);
    } else {
      await prestamosStore.createPrestamo(payload);
    }
    await prestamosStore.fetchPrestamos();
    closeCreateModal();
  } catch (error) {
    console.error("Error al guardar préstamo:", error);
    if (error.response) {
       console.error("Detalles del error (response):", JSON.stringify(error.response.data, null, 2));
       console.error("Status:", error.response.status);
    }
    alert("Error al guardar préstamo. Revisa la consola para más detalles.");
  } finally {
    formLoading.value = false;
  }
};
</script>
