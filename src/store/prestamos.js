import { defineStore } from "pinia";
import api from "../services/api";

export const usePrestamosStore = defineStore("prestamos", {
  state: () => ({
    prestamos: [],
    loading: false,
    page: 1,
    totalPages: 1,
  }),

  actions: {
    async fetchPrestamos(params = {}) {
      this.loading = true;
      try {
        const { data } = await api.get("/prestamos", { params });
        if (Array.isArray(data)) {
          this.prestamos = data;
          this.totalPages = 1;
        } else {
          this.prestamos = data.items || [];
          this.totalPages = data.totalPages || 1;
        }
      } finally {
        this.loading = false;
      }
    },

    async createPrestamo(payload) {
      // Reglas automáticas: El cálculo de monto total y saldo se maneja en el backend/API
      await api.post("/prestamos", payload);
    },

    async updatePrestamo(id, payload) {
      let dataToSend = { ...payload };

      // Regla automática: Estado cambia a "pagado" si saldo llega a cero
      if (dataToSend.saldoPendiente !== undefined) {
        if (parseFloat(dataToSend.saldoPendiente) <= 0) {
          dataToSend.estado = "pagado";
          dataToSend.saldoPendiente = 0;
        }
      }

      await api.put(`/prestamos/${id}`, dataToSend);
    },

    async deletePrestamo(id) {
      await api.delete(`/prestamos/${id}`);
    },

    async getPrestamo(id) {
      const { data } = await api.get(`/prestamos/${id}`);
      return data;
    },

    async getPagosByPrestamo(id) {
      const { data } = await api.get(`/prestamos/${id}/pagos`);
      return data;
    }
  }
});
