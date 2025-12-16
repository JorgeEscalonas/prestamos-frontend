<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">


      <!-- Actions Bar -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {{ paginatedPagos.length }} de {{ pagos.length }} pagos
        </div>
        
        <button
          @click="openCreateModal"
          class="inline-flex items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
        >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
            </svg>
          </span>
          Registrar Pago
        </button>
      </div>

      <!-- Table Section -->
      <ComponentCard title="Historial de Pagos">
        <DataTable :columns="columns" :data="paginatedPagos">
           <!-- Custom Cell Renderers -->
           <template #cell-cliente="{ item }">
              <span class="text-gray-800 dark:text-white font-medium">
                  {{ getClientName(item.prestamoId) }}
              </span>
           </template>

           <template #cell-monto="{ item }">
              <span class="font-semibold text-green-600 dark:text-green-400">
                  {{ formatCurrency(item.monto, 'USD') }}
              </span>
           </template>

           <template #cell-montoBs="{ item }">
              <div v-if="currentTasa">
                <span class="font-semibold text-blue-600 dark:text-blue-400">
                  {{ formatCurrency(item.monto * currentTasa.valor, 'VES') }}
                </span>
              </div>
           </template>

           <template #cell-fechaPago="{ item }">
              {{ formatDate(item.fechaPago) }}
           </template>
           
           <template #cell-createdAt="{ item }">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(item.createdAt) }}
              </span>
           </template>

           <template #cell-actions="{ item }">
             <div class="flex items-center justify-end gap-2">
               <button
                 @click="handleViewDetails(item)"
                 class="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                 title="Ver Detalles"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                   <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
               </button>
               <button
                 @click="handleEdit(item)"
                 class="text-gray-500 hover:text-success-500 dark:text-gray-400 dark:hover:text-success-400"
                 title="Editar"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                 </svg>
               </button>
               <button
                 @click="handleDelete(item)"
                 class="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
                 title="Eliminar"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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

    <!-- Create/Edit Payment Modal -->
    <Modal v-if="showCreateModal" :fullScreenBackdrop="true" @close="closeCreateModal">
      <template #body>
        <div class="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-10">
          
          <!-- Header -->
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
              {{ confirmStep ? 'Confirmar Pago' : (isEditing ? 'Editar Pago' : 'Registrar Nuevo Pago') }}
            </h3>
            <button
              @click="closeCreateModal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Step 1: Data Form -->
          <div v-if="!confirmStep">
              <DataForm
                :fields="pagoFields"
                :initial-values="initialFormValues"
                :loading="loadingAction"
                @change="handleFormChange"
                @submit="handlePreSubmit"
                @cancel="closeCreateModal"
              >
                 <!-- Custom Slot: Loan Details -->
                 <template #loanStatus="{ formData }">
                    <div v-if="getLoanDetails(formData.prestamoId)" class="p-4 mb-4 text-sm rounded-lg border-2 border-blue-200 bg-blue-50 dark:bg-gray-800 dark:border-blue-800">
                      <div class="flex justify-between items-center mb-2">
                        <span class="font-medium text-blue-800 dark:text-blue-300">Saldo Pendiente:</span>
                        <span class="font-bold text-lg text-blue-900 dark:text-blue-200">{{ formatCurrency(getLoanDetails(formData.prestamoId).saldoPendiente, 'USD') }}</span>
                      </div>
                      <div class="flex justify-between items-center text-xs text-blue-700 dark:text-blue-400">
                        <span>Total del Préstamo:</span>
                        <span>{{ formatCurrency(getLoanDetails(formData.prestamoId).montoTotal, 'USD') }}</span>
                      </div>
                      
                      <!-- Progress Bar -->
                      <div class="mt-3">
                        <div class="flex justify-between text-xs mb-1 text-blue-700 dark:text-blue-400">
                          <span>Progreso del Pago</span>
                          <span>{{ calculatePaymentProgress(getLoanDetails(formData.prestamoId)) }}%</span>
                        </div>
                        <div class="w-full bg-blue-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div 
                            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                            :style="{ width: calculatePaymentProgress(getLoanDetails(formData.prestamoId)) + '%' }"
                          ></div>
                        </div>
                      </div>



                      <div v-if="currentTasa" class="flex justify-between items-center mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                        <span class="text-xs text-blue-700 dark:text-blue-400">Tasa del día:</span>
                        <span class="font-bold text-xs text-blue-900 dark:text-blue-200">{{ currentTasa.valor }} Bs/USD</span>
                      </div>
                    </div>
                 </template>

                 <!-- Validation Warnings -->
                 <template #warnings="{ formData }">
                   <div v-if="showValidationWarning(formData)" class="p-3 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                     <div class="flex items-start gap-2">
                       <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                         <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                       </svg>
                       <div>
                         <p class="font-medium">⚠️ Advertencia</p>
                         <p class="mt-1">{{ getValidationWarning(formData) }}</p>
                       </div>
                     </div>
                   </div>
                 </template>
              </DataForm>
          </div>

          <!-- Step 2: Confirmation -->
          <div v-else class="space-y-4">
              <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">Resumen del Pago</h4>
                  <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li class="flex justify-between">
                          <span>Cliente:</span>
                          <span class="font-medium text-gray-900 dark:text-white">{{ getClientName(pendingPayload.prestamoId) }}</span>
                      </li>
                      <li class="flex justify-between">
                          <span>Monto a Pagar:</span>
                          <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(pendingPayload.monto, 'USD') }}</span>
                      </li>
                      <li v-if="currentTasa" class="flex justify-between">
                          <span>Equivalente en Bs:</span>
                          <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(pendingPayload.monto * currentTasa.valor, 'VES') }}</span>
                      </li>
                      <li class="flex justify-between">
                          <span>Fecha de Pago:</span>
                          <span>{{ formatDate(pendingPayload.fechaPago) }}</span>
                      </li>
                      <li v-if="willCompleteLoan(pendingPayload)" class="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                          <span class="text-green-600 dark:text-green-400 font-medium">✅ Este pago liquidará el préstamo</span>
                      </li>
                  </ul>
              </div>

              <div class="flex justify-end gap-3 pt-4">
                  <button
                    @click="confirmStep = false"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    @click="confirmPayment"
                    :disabled="loadingAction"
                     class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                     <span v-if="loadingAction" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                     {{ isEditing ? 'Actualizar Pago' : 'Confirmar Pago' }}
                  </button>
              </div>
          </div>

        </div>
      </template>
    </Modal>

    <!-- View Details Modal -->
    <Modal v-if="showDetailsModal" :fullScreenBackdrop="true" @close="closeDetailsModal">
      <template #body>
        <div class="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-10">
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
              Detalles del Pago #{{ selectedPago?.id }}
            </h3>
            <button
              @click="closeDetailsModal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedPago" class="space-y-6">
            <!-- Payment Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p class="text-xs text-blue-600 dark:text-blue-400 mb-1">Monto Pagado (USD)</p>
                <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ formatCurrency(selectedPago.monto, 'USD') }}</p>
              </div>
              <div v-if="currentTasa" class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p class="text-xs text-green-600 dark:text-green-400 mb-1">Equivalente en Bs</p>
                <p class="text-2xl font-bold text-green-900 dark:text-green-100">{{ formatCurrency(selectedPago.monto * currentTasa.valor, 'VES') }}</p>
              </div>
            </div>

            <!-- Client and Loan Info -->
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Información del Cliente y Préstamo</h4>
              <dl class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <dt class="text-gray-600 dark:text-gray-400">Cliente:</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">{{ getClientName(selectedPago.prestamoId) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-600 dark:text-gray-400">Préstamo ID:</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">#{{ selectedPago.prestamoId }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-600 dark:text-gray-400">Fecha de Pago:</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedPago.fechaPago) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-600 dark:text-gray-400">Registrado el:</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedPago.createdAt) }}</dd>
                </div>
                <div v-if="selectedPago.updatedAt && selectedPago.updatedAt !== selectedPago.createdAt" class="flex justify-between">
                  <dt class="text-gray-600 dark:text-gray-400">Última modificación:</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedPago.updatedAt) }}</dd>
                </div>
              </dl>
            </div>

            <!-- Loan Payment History -->
            <div v-if="loanPaymentHistory.length > 0" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Historial de Pagos del Préstamo</h4>
              <div class="space-y-2">
                <div 
                  v-for="(pago, index) in loanPaymentHistory" 
                  :key="pago.id"
                  class="flex items-center gap-3 p-2 rounded"
                  :class="pago.id === selectedPago.id ? 'bg-blue-100 dark:bg-blue-900/30' : ''"
                >
                  <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(pago.monto, 'USD') }}
                      <span v-if="pago.id === selectedPago.id" class="ml-2 text-xs text-blue-600 dark:text-blue-400">(Este pago)</span>
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(pago.fechaPago) }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Payment Progress for Loan -->
              <div class="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600 dark:text-gray-400">Progreso Total del Préstamo</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ calculateLoanProgress(selectedPago.prestamoId) }}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-600">
                  <div 
                    class="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300" 
                    :style="{ width: calculateLoanProgress(selectedPago.prestamoId) + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="closeDetailsModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
              <button
                @click="handleEditFromDetails"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Editar Pago
              </button>
            </div>
          </div>
        </div>
      </template>
    </Modal>

  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import ComponentCard from '@/components/common/ComponentCard.vue';
