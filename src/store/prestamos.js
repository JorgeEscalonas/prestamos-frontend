import { defineStore } from 'pinia'

export const usePrestamosStore = defineStore('prestamos', {
  state: () => ({
    prestamos: [],
    prestamo: null,
    loading: false
  }),

  actions: {
    // fetchPrestamos, createPrestamo, updatePrestamo, etc.
  }
})
