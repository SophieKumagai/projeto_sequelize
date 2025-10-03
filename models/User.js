const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome não pode estar vazio'
      },
      len: {
        args: [2, 100],
        msg: 'Nome deve ter entre 2 e 100 caracteres'
      }
    }
  },
  occupation: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: {
      len: {
        args: [0, 150],
        msg: 'Profissão deve ter no máximo 150 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Email inválido'
      },
      len: {
        args: [5, 150],
        msg: 'Email deve ter entre 5 e 150 caracteres'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  newsletter: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, {
  tableName: 'users',
  indexes: [
    {
      fields: ['name'] // Índice para busca por nome
    }
  ]
});

module.exports = User;