const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const moment = require('moment');
const { Op } = require('sequelize');
const session = require('express-session');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importando conexão e modelos
const conn = require('./db/conn');
const User = require('./models/User');
const Address = require('./models/Address');

const app = express();
const PORT = process.env.PORT || 3000;

Handlebars.registerHelper('formatDate', function(date, format) {
  if (!date) return '';
  const fmt = typeof format === 'string' ? format : "DD/MM/YYYY";
  return moment(date).format(fmt);
});

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsing de dados
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Sessões para autenticação
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_dev_change_this',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Disponibiliza usuário nas views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Middleware de log das requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===============================
// ROTAS PRINCIPAIS
// ===============================

// Página inicial - Lista todos os usuários
app.get('/', async (req, res) => {
  // exigir autenticação para acessar a raiz
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl || req.url;
    return res.redirect('/login');
  }
  try {
    const { q } = req.query;
    const where = {};
    if (q) {
      where.name = { [Op.like]: `%${q}%` };
    }

    const users = await User.findAll({
      where,
      order: [['createdAt', 'DESC']], // Mais recentes primeiro
      raw: true
    });

    console.log(`Encontrados ${users.length} usuários`);
    res.render('home', { users, filters: { q: q || '' } });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.render('home', { 
      users: [], 
      error: 'Erro ao carregar usuários' 
    });
  }
});

// ===============================
// ROTAS DE USUÁRIOS
// ===============================

// Página de cadastro de usuário
app.get('/users/create', (req, res) => {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl || req.url;
    return res.redirect('/login');
  }
  res.render('adduser');
});

// Criar novo usuário
app.post('/users/create', async (req, res) => {
  try {
    const { name, occupation, newsletter } = req.body;
  
    // Validação básica
    if (!name || name.trim().length < 2) {
      return res.render('adduser', { 
        error: 'Nome deve ter pelo menos 2 caracteres',
        formData: { name, occupation, newsletter }
      });
    }

    const userData = {
      name: name.trim(),
      occupation: occupation ? occupation.trim() : null,
      newsletter: newsletter === 'on'
    };

    // Se for fornecido email/senha (via formulário), hash e use
    if (req.body.email) userData.email = req.body.email.trim();
    if (req.body.password) userData.password = await bcrypt.hash(req.body.password, 10);

    const user = await User.create(userData);
    console.log('Usuário criado:', user.toJSON());
  
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.render('adduser', { 
      error: 'Erro ao criar usuário: ' + error.message,
      formData: req.body
    });
  }
});

// Ver detalhes de um usuário
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    const user = await User.findByPk(id, {
      include: [{
        model: Address,
        as: 'addresses'
      }]
    });

    if (!user) {
      return res.render('userview', { 
        error: 'Usuário não encontrado' 
      });
    }

    res.render('userview', { 
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.render('userview', { 
      error: 'Erro ao carregar usuário' 
    });
  }
});

// Página de edição de usuário
app.get('/users/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    const user = await User.findByPk(id, {
      include: [{
        model: Address,
        as: 'addresses',
        order: [['createdAt', 'DESC']]
      }]
    });

    if (!user) {
      return res.redirect('/');
    }

    res.render('useredit', { 
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Erro ao buscar usuário para edição:', error);
    res.redirect('/');
  }
});

// Atualizar usuário
app.post('/users/update', async (req, res) => {
  try {
    const { id, name, occupation, newsletter } = req.body;
  
    // Validação
    if (!name || name.trim().length < 2) {
      return res.redirect(`/users/edit/${id}`);
    }

    const updateData = {
      name: name.trim(),
      occupation: occupation ? occupation.trim() : null,
      newsletter: newsletter === 'on'
    };

    const [updatedRows] = await User.update(updateData, {
      where: { id }
    });

    if (updatedRows === 0) {
      console.log('Nenhum usuário foi atualizado');
    } else {
      console.log(`Usuário ${id} atualizado com sucesso`);
    }

    res.redirect('/');
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.redirect(`/users/edit/${req.body.id || ''}`);
  }
});

