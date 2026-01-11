import { api } from "./api";

export async function listUsers() {
  try {
    const { data } = await api.get("/users");
    return data;
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.get("/api/users");
      return data;
    }
    throw e;
  }
}

export async function createUser(payload) {
  try {
    const { data } = await api.post("/users", payload);
    return data;
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.post("/api/users", payload);
      return data;
    }
    throw e;
  }
}

export async function updateUser(id, payload) {
  try {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.put(`/api/users/${id}`, payload);
      return data;
    }
    throw e;
  }
}

export async function deactivateUser(id) {
  try {
    const { data } = await api.patch(`/users/${id}/deactivate`);
    return data;
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.patch(`/api/users/${id}/deactivate`);
      return data;
    }
    throw e;
  }
}
