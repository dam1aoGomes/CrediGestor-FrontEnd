import { defineStore } from "pinia";
import { listPromissoryNotes } from "../services/promissoryNotes";

function toDateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function normalizeStatus(rawStatus, dueDate, paidAmount, originalAmount) {
  const s = String(rawStatus || "").toLowerCase();

  if (["pago", "paid", "quitado"].includes(s)) return "Pago";
  if (["atrasado", "overdue", "vencido"].includes(s)) return "Atrasado";
  if (["pendente", "pending", "aberto"].includes(s)) return "Pendente";

  const paid = Number(paidAmount || 0);
  const orig = Number(originalAmount || 0);
  if (orig > 0 && paid >= orig) return "Pago";

  const d = dueDate ? new Date(String(dueDate).slice(0, 10) + "T00:00:00") : null;
  if (d && d < new Date()) return "Atrasado";

  return "Pendente";
}

export const usePromissoryNotesStore = defineStore("promissoryNotes", {
  state: () => ({
    notes: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchNotes() {
        this.loading = true;
        this.error = null;

        try {
            const raw = await listPromissoryNotes();

            // ✅ normaliza para array (independente do formato do backend)
            const list =
            Array.isArray(raw) ? raw :
            Array.isArray(raw?.items) ? raw.items :
            Array.isArray(raw?.results) ? raw.results :
            Array.isArray(raw?.data) ? raw.data :
            Array.isArray(raw?.promissory_notes) ? raw.promissory_notes :
            Array.isArray(raw?.promissoryNotes) ? raw.promissoryNotes :
            [];

            if (!Array.isArray(list)) {
            this.notes = [];
            this.error = "Resposta inesperada da API ao listar promissórias.";
            return;
            }

            this.notes = list.map((n) => {
            const due = n.due_date ?? n.vencimento ?? n.dueDate;
            const original = n.original_amount ?? n.originalAmount ?? n.valor ?? 0;
            const paid = n.paid_amount ?? n.paidAmount ?? 0;

            const cliente =
                n.customer_name ||
                n.customer?.full_name ||
                n.customer?.name ||
                (n.customer_id ? `Cliente ${n.customer_id}` : null) ||
                (n.sale_id ? `Venda #${n.sale_id}` : "Cliente não informado");

            return {
                id: n.id,
                cliente,
                valor: Number(original) || 0,
                vencimento: due ? String(due).slice(0, 10) : "",
                status: (() => {
                const s = String(n.status || "").toLowerCase();
                if (s === "pago") return "Pago";
                if (s === "atrasado") return "Atrasado";
                if (s === "pendente") return "Pendente";

                // fallback
                if (Number(original) > 0 && Number(paid) >= Number(original)) return "Pago";
                const d = due ? new Date(String(due).slice(0, 10) + "T00:00:00") : null;
                if (d && d < new Date()) return "Atrasado";
                return "Pendente";
                })(),
            };
            });
        } catch (e) {
            const status = e?.response?.status;
            const detail = e?.response?.data?.detail || e?.message || "Erro ao buscar promissórias";
            this.error = status ? `Erro ${status}: ${detail}` : String(detail);
        } finally {
            this.loading = false;
        }
    },
  },
});
