import { api } from "./api";

function toNumber(v, fallback = 0) {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;

  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

export async function getSystemConfig() {
  try {
    const { data } = await api.get("/api/system-config");
    return data;
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.get("/system-config");
      return data;
    }
    throw e;
  }
}

export async function putSystemConfig(payload) {
  const body = {
    company_name: String(payload.company_name ?? "").trim(),
    logo_url: String(payload.logo_url ?? "").trim(),
    monthly_interest_rate: toNumber(payload.monthly_interest_rate, 0),
    fine_rate: toNumber(payload.fine_rate, 0),
    days_before_due_alert: toNumber(payload.days_before_due_alert, 0),
  };

  try {
    const { data } = await api.put("/api/system-config", body);
    return data;
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.put("/system-config", body);
      return data;
    }
    throw e;
  }
}

function extractFilenameFromContentDisposition(cd) {
  const match = String(cd || "").match(/filename\*?=(?:UTF-8''|")?([^;"\n]+)"?/i);
  return match?.[1] ? decodeURIComponent(match[1]) : "backup.zip";
}

async function readBlobAsText(blob) {
  try {
    return await blob.text();
  } catch {
    return "";
  }
}

function normalizeReturnedString(str) {
  if (!str) return "";
  const s = String(str).trim();
  return s.startsWith('"') && s.endsWith('"') ? s.slice(1, -1) : s;
}

async function fetchBackup(path) {
  const res = await api.get(path, { responseType: "blob" });

  const contentType = String(res.headers?.["content-type"] || "");
  const isJson = contentType.includes("application/json");

  if (!isJson && res.data instanceof Blob && res.data.size > 0) {
    const filename = extractFilenameFromContentDisposition(res.headers?.["content-disposition"]);
    return { type: "blob", blob: res.data, filename };
  }

  const txt = await readBlobAsText(res.data);
  const cleaned = normalizeReturnedString(txt);

  if (cleaned) return { type: "url", url: cleaned };

  return null;
}

export async function getBackupZipOrUrl() {
  try {
    const r1 = await fetchBackup("/api/backups");
    if (r1) return r1;
  } catch (e) {
    if (e?.response?.status !== 404) throw e;
  }

  try {
    const r2 = await fetchBackup("/backups");
    if (r2) return r2;
  } catch (e) {
    if (e?.response?.status !== 404) throw e;
  }

  try {
    const { data } = await api.get("/api/backups");
    const url = normalizeReturnedString(data);
    return { type: "url", url };
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.get("/backups");
      const url = normalizeReturnedString(data);
      return { type: "url", url };
    }
    throw e;
  }
}
