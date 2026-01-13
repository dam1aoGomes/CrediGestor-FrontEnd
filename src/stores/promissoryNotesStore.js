import { defineStore } from "pinia";
import { listPromissoryNotes, updatePromissoryNoteStatus } from "../services/promissoryNotes";

function normalizeToEnStatus(rawStatus) {
  const s = String(rawStatus || "").trim().toLowerCase();

  if (["paid"].includes(s)) return "paid";
  if (["pending"].includes(s)) return "pending";
  if (["overdue"].includes(s)) return "overdue";

  if (["pago", "quitado"].includes(s)) return "paid";
  if (["pendente", "aberto"].includes(s)) return "pending";
  if (["atrasado", "vencido"].includes(s)) return "overdue";

  return "";
}

function computeStatusFallback(dueDate, paidAmount, originalAmount) {
  const paid = Number(paidAmount || 0);
  const orig = Number(originalAmount || 0);
  if (orig > 0 && paid >= orig) return "paid";

  const d = dueDate ? new Date(String(dueDate).slice(0, 10) + "T00:00:00") : null;
  if (d && d < new Date()) return "overdue";

  return "pending";
}

function nextEnStatus(current) {
  const c = normalizeToEnStatus(current) || "pending";
  if (c === "pending") return "paid";
  if (c === "paid") return "overdue";
  return "pending";
}

export const usePromissoryNotesStore = defineStore("promissoryNotes", {
  state: () => ({
    notes: [],
    loading: false,
    error: null,
    updatingStatus: {},
  }),

  actions: {
    async fetchNotes() {
      this.loading = true;
      this.error = null;

      try {
        const raw = await listPromissoryNotes();

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

          const normalized = normalizeToEnStatus(n.status);
          const status = normalized || computeStatusFallback(due, paid, original);

          return {
            id: n.id,
            cliente,
            valor: Number(original) || 0,
            vencimento: due ? String(due).slice(0, 10) : "",
            status,
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

    async cycleStatus(id) {
      const note = this.notes.find(n => String(n.id) === String(id));
      if (!note) return;
      if (this.updatingStatus[id]) return;

      const oldStatus = note.status;
      const newStatus = nextEnStatus(oldStatus);

      this.updatingStatus[id] = true;
      note.status = newStatus;

      try {
        await updatePromissoryNoteStatus(id, newStatus);
      } catch (e) {
        note.status = oldStatus;
        const status = e?.response?.status;
        const detail =
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          e?.message ||
          "Erro ao atualizar status";
        this.error = status ? `Erro ${status}: ${detail}` : String(detail);
      } finally {
        this.updatingStatus[id] = false;
      }
    },
  },
});
