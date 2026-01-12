import { api } from "./api";

export async function listPromissoryNotes() {
  try {
    const { data } = await api.get("/promissory-notes");
    return data;
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.get("/api/promissory-notes");
      return data;
    }
    throw e;
  }
}
