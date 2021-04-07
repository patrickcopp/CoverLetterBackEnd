var pool = require('./sql_details');
const util = require('./users');
const config = require('./config');

function createTables(){
    pool.query('CREATE TABLE IF NOT EXISTS Users (UserID int NOT NULL AUTO_INCREMENT, Email varchar(255) NOT NULL, Password varchar(255) NOT NULL, PRIMARY KEY(UserID));');
    pool.query('CREATE TABLE IF NOT EXISTS Paragraphs (ParaID int NOT NULL AUTO_INCREMENT, UserID int NOT NULL, Paragraph varchar(2048), PRIMARY KEY(ParaID), FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE);');
    pool.query('CREATE TABLE IF NOT EXISTS Tags (TagID int NOT NULL AUTO_INCREMENT, ParaID int NOT NULL, Tag varchar(32), PRIMARY KEY(TagID), FOREIGN KEY (ParaID) REFERENCES Paragraphs(ParaID) ON DELETE CASCADE);');
}

async function retrieveUsers(email){
    const [rows, fields] = await pool.query("SELECT * FROM Users WHERE Email = ?", [email]);
    return rows;
}

async function loginCheck(email, password){
    const [rows, fields] = await pool.query("SELECT * FROM Users WHERE Email = ? AND Password = ?", [email, util.encryptPassword(password + config.SALT)]);
    return rows;
}

async function register(email, password){
    pool.execute("INSERT INTO Users (Email, Password) VALUES (?,?)",[email, util.encryptPassword(password + config.SALT)]);
}

module.exports = { createTables, retrieveUsers, register, loginCheck };
