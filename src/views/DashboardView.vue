<template>
  <MainLayout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <!-- Top Row: Metrics, Rentabilidad and Donut Chart -->
      <div class="col-span-12 xl:col-span-7 space-y-6">
        <ecommerce-metrics />
        <monthly-sale />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-target />
      </div>

      <!-- Middle Row: Main Chart -->
      <div class="col-span-12">
        <statistics-chart />
      </div>

      <!-- Bottom Row: Recent Tables (Side by Side) -->
      <div class="col-span-12 xl:col-span-7">
        <recent-orders />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <recent-payments />
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/layout/MainLayout.vue'
import EcommerceMetrics from '../components/Dashboard/EcommerceMetrics.vue'
import MonthlyTarget from '../components/Dashboard/MonthlyTarget.vue'
import MonthlySale from '../components/Dashboard/MonthlySale.vue'
import StatisticsChart from '../components/Dashboard/StatisticsChart.vue'
import RecentOrders from '../components/Dashboard/RecentOrders.vue'
import RecentPayments from '../components/Dashboard/RecentPayments.vue'
import { onMounted } from 'vue'
import { useDashboardStore } from '@/store/dashboard'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchAll()
})
</script>
