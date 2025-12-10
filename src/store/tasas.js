import { defineStore } from 'pinia';
import api from '../services/api';

export const useTasasStore = defineStore('tasas', {
  state: () => ({
    tasas: [],
    loading: false
  }),

  actions: {
    async fetchTasas() {
      this.loading = true;
      try {
        const { data } = await api.get('/tasas');
        this.tasas = data;
      } catch (error) {
        console.error("Error fetching tasas:", error);
      } finally {
        this.loading = false;
      }
    }
  }
});
