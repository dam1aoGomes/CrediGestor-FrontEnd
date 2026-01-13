import { defineStore } from "pinia";
import {
  listUsers,
  createUser as createUserApi,
  updateUser as updateUserApi,
  deactivateUser as deactivateUserApi,
} from "../services/users";

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
          nome: u.name ?? "",
          email: u.email ?? "",
          papel: u.role === "admin" ? "Administrador" : "Vendedor",
          status: (u.active ?? false) ? "Ativo" : "Inativo",
        }));
      } catch (e) {
        const status = e?.response?.status;
        const detail = e?.response?.data?.detail || e?.message || "Erro ao buscar usuários";
        this.error = status ? `Erro ${status}: ${detail}` : String(detail);
      } finally {
        this.loading = false;
      }
    },

    async createUser(form) {
      this.loading = true;
      this.error = null;
      try {
        const payload = {
          name: form.nome.trim(),
          email: form.email.trim(),
          password: form.senha,
          role: form.papel === "Administrador" ? "admin" : "seller",
          active: form.status === "Ativo",
        };

        const created = await createUserApi(payload);

        this.users.unshift({
          id: created.id,
          nome: created.name,
          email: created.email,
          papel: created.role === "admin" ? "Administrador" : "Vendedor",
          status: created.active ? "Ativo" : "Inativo",
        });

        return true;
      } catch (e) {
        const status = e?.response?.status;
        const detail = e?.response?.data?.detail || e?.message || "Erro ao criar usuário";
        this.error = status ? `Erro ${status}: ${detail}` : String(detail);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id, form) {
        this.loading = true;
        this.error = null;

        try {
            if (form.status === "Inativo") {
            await deactivateUserApi(id);

            const idx = this.users.findIndex((u) => Number(u.id) === Number(id));
            if (idx !== -1) this.users[idx].status = "Inativo";

            return true;
            }

            const payload = {
            name: form.nome.trim(),
            email: form.email.trim(),
            role: form.papel === "Administrador" ? "admin" : "seller",
            active: form.status === "Ativo",
            };

            if (form.senha && form.senha.trim()) {
            payload.password = form.senha.trim();
            }

            const updated = await updateUserApi(id, payload);

            const idx = this.users.findIndex((u) => Number(u.id) === Number(id));
            if (idx !== -1) {
            this.users[idx] = {
                id: updated.id,
                nome: updated.name,
                email: updated.email,
                papel: updated.role === "admin" ? "Administrador" : "Vendedor",
                status: updated.active ? "Ativo" : "Inativo",
            };
            }

            return true;
        } catch (e) {
            const status = e?.response?.status;
            const detail = e?.response?.data?.detail || e?.message || "Erro ao atualizar usuário";
            this.error = status ? `Erro ${status}: ${detail}` : String(detail);
            return false;
        } finally {
            this.loading = false;
        }
    },


    async deactivateUser(id) {
      this.loading = true;
      this.error = null;

      try {
        await deactivateUserApi(id);

        const idx = this.users.findIndex((u) => Number(u.id) === Number(id));
        if (idx !== -1) this.users[idx].status = "Inativo";

        return true;
      } catch (e) {
        const status = e?.response?.status;
        const detail = e?.response?.data?.detail || e?.message || "Erro ao desativar usuário";
        this.error = status ? `Erro ${status}: ${detail}` : String(detail);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async toggleStatus(id) {
        this.loading = true;
        this.error = null;

        try {
            const idx = this.users.findIndex((u) => Number(u.id) === Number(id));
            if (idx === -1) {
            this.error = "Usuário não encontrado.";
            return false;
            }

            const current = this.users[idx];

            if (current.status === "Ativo") {
            await deactivateUserApi(id);
            this.users[idx].status = "Inativo";
            return true;
            }

            const payload = {
            name: current.nome,
            email: current.email,
            role: current.papel === "Administrador" ? "admin" : "seller",
            active: true,
            };

            const updated = await updateUserApi(id, payload);

            this.users[idx] = {
            id: updated.id,
            nome: updated.name ?? current.nome,
            email: updated.email ?? current.email,
            papel: updated.role === "admin" ? "Administrador" : "Vendedor",
            status: (updated.active ?? true) ? "Ativo" : "Inativo",
            };

            return true;
        } catch (e) {
            const status = e?.response?.status;
            const detail = e?.response?.data?.detail || e?.message || "Erro ao alterar status";
            this.error = status ? `Erro ${status}: ${detail}` : String(detail);
            return false;
        } finally {
            this.loading = false;
        }
    }


  },
});
