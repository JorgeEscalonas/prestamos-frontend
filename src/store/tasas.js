import { defineStore } from 'pinia'

export const useTasasStore = defineStore('tasas', {
  state: () => ({
    tasas: [],
    tasaActual: null,
    loading: false
  }),

  actions: {
    // fetchTasas, setTasa, updateTasa...
  }
})
