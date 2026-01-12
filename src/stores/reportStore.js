import { defineStore } from "pinia";
import { getDelinquencyReport } from "../services/reports";

function parseMoneyString(v) {
  if (v === null || v === undefined) return 0;

  let s = String(v).trim();

  s = s.replace(/[^0-9.-]/g, "");

  const num = Number.parseFloat(s);
  return Number.isFinite(num) ? num : 0;
}

function calcUpdated(total, overdueCount) {
  const t = Number(total || 0);
  const o = Number(overdueCount || 0);
  const taxa = 1 + o * 0.01;
  return t * taxa;
}

export const useDelinquencyReportStore = defineStore("delinquencyReport", {
  state: () => ({
    linhas: [],
    totalCustomers: 0,
    totalDueAll: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async generate({ de, ate } = {}) {
      this.loading = true;
      this.error = null;

      try {
        const raw = await getDelinquencyReport({ de, ate });

        const customers = Array.isArray(raw?.customers) ? raw.customers : [];

        this.totalCustomers = Number(raw?.total_customers ?? customers.length ?? 0);
        this.totalDueAll = parseMoneyString(raw?.total_due_all);

        this.linhas = customers.map((c) => {
          const total = parseMoneyString(c.total_due);
          const atrasadas = Number(c.overdue_installments_count ?? 0);

          return {
            customerId: c.customer_id,
            cliente: c.customer_name || "Cliente não informado",
            telefone: c.customer_phone || "",
            total,
            parcelasAtrasadas: atrasadas,
            atualizado: calcUpdated(total, atrasadas),
            installments: Array.isArray(c.installments) ? c.installments : [],
          };
        });

        if (!this.linhas.length) {
          this.error = "Nenhum cliente inadimplente encontrado para o período."
        }

        return true;
      } catch (e) {
        const status = e?.response?.status;
        const detail =
          e?.response?.data?.detail ||
          e?.message ||
          "Erro ao gerar relatório";

        this.error = status ? `Erro ${status}: ${detail}` : String(detail);
        this.linhas = [];
        this.totalCustomers = 0;
        this.totalDueAll = 0;
        return false;
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.linhas = [];
      this.totalCustomers = 0;
      this.totalDueAll = 0;
      this.error = null;
    },
  },
});
