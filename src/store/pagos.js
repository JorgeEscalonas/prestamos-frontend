import { defineStore } from 'pinia'

export const usePagosStore = defineStore('pagos', {
  state: () => ({
    pagos: [],
    pago: null,
    loading: false
  }),

  actions: {
    // fetchPagos, createPago, etc.
  }
})