import DataTable from '@/components/tables/DataTable.vue';
import Modal from '@/components/ui/Modal.vue';
import DataForm from '@/components/Forms/DataForm.vue';

// Stores
import { usePagosStore } from '@/store/pagos';
import { usePrestamosStore } from '@/store/prestamos';
import { useClientesStore } from '@/store/clientes';
import { useTasasStore } from '@/store/tasas';

const currentPageTitle = ref('Gestión de Pagos');

const pagosStore = usePagosStore();
const prestamosStore = usePrestamosStore();
const clientesStore = useClientesStore();
const tasasStore = useTasasStore();

const { pagos } = storeToRefs(pagosStore);
const { prestamos } = storeToRefs(prestamosStore);
const { clientes } = storeToRefs(clientesStore);
const { tasas } = storeToRefs(tasasStore);

// State
const showCreateModal = ref(false);
const showDetailsModal = ref(false);
const confirmStep = ref(false);
const loadingAction = ref(false);
const isEditing = ref(false);
const currentFormState = ref({});
const initialFormValues = ref({});
const pendingPayload = ref({});
const selectedPago = ref(null);
const loanPaymentHistory = ref([]);



// Pagination
const pagination = ref({
  currentPage: 1,
  perPage: 25
});

const currentTasa = computed(() => {
    return tasas.value.find(t => t.monedaOrigen === 'USD' && t.monedaDestino === 'VES') || tasas.value[0];
});

