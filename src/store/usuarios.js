import { defineStore } from "pinia";
import api from "../services/api";

export const useUsuariosStore = defineStore("usuarios", {
  state: () => ({
    usuarios: [],
    loading: false
  }),

  actions: {
    async fetchUsuarios() {
      const { data } = await api.get("/usuarios");
      this.usuarios = data;
    },

    async createUsuario(payload) {
      await api.post("/usuarios", payload);
      await this.fetchUsuarios();
    },

    async updateUsuario(payload) {
      await api.put(`/usuarios/${payload.id}`, payload);
      await this.fetchUsuarios();
    },

    async deleteUsuario(id) {
      await api.delete(`/usuarios/${id}`);
      await this.fetchUsuarios();
    }
  }
});
