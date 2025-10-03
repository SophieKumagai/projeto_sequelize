const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.db_name, process.env.db_user, process.env.db_password, {
  host: process.env.db_host,
  port: process.env.db_port,
  dialect: 'mysql',
  logging: console.log,
  define: {
    timestamps: true,
    underscored: false,
  },
  pool: {
    max: 10, 
    min: 0,  
    acquire: 30000, 
    idle: 10000,
  },
});

// Função para testar a conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com MySQL estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
  }
}

testConnection();

module.exports = sequelize;