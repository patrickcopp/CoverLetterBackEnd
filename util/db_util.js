var pool = require('./sql_details');
const config = require('./config');
const shajs = require('sha.js');

function createTables(){
    pool.query('CREATE TABLE IF NOT EXISTS Users (UserID int NOT NULL AUTO_INCREMENT, Email varchar(255) NOT NULL, Password varchar(255) NOT NULL, PRIMARY KEY(UserID));');
    pool.query('CREATE TABLE IF NOT EXISTS Paragraphs (ParaID int NOT NULL AUTO_INCREMENT, UserID int NOT NULL, Paragraph varchar(2048), PRIMARY KEY(ParaID), FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE);');
    pool.query('CREATE TABLE IF NOT EXISTS Tags (TagID int NOT NULL AUTO_INCREMENT, ParaID int NOT NULL, Tag varchar(32), PRIMARY KEY(TagID), FOREIGN KEY (ParaID) REFERENCES Paragraphs(ParaID) ON DELETE CASCADE);');
    pool.query('CREATE TABLE IF NOT EXISTS Login (UserID int NOT NULL, Cookie varchar(256), Created varchar(256), PRIMARY KEY(UserID), FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE);');
} 

async function retrieveUsers(email){
    const [rows, fields] = await pool.query("SELECT * FROM Users WHERE Email = ?", [email]);
    return rows;
}

async function loginCheck(email, password){
    const [rows, fields] = await pool.query("SELECT * FROM Users WHERE Email = ? AND Password = ?", [email, encryptPassword(password + config.SALT)]);
    return rows;
}

async function register(email, password){
    await pool.execute("INSERT INTO Users (Email, Password) VALUES (?,?)",[email, encryptPassword(password + config.SALT)]);
}

async function saveCookie(userID, cookie){
    await pool.execute("INSERT INTO Login (UserID, Cookie, Created) VALUES (?,?,?) ON DUPLICATE KEY UPDATE cookie = ?, Created = ?",[userID, cookie, new Date, cookie, new Date]);
}

async function cookieCheck(userID, cookie){
    const [rows, fields] = await pool.execute("SELECT * FROM Login WHERE UserID = ? AND Cookie = ?",[userID, cookie]);
    return rows;
}

async function saveParagraph(userID, paragraph){
    const [rows, fields] = await pool.execute("INSERT INTO Paragraphs (UserID, Paragraph) VALUES (?,?)",[userID, paragraph]);
    return rows.affectedRows == 1;
}

async function getParagraphs(userID){
    const [rows, fields] = await pool.execute("SELECT ParaID as ID, Paragraph FROM Paragraphs WHERE UserID = ?",[userID]);
    return rows;
}

async function updateParagraph(userID, paragraph, ID){
    console.log(userID+" "+paragraph+" "+ID)
    const rows = await pool.execute("Update Paragraphs SET Paragraph = ? WHERE ParaID = ? AND UserID = ?",[paragraph, ID, userID]);
    return rows.affectedRows == 1;
}

function encryptPassword(password){
    return shajs('sha256').update(password).digest('hex');
}

module.exports = { 
    createTables,
    retrieveUsers,
    register,
    loginCheck,
    saveCookie,
    cookieCheck,
    saveParagraph,
    getParagraphs,
    updateParagraph
};
