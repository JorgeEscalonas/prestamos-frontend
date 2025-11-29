import { defineStore } from 'pinia'

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    clientes: [],
    cliente: null,
    loading: false
  }),

  actions: {
    // fetchClientes, fetchClienteById, createCliente...
  }
})
