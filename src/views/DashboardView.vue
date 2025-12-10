<template>
  <MainLayout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics />
        <monthly-sale />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-target />
      </div>

      <div class="col-span-12">
        <statistics-chart />
      </div>

      <div class="col-span-12 xl:col-span-5">
        <!-- <customer-demographic /> -->
      </div>

      <div class="col-span-12 xl:col-span-7">
        <recent-orders />
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
</script>

