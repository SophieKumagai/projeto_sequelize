# Projeto Sequelize - Sistema de Usuários

Pequeno sistema de CRUD de usuários feito com Node.js, Express e Sequelize (MySQL).

Conteúdo deste README:
- Descrição
- Pré-requisitos
- Configuração (variáveis de ambiente)
- Banco de dados
- Como executar
- Rotas principais
- Estrutura do projeto
- Melhorias recomendadas

---

Descrição
---------
Aplicação de exemplo para gerenciar usuários e endereços com:

- Node.js + Express
- Sequelize (MySQL)
- Handlebars para views (render server-side)

Funcionalidades implementadas:

- Listar usuários
- Criar / Editar / Excluir usuário
- Adicionar / Remover endereços associados a usuários

Pré-requisitos
--------------
- Node.js (>= 14)
- MySQL/MariaDB
- Git (opcional)

Configuração
-------------
1. Clone o repositório:

```powershell
git clone https://github.com/SophieKumagai/projeto_sequelize.git
cd projeto_sequelize
```

2. Instale dependências:

```powershell
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as variáveis do banco de dados (exemplo):

```
db_user=seu_usuario
db_password=sua_senha
db_host=localhost
db_port=3306
# (opcional) SESSION_SECRET=alguma_chave_secreta
```

Banco de dados
--------------
O projeto espera um banco chamado `nodesequelize` por padrão (veja `db/conn.js`). Há um arquivo SQL com instruções para criar as tabelas:

- `banco_instrucoes.sql`

Para criar/importar o banco (exemplo):

```powershell
mysql -u seu_usuario -p < banco_instrucoes.sql
```

Ou conecte ao MySQL e execute o conteúdo do arquivo manualmente.

Como executar
--------------
- Modo produção:

```powershell
npm start
```

- Modo desenvolvimento (recarregamento automático se instalar `nodemon`):

```powershell
npm run dev
```

A aplicação por padrão roda em `http://localhost:3000`.

Rotas principais
----------------
As rotas do servidor (arquivo `index.js`) incluem:

- GET `/` - lista todos os usuários
- GET `/users/create` - formulário para criar usuário
- POST `/users/create` - cria usuário
- GET `/users/:id` - ver detalhes de um usuário (inclui endereços)
- GET `/users/edit/:id` - formulário de edição
- POST `/users/update` - atualiza usuário
- POST `/users/delete/:id` - exclui usuário (e endereços associados)
- POST `/address/create` - cria endereço para um usuário
- POST `/address/delete` - deleta endereço

Estrutura do projeto
--------------------
Principais arquivos/folders:

- `index.js` - servidor Express e rotas
- `db/conn.js` - configuração do Sequelize/MySQL
- `models/User.js` e `models/Address.js` - modelos Sequelize
- `views/` - templates Handlebars (views)
- `public/` - CSS e assets estáticos
- `banco_instrucoes.sql` - instruções SQL para criar o banco/tabelas

Melhorias recomendadas
----------------------
Algumas melhorias que podem ser feitas (fora do escopo atual):

- Autenticação e autorização (login, permissões)
- Paginação, busca e filtros na listagem (para muitos registros)
- Migrations com `sequelize-cli` ao invés de alterações em runtime
- Validações e mensagens de feedback mais claras (flash messages)
- Testes automatizados (unit / integration)

Contribuições
-------------
Pull requests são bem-vindos. Para mudanças grandes, prefira abrir uma issue antes.

Licença
-------
MIT
