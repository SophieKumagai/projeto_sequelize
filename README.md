# Projeto Sequelize - Sistema de Usuários

Aplicação de exemplo para gerenciar usuários e endereços usando Node.js, Express e Sequelize (MySQL).

Este README traz instruções de instalação, configuração, execução e uso (incluindo autenticação simples por sessão).

Sumário
-------
- Recursos
- Pré-requisitos
- Instalação
- Variáveis de ambiente (.env)
- Banco de dados
- Como executar
- Autenticação (login / registro)
- Rotas principais
- Estrutura do projeto
- Notas de produção
- Contribuição

Recursos
--------
- CRUD de usuários (create/read/update/delete)
- Gerenciamento de endereços vinculados a usuários
- Autenticação básica por sessão (express-session) e hash de senhas (bcryptjs)

Tecnologias utilizadas
----------------------
- Node.js
- Express
- Sequelize (ORM)
- MySQL (mysql2)
- Handlebars (express-handlebars)
- express-session (sessões)
- bcryptjs (hash de senhas)
- dotenv (variáveis de ambiente)
- nodemon (dev)

Pré-requisitos
--------------
- Node.js (recomendado >= 14)
- MySQL ou MariaDB

Instalação
---------
1. Clone o repositório e entre na pasta do projeto:

```powershell
git clone https://github.com/SophieKumagai/projeto_sequelize.git
cd projeto_sequelize
```

2. Instale as dependências:

```powershell
npm install
```

Variáveis de ambiente (.env)
---------------------------
Crie um arquivo `.env` na raiz com as configurações do banco e, opcionalmente, a chave de sessão:

```
db_user=seu_usuario
db_password=sua_senha
db_host=localhost
db_port=3306
SESSION_SECRET=uma_chave_secreta_aqui
```

Banco de dados
--------------
O projeto usa por padrão o banco `nodesequelize` (configure em `db/conn.js`). Há um arquivo `banco_instrucoes.sql` com instruções de criação de tabelas.

Para importar (exemplo):

```powershell
mysql -u seu_usuario -p < banco_instrucoes.sql
```

Ou execute manualmente os comandos SQL dentro do arquivo.

Como executar
-------------
- Modo produção:

```powershell
npm start
```

- Modo desenvolvimento (com nodemon se preferir):

```powershell
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

Autenticação (login / registro)
--------------------------------
O projeto possui autenticação simples por sessão:

- GET `/login` — formulário de login.
- POST `/login` — processo de autenticação; ao logar com sucesso a sessão é criada.
- GET `/logout` — encerra a sessão.
- GET `/register` — formulário de cadastro simplificado, pedindo apenas as informações de nome, e-mail e senha.
- POST `/register` — cria um usuário a partir dos campos de `register` e autentica-o.

Fluxo de redirecionamento:
- Quando uma rota protegida é acessada sem autenticação, o app salva a URL solicitada em `req.session.returnTo` e redireciona para `/login`.
- Depois de logar ou registrar, o usuário é redirecionado de volta à URL original (ou `/` se não houver).

Rotas principais
----------------
- GET `/` - lista de usuários
- GET `/users/create` - formulário de criação
- POST `/users/create` - cria usuário
- GET `/users/:id` - visualização de usuário com endereços
- GET `/users/edit/:id` - formulario de edição
- POST `/users/update` - atualiza usuário
- POST `/users/delete/:id` - deleta usuário (e seus endereços)
- POST `/address/create` - cria endereço para usuário
- POST `/address/delete` - deleta endereço

Estrutura do projeto
--------------------
- `index.js` — servidor Express e rotas
- `db/conn.js` — conexão e configuração Sequelize
- `models/` — `User.js`, `Address.js`
- `views/` — templates Handlebars
- `public/` — CSS e assets estáticos
- `banco_instrucoes.sql` — instruções para criar o banco

Depuração / troubleshooting
--------------------------
- Se o servidor não iniciar, verifique as variáveis do `.env` e se o MySQL está acessível.
- Logs do Sequelize aparecem no console. Se houver erros de coluna/índice, verifique se o esquema do banco corresponde aos models.

Licença
-------
MIT
