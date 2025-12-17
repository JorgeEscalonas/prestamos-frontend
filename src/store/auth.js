import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false
    }),
    getters: {
        isAuthenticated: (state) => !!state.token
    },
    actions: {

        async updateProfile(payload) {
            this.loading = true
            try {
                // Generar los datos para actualizar, excluyendo campos sensibles si no se envían
                const updateData = { ...payload }
                if (!updateData.password) delete updateData.password

                await api.put(`/usuarios/${this.user.id}`, updateData)

                // Actualizar el estado local y localStorage
                this.user = { ...this.user, ...updateData }
                localStorage.setItem('user', JSON.stringify(this.user))

                return { success: true }
            } catch (error) {
                console.error('Error updating profile:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async login(credentials, remember = true) {
            this.loading = true
            try {
                const { data } = await api.post('/auth/login', credentials)

                // Validar que la respuesta tenga los datos necesarios
                if (!data) {
                    throw new Error('Respuesta inválida del servidor')
                }

                // El token puede venir como 'token' o 'accessToken'
                const token = data.token || data.accessToken
                if (!token) {
                    throw new Error('No se recibió un token de autenticación')
                }

                // Guardar token y usuario en el estado
                this.token = token
                this.user = data.user || data.usuario || {}

                // Siempre guardar en localStorage para mantener la sesión
                localStorage.setItem('token', this.token)
                localStorage.setItem('user', JSON.stringify(this.user))

                return { success: true }
            } catch (error) {
                // Propagar el error para que el componente pueda manejarlo
                throw error
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    }
})
