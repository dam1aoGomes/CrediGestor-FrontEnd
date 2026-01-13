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

export async function updatePromissoryNoteStatus(promissoryNoteId, status) {
  const params = { status };

  try {
    const { data } = await api.put(
      `/api/promissory-notes/${promissoryNoteId}/status`,
      {},
      { params }
    );
    return data;
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.put(
        `/promissory-notes/${promissoryNoteId}/status`,
        null,
        { params }
      );
      return data;
    }
    throw e;
  }
}
