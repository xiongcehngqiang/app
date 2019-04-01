const Sequelize = require('sequelize');
const dbConfig = {
  database: 'node', //表名
  username: 'root',
  password: 'root',
  host: 'localhost',
  dialect: 'mysql', // 'mysql'|'sqlite'|'postgres'|'mssql'
};

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  // 设置时区
  timezone: '+08:00',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;