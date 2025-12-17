<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-gray-100 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200 dark:border-gray-800',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen,
        'lg:w-[90px]': !isExpanded,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/">
        <img
          v-if="isExpanded || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-if="isExpanded || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-else
          src="/images/logo/logo-icon.svg"
          alt="Logo"
          width="32"
          height="32"
        />
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-500',
                !isExpanded
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-inactive': true, 
                    },
                    !isExpanded
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active text-blue-600 dark:text-blue-500'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                          <span class="flex items-center gap-4 ml-auto">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              new
                            </span>
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/store/auth";

import {
  GridIcon,
  UserGroupIcon,
  DocsIcon,
  BarChartIcon,
  SettingsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
} from "../../icons";
import { useSidebar } from "@/composables/useSidebar";

const route = useRoute();
const authStore = useAuthStore();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const allMenuGroups = [
  {
    title: "Principal",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        path: "/dashboard",
      },
      {
        icon: UserGroupIcon,
        name: "Clientes",
        path: "/clientes",
      },
      {
        icon: DocsIcon,
        name: "Préstamos",
        path: "/prestamos",
      },
      {
        icon: BarChartIcon,
        name: "Pagos",
        path: "/pagos",
      },
    ],
  },
  {
    title: "Gestión",
    items: [
      {
        icon: SettingsIcon,
        name: "Configuración",
        subItems: [
          { name: "Tasas", path: "/config/tasas", requiresRole: "admin" },
          { name: "Usuarios", path: "/config/usuarios", requiresRole: "admin" },
        ],
      },
      {
        icon: PieChartIcon,
        name: "Reportes",
        path: "/reports",
      },
    ],
  },
];

// Filtrar menú basado en el rol del usuario
const menuGroups = computed(() => {
  const userRole = authStore.user?.rol;
  
  return allMenuGroups.map(group => ({
    ...group,
    items: group.items.map(item => {
      // Si el item tiene subItems, filtrarlos
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter(subItem => {
          // Si requiere un rol específico, verificar que el usuario lo tenga
          if (subItem.requiresRole) {
            return userRole === subItem.requiresRole;
          }
          return true;
        });
        
        // Solo mostrar el item si tiene subItems después del filtrado
        if (filteredSubItems.length > 0) {
          return { ...item, subItems: filteredSubItems };
        }
        return null;
      }
      
      // Para items sin subItems, verificar si requieren rol
      if (item.requiresRole) {
        return userRole === item.requiresRole ? item : null;
      }
      
      return item;
    }).filter(item => item !== null) // Remover items nulos
  })).filter(group => group.items.length > 0); // Remover grupos vacíos
});

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return openSubmenu.value === key;
};



// Better approach with watch:
import { watch } from 'vue';

watch(
  () => route.path,
  () => {
    menuGroups.value.forEach((group, groupIndex) => {
      group.items.forEach((item, itemIndex) => {
        if (item.subItems && item.subItems.some(sub => isActive(sub.path))) {
          openSubmenu.value = `${groupIndex}-${itemIndex}`;
        }
      });
    });
  },
  { immediate: true }
);

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>