// Table columns
const columns = [
  { key: 'id', label: 'ID', headerClass: 'w-1/12' },
  { key: 'cliente', label: 'Cliente', headerClass: 'w-3/12' },
  { key: 'monto', label: 'Monto (USD)', headerClass: 'w-2/12' },
  { key: 'montoBs', label: 'Monto (Bs)', headerClass: 'w-2/12' },
  { key: 'fechaPago', label: 'Fecha de Pago', headerClass: 'w-2/12' },
  { key: 'createdAt', label: 'Registrado', headerClass: 'w-1/12' },
  { key: 'actions', label: 'Acciones', headerClass: 'w-1/12 text-right' },
];

// Active Loans for Dropdown
const activePrestamosOptions = computed(() => {
    return prestamos.value
        .filter(p => Number(p.saldoPendiente) > 0)
        .map(p => {
             const c = clientes.value.find(cli => cli.id === p.clienteId);
             const cName = c ? `${c.nombre} (${c.cedula})` : `Cliente #${p.clienteId}`;
             return {
                 label: `${cName} - Restante: ${formatCurrency(p.saldoPendiente, 'USD')}`,
                 value: p.id
             };
        });
});

// Computed Fields
const pagoFields = computed(() => {
    const fields = [
        { 
            name: "prestamoId", 
            label: "Préstamo", 
            type: "select", 
            required: true, 
            options: activePrestamosOptions.value,
            placeholder: "Seleccione un préstamo",
            disabled: isEditing.value, // No permitir cambiar el préstamo al editar
            class: 'col-span-1 sm:col-span-2'
        },
        { name: "loanStatus", type: "slot", class: 'col-span-1 sm:col-span-2' },
        { name: "warnings", type: "slot", class: 'col-span-1 sm:col-span-2' },
        { name: "monto", label: "Monto ($ USD)", type: "number", inputType: "number", required: true, placeholder: "0.00", step: "0.01" },
        { name: "fechaPago", label: "Fecha de Pago", type: "date", inputType: "date", required: true, max: new Date().toISOString().split('T')[0] }
    ];

    return fields;
});

