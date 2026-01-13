import { api } from "./api";

export async function getDelinquencyReport({ de, ate } = {}) {
  const params = {
    due_from: de || undefined,
    due_to: ate || undefined,
  };

  try {
    const { data } = await api.get("/api/reports/delinquency", { params });
    return data;
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.get("/reports/delinquency", { params });
      return data;
    }
    throw e;
  }
}
