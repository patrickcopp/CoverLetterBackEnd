var mysql = require('mysql2/promise');
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'Password123!',
  database : 'cover',
  connectionLimit: 15,
  port: 3306
});

module.exports = pool;