// Sorted Pagos Data
const sortedPagos = computed(() => {
  let result = [...pagos.value];
  // Sort by date (newest first)
  result.sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago));
  return result;
});

const totalPages = computed(() => {
  return Math.ceil(sortedPagos.value.length / pagination.value.perPage);
});

const paginatedPagos = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.perPage;
  const end = start + pagination.value.perPage;
  return sortedPagos.value.slice(start, end);
});

onMounted(async () => {
    await Promise.all([
        pagosStore.fetchPagos(),
        prestamosStore.fetchPrestamos(),
        clientesStore.fetchClientes(),
        tasasStore.fetchTasas()
    ]);
});

// Helpers
const getClientName = (prestamoId) => {
    const prestamo = prestamos.value.find(p => p.id == prestamoId);
    if (!prestamo) return 'Préstamo #' + prestamoId;
    
    const client = clientes.value.find(c => c.id === prestamo.clienteId);
    return client ? client.nombre : 'Desconocido';
};

const getLoanDetails = (id) => {
    return prestamos.value.find(p => p.id == id);
};

const formatCurrency = (val, curr) => {
    return new Intl.NumberFormat('es-VE', { style: 'currency', currency: curr }).format(val || 0);
};

const formatDate = (date) => {
    if(!date) return '-';
    if (typeof date === 'string' && date.includes('-')) {
         const [y, m, d] = date.split('T')[0].split('-');
         return `${d}/${m}/${y}`;
    }
    return new Date(date).toLocaleDateString('es-VE');
};

const calculatePaymentProgress = (loan) => {
  if (!loan || !loan.montoTotal) return 0;
  const paid = loan.montoTotal - loan.saldoPendiente;
  return Math.round((paid / loan.montoTotal) * 100);
};

const calculateLoanProgress = (prestamoId) => {
  const loan = getLoanDetails(prestamoId);
  return calculatePaymentProgress(loan);
};



// Validation helpers
const showValidationWarning = (formData) => {
  if (!formData.prestamoId || !formData.monto) return false;
  const loan = getLoanDetails(formData.prestamoId);
  if (!loan) return false;
  
  const amount = Number(formData.monto);
  const pending = Number(loan.saldoPendiente);
  
  return amount > pending || amount <= 0;
};

const getValidationWarning = (formData) => {
  if (!formData.prestamoId || !formData.monto) return '';
  const loan = getLoanDetails(formData.prestamoId);
  if (!loan) return '';
  
  const amount = Number(formData.monto);
  const pending = Number(loan.saldoPendiente);
  
  if (amount <= 0) {
    return 'El monto debe ser mayor a 0';
  }
  
  if (amount > pending) {
    const excess = amount - pending;
    return `El monto excede el saldo pendiente en ${formatCurrency(excess, 'USD')}. El saldo pendiente es ${formatCurrency(pending, 'USD')}.`;
  }
  
  return '';
};

const willCompleteLoan = (payload) => {
  const loan = getLoanDetails(payload.prestamoId);
  if (!loan) return false;
  
  const remaining = Number(loan.saldoPendiente) - Number(payload.monto);
  return remaining <= 0.01; // Tolerance of 1 cent
};



// Actions
const openCreateModal = async () => {
    initialFormValues.value = {
        monto: 0,
        fechaPago: new Date().toISOString().split('T')[0]
    };
    currentFormState.value = { ...initialFormValues.value };
    isEditing.value = false;
    showCreateModal.value = true;
    confirmStep.value = false;
    
    if(prestamos.value.length === 0) await prestamosStore.fetchPrestamos();
};