// Excluir usuário
app.post('/users/delete/:id', async (req, res) => {
  try {
    if (!req.session.user) {
      req.session.returnTo = req.originalUrl || req.url;
      return res.redirect('/login');
    }
    const { id } = req.params;
  
    // Primeiro, deletar todos os endereços do usuário
    await Address.destroy({
      where: { userId: id }
    });
  
    // Depois, deletar o usuário
    const deletedRows = await User.destroy({
      where: { id }
    });

    if (deletedRows > 0) {
      console.log(`Usuário ${id} e seus endereços foram excluídos`);
    } else {
      console.log('Nenhum usuário foi excluído');
    }

    res.redirect('/');
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.redirect('/');
  }
});

// ===============================
// ROTAS DE ENDEREÇOS
// ===============================

// Criar novo endereço
app.post('/address/create', async (req, res) => {
  try {
    if (!req.session.user) {
      req.session.returnTo = req.originalUrl || req.url;
      return res.redirect('/login');
    }
    const { userId, street, number, city } = req.body;
  
    // Validação
    if (!street || street.trim().length < 5) {
      return res.redirect(`/users/edit/${userId}`);
    }
  
    if (!city || city.trim().length < 2) {
      return res.redirect(`/users/edit/${userId}`);
    }

    const addressData = {
      street: street.trim(),
      number: number ? number.trim() : null,
      city: city.trim(),
      userId
    };

    const address = await Address.create(addressData);
    console.log('Endereço criado:', address.toJSON());
  
    res.redirect(`/users/edit/${userId}`);
  } catch (error) {
    console.error('Erro ao criar endereço:', error);
    res.redirect(`/users/edit/${req.body.userId || ''}`);
  }
});

// Excluir endereço
app.post('/address/delete', async (req, res) => {
  try {
    if (!req.session.user) {
      req.session.returnTo = req.originalUrl || req.url;
      return res.redirect('/login');
    }
    const { id, userId } = req.body;
  
    const deletedRows = await Address.destroy({
      where: { id }
    });

    if (deletedRows > 0) {
      console.log(`Endereço ${id} excluído`);
    }

    res.redirect(userId ? `/users/edit/${userId}` : '/');
  } catch (error) {
    console.error('Erro ao excluir endereço:', error);
    res.redirect('/');
  }
});

// ===============================
// AUTENTICAÇÃO (login/logout)
// ===============================

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.render('login', { error: 'Credenciais inválidas', form: { email } });
    const match = await bcrypt.compare(password, user.password || '');
    if (!match) return res.render('login', { error: 'Credenciais inválidas', form: { email } });
    req.session.user = { id: user.id, name: user.name, email: user.email };
    const redirectTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
  } catch (err) {
    console.error('Erro no login:', err);
    res.render('login', { error: 'Erro ao realizar login' });
  }
});

// Rotas de registro
app.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password) return res.render('register', { error: 'Preencha todos os campos', form: req.body });
  if (password !== passwordConfirm) return res.render('register', { error: 'Senhas não conferem', form: req.body });
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: email.trim(), password: hash });
    req.session.user = { id: user.id, name: user.name, email: user.email };
    const redirectTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
  } catch (err) {
    console.error('Erro no registro:', err);
    res.render('register', { error: err.message, form: req.body });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// ===============================
// TRATAMENTO DE ERROS 404
// ===============================
app.use((req, res) => {
  res.status(404).render('home', { 
    users: [],
    error: 'Página não encontrada' 
  });
});

// ===============================
// INICIALIZAÇÃO DO SERVIDOR
// ===============================
async function startServer() {
  try {
    // Sincronizar modelos com o banco de dados
    await conn.sync();
    console.log('✅ Modelos sincronizados com o banco de dados!');
  
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log('💡 Pressione Ctrl+C para parar o servidor');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();