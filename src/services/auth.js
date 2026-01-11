import { api } from "./api";

export async function loginRequest(email, password) {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);

  const { data } = await api.post("/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const tokenType = data.token_type || "bearer";
  localStorage.setItem("cg_token", `${tokenType[0].toUpperCase()}${tokenType.slice(1)} ${data.access_token}`);
  return data;
}
