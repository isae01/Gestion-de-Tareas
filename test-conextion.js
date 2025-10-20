// test-conexion.js
const { Sequelize } = require('sequelize');
const config = require('./config/config.json').development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado correctamente a PostgreSQL');
  } catch (error) {
    console.error('❌ Error al conectar:', error);
  }
}

testConnection();
