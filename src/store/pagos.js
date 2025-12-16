import { defineStore } from "pinia";
import api from "../services/api";

export const usePagosStore = defineStore("pagos", {
  state: () => ({
    pagos: [],
    loading: false,
    currentPagos: [] // For storing payments of a specific loan if needed
  }),

  actions: {
    // 1. Obtener pagos globales con filtros
    async fetchPagos(filters = {}) {
      this.loading = true;
      try {
        const { data } = await api.get("/pagos", { params: filters });
        this.pagos = data;
      } catch (error) {
        console.error("Error fetching pagos:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 2. Obtener pagos de un préstamo específico
    async fetchPagosByPrestamo(prestamoId) {
      this.loading = true;
      try {
        const { data } = await api.get(`/prestamos/${prestamoId}/pagos`);
        this.currentPagos = data;
        return data; // Return data for local usage if needed
      } catch (error) {
        console.error("Error fetching pagos by prestamo:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 3. Registrar pago
    async createPago(payload) {
      this.loading = true;
      try {
        const res = await api.post("/pagos", payload);
        return res.data;
      } catch (error) {
        console.error("Error creating pago:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Helper redundant but requested "obtener pagos globales"
    async fetchPagosGlobales() {
      return this.fetchPagos();
    }
  }
});
