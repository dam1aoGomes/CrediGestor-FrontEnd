import { api } from "./api";

export async function getDelinquencyReport({ de, ate } = {}) {
  const { data } = await api.get("/reports/delinquency", {
    params: {
      from: de || undefined,
      to: ate || undefined,
      start_date: de || undefined,
      end_date: ate || undefined,
    },
  });

  return data;
}
