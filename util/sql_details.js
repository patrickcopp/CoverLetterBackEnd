var mysql = require('mysql2/promise');
require('dotenv').config();
var pool = mysql.createPool({
  host     : 'localhost',
  user     : process.env.DB_USER,
  password : process.env.DB_PW,
  database : process.env.DB_DB,
  connectionLimit: process.env.DB_CONNLIMIT,
  port: process.env.DB_PORT
});

module.exports = pool; 