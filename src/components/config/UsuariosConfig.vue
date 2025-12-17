<template>
  <ComponentCard title="Gestión de Usuarios">
    <template #actions>
      <button
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition-all"
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
        Nuevo Usuario
      </button>
    </template>

    <DataTable :columns="columns" :data="filteredUsuarios" :showPagination="true">
      
      <!-- Slot para Rol con Badges -->
      <template #cell-rol="{ item }">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
          :class="[
            item.rol === 'admin' 
              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' 
              : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
          ]"
        >
          {{ formatRole(item.rol) }}
        </span>
      </template>

      <template #cell-nivel_acceso="{ item }">
        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            class="sr-only peer" 
            :checked="item.rol === 'admin'"
            :disabled="authStore.user?.rol !== 'admin'"
            @change="toggleRole(item)"
          >
          <div 
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            :class="{ 'opacity-50 cursor-not-allowed': authStore.user?.rol !== 'admin' }"
          ></div>
          <span 
            class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
            :class="{ 'opacity-50': authStore.user?.rol !== 'admin' }"
          >
            {{ item.rol === 'admin' ? 'Full' : 'Restringido' }}
          </span>
        </label>
      </template>

      <!-- Slot para Fecha (opcional si existe createdAt) -->
      <!-- <template #cell-createdAt="{ item }"> ... </template> -->

      <template #cell-actions="{ item }">
        <div class="flex items-center justify-end gap-2">
          <button
            @click="editUser(item)"
            class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
            title="Editar Usuario"
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
            @click="deleteUser(item.id)"
            class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
            title="Eliminar Usuario"
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

    <Modal v-if="showModal" :fullScreenBackdrop="true" @close="close">
      <template #body>
        <div
          class="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8"
        >
          <div class="mb-8 border-b border-gray-100 pb-4 dark:border-gray-700">
             <div class="flex items-center justify-between">
                <div>
                   <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                     {{ selected?.id ? 'Editar Usuario' : 'Nuevo Usuario' }}
                   </h3>
                   <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                     Complete los datos para {{ selected?.id ? 'actualizar el' : 'registrar un nuevo' }} usuario en el sistema.
                   </p>
                </div>
                <button
                  @click="close"
                  class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
             </div>
          </div>

          <DataForm
            :fields="userFields"
            :initial-values="selected || {}"
            @submit="save"
            @cancel="close"
          />
        </div>
      </template>
    </Modal>
  </ComponentCard>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUsuariosStore } from "@/store/usuarios";
import { useAuthStore } from "@/store/auth";
import ComponentCard from "@/components/common/ComponentCard.vue";
import DataTable from "@/components/tables/DataTable.vue";
import Modal from "@/components/ui/Modal.vue";
import DataForm from "@/components/Forms/DataForm.vue";

const store = useUsuariosStore();
const authStore = useAuthStore();

const showModal = ref(false);
const selected = ref(null);

// Filtrar usuarios excluyendo al usuario actual
const filteredUsuarios = computed(() => {
  if (!store.usuarios || !authStore.user) return [];
  return store.usuarios.filter(usuario => usuario.id !== authStore.user.id);
});

const columns = [
  { key: "cedula", label: "Cédula", headerClass: "w-1/4" },
  { key: "nombre", label: "Nombre", headerClass: "w-1/4" },
  { key: "rol", label: "Rol", headerClass: "w-1/6" },
  { key: "nivel_acceso", label: "Nivel de Acceso", headerClass: "w-1/4" },
  { key: "actions", label: "Acciones", headerClass: "w-1/6 text-right" },
];

const userFields = [
  {
    name: "nombre",
    label: "Nombre Completo",
    type: "input",
    required: true,
    placeholder: "Ej. Juan Perez",
  },
  {
    name: "cedula",
    label: "Cédula",
    type: "input",
    inputType: "text",
    required: true,
    placeholder: "V-12345678",
  },
  {
    name: "password",
    label: "Contraseña",
    type: "input",
    inputType: "password",
    required: false,
    placeholder: "Dejar en blanco para mantener actual",
  },
  {
    name: "rol",
    label: "Rol de Usuario",
    type: "select",
    options: [
      { label: "Administrador (Full Acceso)", value: "admin" },
      { label: "Operador (Restringido)", value: "operador" },
    ],
    required: true,
  },
];

onMounted(() => {
  store.fetchUsuarios();
});

const formatRole = (rol) => {
  if (rol === "admin") return "Administrador";
  if (rol === "operador") return "Operador";
  return rol;
};

const openCreateModal = () => {
  selected.value = {};
  showModal.value = true;
};


const editUser = (u) => {
  selected.value = { ...u }; // Copy to avoid mutation issues
  showModal.value = true;
};

const deleteUser = async (id) => {
  if (confirm("¿Eliminar usuario?")) {
    await store.deleteUsuario(id);
  }
};

const save = async (data) => {
  if (data.id) {
    await store.updateUsuario(data);
  } else {
    await store.createUsuario(data);
  }
  close();
};

const toggleRole = async (user) => {
  // Verificar que el usuario actual sea admin
  if (authStore.user?.rol !== 'admin') {
    alert('Solo los administradores pueden cambiar el nivel de acceso de otros usuarios.');
    return;
  }

  const newRole = user.rol === 'admin' ? 'operador' : 'admin';
  
  try {
    await store.updateUsuario({
      ...user,
      rol: newRole
    });
    // La actualización se reflejará automáticamente después de fetchUsuarios en el store
  } catch (error) {
    console.error('Error completo al cambiar el rol:', error);
    
    // Mostrar mensaje más específico según el tipo de error
    let errorMessage = 'No se pudo cambiar el nivel de acceso.';
    
    if (error.response?.status === 401) {
      errorMessage = 'No tienes autorización para cambiar el nivel de acceso. Verifica tus permisos.';
    } else if (error.response?.status === 403) {
      errorMessage = 'No tienes permisos suficientes para esta acción.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(errorMessage);
  }
};

const close = () => {
  selected.value = null;
  showModal.value = false;
};
</script>
