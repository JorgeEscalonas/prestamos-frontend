import { defineStore } from "pinia";
import api from "../services/api";

export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        resumen: {
            montoPrestado: 0,
            totalRecaudado: 0,
            saldoPendiente: 0,
            totalPendientes: 0,
            totalPagados: 0
        },
        metricasMensuales: {
            clientes: { cantidad: 0, porcentaje: 0, mesAnterior: 0 },
            prestamos: { cantidad: 0, porcentaje: 0, mesAnterior: 0 }
        },
        ultimosPagos: [],
        ultimosPrestamos: [],
        flujoCaja: [],
        rentabilidad: [],
        loading: false
    }),

    actions: {
        async fetchResumen() {
            try {
                const { data } = await api.get("/estado-cuenta/totales");
                this.resumen = data;
            } catch (error) {
                console.error("Error fetching dashboard resumen:", error);
            }
        },

        async fetchMetricasMensuales() {
            try {
                const { data } = await api.get("/estado-cuenta/metricas-mensuales");
                this.metricasMensuales = data;
            } catch (error) {
                console.error("Error fetching dashboard metricas mensuales:", error);
            }
        },

        async fetchFlujoCaja(periodo = 'mensual') {
            try {
                const { data } = await api.get("/estado-cuenta/grafica-flujo-caja", { params: { periodo } });
                this.flujoCaja = data;
            } catch (error) {
                console.error("Error fetching dashboard flujo caja:", error);
            }
        },

        async fetchRentabilidad() {
            try {
                const { data } = await api.get("/estado-cuenta/grafica-rentabilidad");
                this.rentabilidad = data;
            } catch (error) {
                console.error("Error fetching dashboard rentabilidad:", error);
            }
        },

        async fetchUltimosPagos() {
            try {
                const { data } = await api.get("/pagos", { params: { limit: 5 } });
                this.ultimosPagos = Array.isArray(data) ? data : (data.items || []);
            } catch (error) {
                console.error("Error fetching ultimos pagos:", error);
            }
        },

        async fetchUltimosPrestamos() {
            try {
                const { data } = await api.get("/prestamos", { params: { limit: 5 } });
                this.ultimosPrestamos = Array.isArray(data) ? data : (data.items || []);
            } catch (error) {
                console.error("Error fetching ultimos prestamos:", error);
            }
        },

        async fetchAll() {
            this.loading = true;
            await Promise.all([
                this.fetchResumen(),
                this.fetchMetricasMensuales(),
                this.fetchFlujoCaja(),
                this.fetchRentabilidad(),
                this.fetchUltimosPagos(),
                this.fetchUltimosPrestamos()
            ]);
            this.loading = false;
        }
    }
});
