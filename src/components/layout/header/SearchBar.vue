<template>
  <div class="hidden lg:block relative" v-click-outside="closeResults">
    <div class="relative">
      <!-- Search Input Icon -->
      <span class="absolute -translate-y-1/2 left-4 top-1/2">
        <svg
          class="fill-gray-500 dark:fill-gray-400"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
          />
        </svg>
      </span>

      <input
        ref="searchInput"
        type="text"
        v-model="query"
        @input="handleInput"
        @keydown.down.prevent="moveHighlight(1)"
        @keydown.up.prevent="moveHighlight(-1)"
        @keydown.enter.prevent="selectHighlighted"
        @focus="showResults = true"
        placeholder="Buscar clientes, préstamos o comandos..."
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/5 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
      />

      <!-- Shortcut Hint -->
      <div
        class="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:text-gray-400"
      >
        <span> ⌘ </span>
        <span> K </span>
      </div>
    </div>

    <!-- Dropdown Results -->
    <div
      v-if="showResults && (filteredResults.length > 0 || query.length > 0)"
      class="absolute left-0 mt-2 w-full max-h-[400px] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 z-50 py-2 no-scrollbar"
    >
      <div v-if="filteredResults.length === 0" class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        No se encontraron resultados para "{{ query }}"
      </div>
      
      <div v-else>
        <template v-for="(group, gIndex) in groupedResults" :key="group.label">
          <div v-if="group.items.length > 0">
            <div class="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {{ group.label }}
            </div>
            
            <div 
              v-for="(item, iIndex) in group.items" 
              :key="item.id || item.action"
              @click="handleSelect(item)"
              @mouseenter="highlightedIndex = item.globalIndex"
              :class="[
                'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors',
                highlightedIndex === item.globalIndex 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
              ]"
            >
              <component :is="item.icon" class="w-4 h-4 opacity-70" />
              <div class="flex flex-col overflow-hidden">
                <span class="text-sm font-medium truncate">{{ item.title }}</span>
                <span v-if="item.subtitle" class="text-xs opacity-60 truncate">{{ item.subtitle }}</span>
              </div>
              <span v-if="item.badge" class="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 uppercase font-bold">
                {{ item.badge }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useClientesStore } from '@/store/clientes'
import { usePrestamosStore } from '@/store/prestamos'
import { usePagosStore } from '@/store/pagos'
import { 
  UserCircleIcon, 
  DocsIcon, 
  PlusIcon, 
  PieChartIcon,
  BarChartIcon,
  HomeIcon
} from '@/icons'

const router = useRouter()
const clientesStore = useClientesStore()
const prestamosStore = usePrestamosStore()
const pagosStore = usePagosStore()

const searchInput = ref(null)
const query = ref('')
const showResults = ref(false)
const highlightedIndex = ref(0)

// Comandos estáticos
const COMMANDS = [
  { 
    title: 'Ir al Dashboard', 
    subtitle: 'Resumen general y métricas', 
    icon: HomeIcon, 
    action: 'redirect', 
    path: '/dashboard',
    type: 'comando',
    badge: 'CMD'
  },
  { 
    title: 'Nueva Cuota/Pago', 
    subtitle: 'Registrar un nuevo abono a préstamo', 
    icon: PlusIcon, 
    action: 'redirect', 
    path: '/pagos?action=new',
    type: 'comando',
    badge: 'CMD'
  },
  { 
    title: 'Nuevo Préstamo', 
    subtitle: 'Crear una nueva solicitud de crédito', 
    icon: PlusIcon, 
    action: 'redirect', 
    path: '/prestamos?action=new',
    type: 'comando',
    badge: 'CMD'
  },
  { 
    title: 'Ver Reportes', 
    subtitle: 'Ir al centro de estadísticas y PDFs', 
    icon: PieChartIcon, 
    action: 'redirect', 
    path: '/reports',
    type: 'comando',
    badge: 'CMD'
  }
]

// Fetch data on mount
onMounted(() => {
  clientesStore.fetchClientes()
  prestamosStore.fetchPrestamos()
  pagosStore.fetchPagos()
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

const handleGlobalKeydown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    searchInput.value?.focus()
  }
}

const handleInput = () => {
  showResults.value = true
  highlightedIndex.value = 0
}

const closeResults = () => {
  showResults.value = false
}

// Lógica de filtrado
const filteredResults = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return []

  const results = []

  // 1. Filtrar Comandos
  COMMANDS.forEach(cmd => {
    if (cmd.title.toLowerCase().includes(q) || cmd.subtitle.toLowerCase().includes(q)) {
      results.push(cmd)
    }
  })

  // 2. Filtrar Clientes
  clientesStore.clientes.forEach(c => {
    if (c.nombre.toLowerCase().includes(q) || c.cedula.includes(q)) {
      results.push({
        title: c.nombre,
        subtitle: `C.I: ${c.cedula}`,
        icon: UserCircleIcon,
        path: `/clientes/${c.id}`,
        type: 'cliente'
      })
    }
  })

  // 3. Filtrar Préstamos
  prestamosStore.prestamos.forEach(p => {
    const cliente = clientesStore.clientes.find(c => c.id === p.clienteId)
    const clienteNombre = cliente ? cliente.nombre.toLowerCase() : ''
    
    if (p.id.toString().includes(q) || clienteNombre.includes(q)) {
      results.push({
        title: `Préstamo #${p.id}`,
        subtitle: `Deudor: ${cliente?.nombre || 'Desconocido'} - Saldo: $${p.saldoPendiente}`,
        icon: DocsIcon,
        path: `/prestamos/${p.id}`,
        type: 'prestamo'
      })
    }
  })

  // 4. Filtrar Pagos por Referencia
  pagosStore.pagos.forEach(pg => {
    if (pg.referencia && pg.referencia.toLowerCase().includes(q)) {
      results.push({
        title: `Pago Ref: ${pg.referencia}`,
        subtitle: `Monto: $${pg.monto} - Préstamo #${pg.prestamoId}`,
        icon: BarChartIcon,
        path: `/prestamos/${pg.prestamoId}`,
        type: 'pago'
      })
    }
  })

  return results.slice(0, 10).map((item, index) => ({ ...item, globalIndex: index }))
})

// Agrupar resultados para mejor UI
const groupedResults = computed(() => {
  const groups = [
    { label: 'Acciones y Comandos', items: filteredResults.value.filter(r => r.type === 'comando') },
    { label: 'Clientes', items: filteredResults.value.filter(r => r.type === 'cliente') },
    { label: 'Préstamos', items: filteredResults.value.filter(r => r.type === 'prestamo') },
    { label: 'Pagos', items: filteredResults.value.filter(r => r.type === 'pago') }
  ]
  return groups
})

const moveHighlight = (delta) => {
  const max = filteredResults.value.length
  if (max === 0) return
  highlightedIndex.value = (highlightedIndex.value + delta + max) % max
}

const handleSelect = (item) => {
  if (item.path) {
    router.push(item.path)
  }
  query.value = ''
  showResults.value = false
}

const selectHighlighted = () => {
  const item = filteredResults.value.find(r => r.globalIndex === highlightedIndex.value)
  if (item) handleSelect(item)
}

// Directive for click outside
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
