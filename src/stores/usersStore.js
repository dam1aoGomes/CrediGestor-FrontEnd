import { defineStore } from "pinia";
import { listUsers } from "../services/users";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        const data = await listUsers();

        this.users = (data || []).map((u) => ({
          id: u.id,
          nome: u.name ?? u.nome ?? "",
          email: u.email ?? "",
          papel: u.role ?? u.papel ?? "Vendedor",
          status: (u.is_active ?? u.active ?? u.status) ? "Ativo" : "Inativo",
        }));
      } catch (e) {
        const status = e?.response?.status;
        const url = e?.config?.baseURL
          ? `${e.config.baseURL}${e.config.url}`
          : e?.config?.url;

        const detail =
          e?.response?.data?.detail ||
          e?.response?.data ||
          e?.message ||
          "Erro ao buscar usuários";

        this.error = status
          ? `Erro ${status} ao chamar ${url}: ${detail}`
          : String(detail);

      } finally {
        this.loading = false;
      }
    },
  },
});
