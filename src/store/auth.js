import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        loading: false
    }),
    actions: {

        async login(credentials) {
            this.loading = true
            try {
                const { data } = await api.post('/auth/login', credentials)
                this.token = data.token
                this.user = data.user
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.user = null
            this.token = null
        }
    }
})
