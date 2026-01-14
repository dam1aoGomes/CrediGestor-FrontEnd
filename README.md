# 💻 CrediGestor - Frontend

> Interface web para o sistema de gestão de vendas parceladas e controle de promissórias.

Este projeto foi desenvolvido com **Vue.js 3** e consome a API REST do CrediGestor (Backend).

## 🛠️ Tecnologias

* **Vue.js 3** (Composition API + Script Setup)
* **Vite** (Build tool rápida)
* **Pinia** (Gerenciamento de estado)
* **Vue Router** (Roteamento)
* **Lucide Vue** (Ícones)
* **CSS Scoped** (Estilização nativa)

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:
* Node.js (Versão 18 ou superior recomendada)
* NPM (Gerenciador de pacotes)

## 🚀 Como rodar o projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/dam1aoGomes/CrediGestor---FrontEnd.git](https://github.com/dam1aoGomes/CrediGestor---FrontEnd.git)
    cd CrediGestor---FrontEnd
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure a API:**

    Siga a documentação do repositório [credigestor-api](https://github.com/hscHeric/credigestor-api) para rodar a API.
    Crie um arquivo `.env` na raiz do projeto e defina a URL do Backend:
    ```env
    VITE_API_URL=http://localhost:8000
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

O projeto estará rodando em: `http://localhost:5173` (ou outra porta indicada no terminal).

## 📂 Estrutura de Pastas

* `src/components`: Componentes reutilizáveis (Botões, Tabelas, Badges).
* `src/views`: Páginas principais (Login, Vendas, Clientes, Usuários, Relatórios, Dashboard).
* `src/stores`: Gerenciamento de estado global (Pinia).
* `src/services`: Arquivos de conexão com a API (Axios/Fetch).
* `src/router`: Configuração das rotas.

---

Desenvolvido para o sistema [CrediGestor](https://github.com/anabesm/CrediGestor#).