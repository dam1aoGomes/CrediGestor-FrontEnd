import { api } from "../services/api";
import { defineStore } from "pinia";
import {
  getSystemConfig,
  putSystemConfig,
  getBackupZipOrUrl,
} from "../services/systemConfig";

function toNumber(v, fallback = 0) {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;

  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

function downloadBlob(blob, filename = "backup.zip") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const useSystemConfigStore = defineStore("systemConfig", {
  state: () => ({
    config: {
      id: null,
      company_name: "",
      logo_url: "",
      monthly_interest_rate: 0,
      fine_rate: 0,
      days_before_due_alert: 0,
      created_at: null,
      updated_at: null,
    },
    loading: false,
    saving: false,
    exporting: false,
    error: null,
  }),

  actions: {
    async fetchConfig() {
      this.loading = true;
      this.error = null;

      try {
        const data = await getSystemConfig();

        this.config = {
          id: data?.id ?? null,
          company_name: data?.company_name ?? "",
          logo_url: data?.logo_url ?? "",
          monthly_interest_rate: toNumber(data?.monthly_interest_rate, 0),
          fine_rate: toNumber(data?.fine_rate, 0),
          days_before_due_alert: toNumber(data?.days_before_due_alert, 0),
          created_at: data?.created_at ?? null,
          updated_at: data?.updated_at ?? null,
        };
      } catch (e) {
        const status = e?.response?.status;
        const detail =
          e?.response?.data?.detail ||
          e?.message ||
          "Erro ao buscar configurações";
        this.error = status ? `Erro ${status}: ${detail}` : String(detail);
      } finally {
        this.loading = false;
      }
    },

    async saveConfig(form) {
      this.saving = true;
      this.error = null;

      try {
        const payload = {
          company_name: String(form.company_name ?? "").trim(),
          logo_url: String(form.logo_url ?? "").trim(),
          monthly_interest_rate: toNumber(form.monthly_interest_rate, 0),
          fine_rate: toNumber(form.fine_rate, 0),
          days_before_due_alert: Math.max(
            0,
            parseInt(form.days_before_due_alert ?? 0, 10) || 0
          ),
        };

        const updated = await putSystemConfig(payload);

        this.config = {
          id: updated?.id ?? this.config.id,
          company_name: updated?.company_name ?? payload.company_name,
          logo_url: updated?.logo_url ?? payload.logo_url,
          monthly_interest_rate: toNumber(
            updated?.monthly_interest_rate,
            payload.monthly_interest_rate
          ),
          fine_rate: toNumber(updated?.fine_rate, payload.fine_rate),
          days_before_due_alert: toNumber(
            updated?.days_before_due_alert,
            payload.days_before_due_alert
          ),
          created_at: updated?.created_at ?? this.config.created_at,
          updated_at: updated?.updated_at ?? this.config.updated_at,
        };

        return true;
      } catch (e) {
        const status = e?.response?.status;
        const detail =
          e?.response?.data?.detail ||
          e?.message ||
          "Erro ao salvar configurações";
        this.error = status ? `Erro ${status}: ${detail}` : String(detail);
        return false;
      } finally {
        this.saving = false;
      }
    },

    async exportBackup() {
      this.exporting = true;
      this.error = null;

      try {
        const result = await getBackupZipOrUrl();

        if (result?.type === "blob" && result?.blob) {
          downloadBlob(result.blob, result.filename || "backup.zip");
          return true;
        }

        const rawUrl = String(result?.url ?? "")
          .trim()
          .replace(/^"+|"+$/g, "");

        if (!rawUrl) {
          this.error =
            "Backup gerado, mas a API não retornou um link/arquivo válido.";
          return false;
        }

        if (/^https?:\/\//i.test(rawUrl)) {
          window.open(rawUrl, "_blank");
          return true;
        }

        const base = String(api.defaults.baseURL || "");
        const finalUrl = base ? new URL(rawUrl, base).toString() : rawUrl;

        window.open(finalUrl, "_blank");
        return true;
      } catch (e) {
        const status = e?.response?.status;
        const detail =
          e?.response?.data?.detail || e?.message || "Erro ao exportar backup";
        this.error = status ? `Erro ${status}: ${detail}` : String(detail);
        return false;
      } finally {
        this.exporting = false;
      }
    },
  },
});
