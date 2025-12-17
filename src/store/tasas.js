import { defineStore } from 'pinia';
import api from '../services/api';
import axios from 'axios';

export const useTasasStore = defineStore('tasas', {
  state: () => ({
    tasas: [],
    tasaBCV: null,
    loading: false
  }),

  getters: {
    tasaActual: (state) => {
      if (!state.tasas || state.tasas.length === 0) return null;
      // Assuming the API returns the most recent one first or last. 
      // Safest is to sort by ID or createdAt if available, but for now let's assume index 0 is latest 
      // or we can sort if we knew the structure. Let's assume the array needs sorting or is sorted.
      // Usually simple APIs return list. Let's return the first one for now as "current".
      return state.tasas[0];
    }
  },

  actions: {
    async fetchTasas() {
      this.loading = true;
      try {
        const { data } = await api.get('/tasas');
        // Sort descending by ID or Date to ensure index 0 is latest
        this.tasas = data.sort((a, b) => new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha));
      } catch (error) {
        console.error("Error fetching tasas:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchTasaBCV() {
      try {
        // Intentar obtener de API pública para facilitar uso
        const response = await axios.get('https://ve.dolarapi.com/v1/dolares/oficial');
        if (response.data && response.data.promedio) {
          this.tasaBCV = {
            valor: response.data.promedio,
            lastUpdate: response.data.fechaActualizacion,
            source: 'BCV'
          };
        }
      } catch (error) {
        console.warn("No se pudo obtener tasa BCV externa, intentando backend local o fallando silenciosamente", error);
      }
    },

    async updateTasa(valor) {
      await api.post("/tasas", { valor });
      await this.fetchTasas();
    }
  }
});
