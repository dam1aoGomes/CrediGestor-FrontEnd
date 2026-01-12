import { api } from "./api";

export async function listPromissoryNotes() {
  const { data } = await api.get("/promissory-notes");
  return data;
}