const closeCreateModal = () => {
    showCreateModal.value = false;
    confirmStep.value = false;
    isEditing.value = false;
    pendingPayload.value = {};
};

const handleFormChange = (newData) => {
    if (newData.prestamoId !== currentFormState.value.prestamoId) {
        newData.monto = 0;
    }
    currentFormState.value = { ...newData };
};

const handlePreSubmit = (formData) => {
    const loan = getLoanDetails(formData.prestamoId);
    if (!loan) return alert("Seleccione un préstamo válido");

    const amountUsd = Number(formData.monto);
    const pending = Number(loan.saldoPendiente);

    // Validation
    if (amountUsd <= 0) {
        alert("El monto debe ser mayor a 0");
        return;
    }

    if (amountUsd > pending + 0.05) {
        alert(`El monto excede el saldo pendiente (${formatCurrency(pending, 'USD')}). Exceso: ${formatCurrency(amountUsd - pending, 'USD')}`);
        return;
    }

    // Validate date is not in the future
    const paymentDate = new Date(formData.fechaPago);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (paymentDate > today) {
        alert("La fecha de pago no puede ser futura");
        return;
    }

    // Prepare payload
    pendingPayload.value = {
        prestamoId: formData.prestamoId,
        monto: amountUsd,
        fechaPago: formData.fechaPago
    };

    confirmStep.value = true;
};

const confirmPayment = async () => {
    loadingAction.value = true;
    try {
        if (isEditing.value) {
            await pagosStore.updatePago(selectedPago.value.id, pendingPayload.value);
            alert('Pago actualizado exitosamente');
        } else {
            await pagosStore.createPago(pendingPayload.value);
            alert('Pago registrado exitosamente');
        }
        
        await pagosStore.fetchPagos();
        await prestamosStore.fetchPrestamos();
        
        closeCreateModal();
    } catch (error) {
        console.error("Error saving payment", error);
        alert('Error al guardar el pago');
    } finally {
        loadingAction.value = false;
    }
};

const handleEdit = async (item) => {
  selectedPago.value = item;
  isEditing.value = true;
  
  initialFormValues.value = {
    prestamoId: item.prestamoId,
    monto: item.monto,
    fechaPago: item.fechaPago.split('T')[0]
  };
  
  currentFormState.value = { ...initialFormValues.value };
  showCreateModal.value = true;
  confirmStep.value = false;
};

const handleDelete = async (item) => {
  const loan = getLoanDetails(item.prestamoId);
  const clientName = getClientName(item.prestamoId);
  
  const confirmed = confirm(
    `¿Está seguro de eliminar este pago?\n\n` +
    `Cliente: ${clientName}\n` +
    `Monto: ${formatCurrency(item.monto, 'USD')}\n` +
    `Fecha: ${formatDate(item.fechaPago)}\n\n` +
    `⚠️ ADVERTENCIA: El saldo del préstamo se revertirá aumentando en ${formatCurrency(item.monto, 'USD')}`
  );
  
  if (!confirmed) return;
  
  loadingAction.value = true;
  try {
    await pagosStore.deletePago(item.id);
    await pagosStore.fetchPagos();
    await prestamosStore.fetchPrestamos();
    alert('Pago eliminado exitosamente');
  } catch (error) {
    console.error("Error deleting payment", error);
    alert('Error al eliminar el pago');
  } finally {
    loadingAction.value = false;
  }
};

const handleViewDetails = async (item) => {
  selectedPago.value = item;
  
  // Fetch payment history for this loan
  try {
    loanPaymentHistory.value = await pagosStore.fetchPagosByPrestamo(item.prestamoId);
  } catch (error) {
    console.error("Error fetching loan payment history", error);
    loanPaymentHistory.value = [];
  }
  
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedPago.value = null;
  loanPaymentHistory.value = [];
};

const handleEditFromDetails = () => {
  closeDetailsModal();
  handleEdit(selectedPago.value);
};


</script>
