# 🚀 Projeto Sequelize - Sistema de Usuários

![Node.js](https://img.shields.io/badge/Node.js-14+-green)
![MySQL](https://img.shields.io/badge/MySQL-5.7-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![License](https://img.shields.io/badge/License-MIT-yellow)
![npm](https://img.shields.io/badge/npm-latest-red)

Aplicação de exemplo para **gerenciar usuários e endereços** usando **Node.js, Express e Sequelize (MySQL)**.
Inclui autenticação simples com sessões, CRUD completo e templates com Handlebars.

---

## 📑 Sumário

* [✨ Recursos](#-recursos)
* [🛠 Tecnologias](#-tecnologias-utilizadas)
* [📋 Pré-requisitos](#-pré-requisitos)
* [⚙️ Instalação](#️-instalação)
* [🔑 Variáveis de ambiente](#-variáveis-de-ambiente-env)
* [🗄 Banco de dados](#-banco-de-dados)
* [▶️ Como executar](#️-como-executar)
* [🔐 Autenticação](#-autenticação-login--registro)
* [🌐 Rotas principais](#-rotas-principais)
* [📂 Estrutura do projeto](#-estrutura-do-projeto)
* [🐞 Depuração](#-depuração--troubleshooting)
* [📜 Licença](#-licença)

---

## ✨ Recursos

* CRUD de **usuários** (Create, Read, Update, Delete)
* Gerenciamento de **endereços vinculados** a usuários
* Autenticação por sessão (`express-session`)
* **Hash seguro de senhas** com `bcryptjs`

---

## 🛠 Tecnologias utilizadas

* **Node.js**
* **Express**
* **Sequelize (ORM)**
* **MySQL (mysql2)**
* **Handlebars (express-handlebars)**
* **express-session** (sessões)
* **bcryptjs** (hash de senhas)
* **dotenv** (variáveis de ambiente)
* **nodemon** (ambiente de dev)

---

## 📋 Pré-requisitos

* Node.js (>= 14 recomendado)
* MySQL ou MariaDB

---

## ⚙️ Instalação

```powershell
# Clone o repositório
git clone https://github.com/SophieKumagai/projeto_sequelize.git
cd projeto_sequelize

# Instale as dependências
npm install
```

---

## 🔑 Variáveis de ambiente (.env)

Crie um arquivo `.env` na raiz:

```ini
db_user=seu_usuario
db_password=sua_senha
db_host=localhost
db_port=3306
SESSION_SECRET=uma_chave_secreta_aqui
```

---

## 🗄 Banco de dados

O projeto usa por padrão o banco `nodesequelize` (configure em `db/conn.js`).
Há um arquivo `banco_instrucoes.sql` com as instruções de criação de tabelas.

Importar:

```powershell
mysql -u seu_usuario -p < banco_instrucoes.sql
```

---

## ▶️ Como executar

* **Produção**

```powershell
npm start
```

* **Desenvolvimento** (com nodemon):

```powershell
npm run dev
```

Aplicação disponível em: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Autenticação (login / registro)

* `GET /login` → formulário de login
* `POST /login` → autenticação
* `GET /logout` → encerra sessão
* `GET /register` → formulário de cadastro (nome, e-mail, senha)
* `POST /register` → cria usuário e autentica

🔄 **Redirecionamento inteligente:**
Se o usuário tentar acessar uma rota protegida sem login, é salvo `req.session.returnTo`.
Após logar, ele retorna à página original (ou `/`).

---

## 🌐 Rotas principais

* `GET /` → lista de usuários
* `GET /users/create` → formulário de criação
* `POST /users/create` → cria usuário
* `GET /users/:id` → visualiza usuário + endereços
* `GET /users/edit/:id` → formulário de edição
* `POST /users/update` → atualiza usuário
* `POST /users/delete/:id` → exclui usuário e endereços
* `POST /address/create` → cria endereço
* `POST /address/delete` → remove endereço

---

## 📂 Estrutura do projeto

```
projeto_sequelize/
│── index.js              # servidor Express e rotas
│── db/conn.js            # conexão Sequelize
│── models/               # User.js, Address.js
│── views/                # templates Handlebars
│── public/               # CSS e arquivos estáticos
│── banco_instrucoes.sql  # script do banco
```

---

## 🐞 Depuração / Troubleshooting

* Verifique `.env` e conexão MySQL caso o servidor não inicie
* Sequelize mostra logs no console
* Se houver erro de colunas/índices → confira se o banco está sincronizado com os models

---

## 📜 Licença

[MIT](LICENSE)

---