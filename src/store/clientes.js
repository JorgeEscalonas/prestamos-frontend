import { defineStore } from "pinia";
import api from "../services/api";

export const useClientesStore = defineStore("clientes", {
  state: () => ({
    clientes: [],
    page: 1,
    totalPages: 1,
    loading: false
  }),

  actions: {
    async fetchClientes(params = {}) {
      this.loading = true;
      try {
        const { data } = await api.get("/clientes", { params });
        if (Array.isArray(data)) {
          this.clientes = data;
          this.totalPages = 1;
        } else {
          this.clientes = data.items || [];
          this.totalPages = data.totalPages || 1;
        }
      } finally {
        this.loading = false;
      }
    },

    async createCliente(payload) {
      await api.post("/clientes", payload);
    },

    async updateCliente(id, payload) {
      await api.put(`/clientes/${id}`, payload);
    },

    async deleteCliente(id) {
      await api.delete(`/clientes/${id}`);
    },

    async getCliente(id) {
      const { data } = await api.get(`/clientes/${id}`);
      return data;
    },

    async getPrestamosByCliente(id) {
      const { data } = await api.get(`/clientes/${id}/prestamos`);
      return data;
    }
  }
});
