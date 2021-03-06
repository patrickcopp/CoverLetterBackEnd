var pool = require('./sql_details');
const config = require('./config');
const shajs = require('sha.js');

async function createTables(){
    await pool.query('CREATE TABLE IF NOT EXISTS Users (UserID int NOT NULL AUTO_INCREMENT, Email varchar(255) NOT NULL, Password varchar(255) NOT NULL, PRIMARY KEY(UserID));');
    await pool.query('CREATE TABLE IF NOT EXISTS Paragraphs (ParaID int NOT NULL AUTO_INCREMENT, UserID int NOT NULL, Paragraph varchar(2048), PRIMARY KEY(ParaID), FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE);');
    await pool.query('CREATE TABLE IF NOT EXISTS Tags (TagID int NOT NULL AUTO_INCREMENT, ParaID int NOT NULL, Tag varchar(32), PRIMARY KEY(TagID), FOREIGN KEY (ParaID) REFERENCES Paragraphs(ParaID) ON DELETE CASCADE);');
    await pool.query('CREATE TABLE IF NOT EXISTS Login (UserID int NOT NULL, Cookie varchar(256), Created varchar(256), PRIMARY KEY(UserID), FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE);');
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
    await pool.query("INSERT INTO Users (Email, Password) VALUES (?,?)",[email, encryptPassword(password + config.SALT)]);
}

async function saveCookie(userID, cookie){
    await pool.query("INSERT INTO Login (UserID, Cookie, Created) VALUES (?,?,?) ON DUPLICATE KEY UPDATE cookie = ?, Created = ?",[userID, cookie, new Date, cookie, new Date]);
}

async function cookieCheck(userID, cookie){
    const [rows, fields] = await pool.query("SELECT * FROM Login WHERE UserID = ? AND Cookie = ?",[userID, cookie]);
    return rows;
}

async function saveParagraph(userID, paragraph){
    const [rows, fields] = await pool.query("INSERT INTO Paragraphs (UserID, Paragraph) VALUES (?,?)",[userID, paragraph]);
    return rows.affectedRows == 1;
}

async function getParagraphs(userID){
    const [rows, fields] = await pool.query("SELECT ParaID as ID, Paragraph FROM Paragraphs WHERE UserID = ?",[userID]);
    return rows;
}

async function updateParagraph(userID, paragraph, ID){
    console.log(userID+" "+paragraph+" "+ID)
    const rows = await pool.query("Update Paragraphs SET Paragraph = ? WHERE ParaID = ? AND UserID = ?",[paragraph, ID, userID]);
    return rows[0].affectedRows == 1;
}

async function updateTags(userID, paragraphID, tags){
    if(!await paragraphBelongsTo(userID,paragraphID))
        return false;
    await deleteTags(userID, paragraphID);
    tagsAndIDs = [];
    tags.forEach(element => {
        tagsAndIDs.push([paragraphID,element])
    });
    if (tags.length > 0)
        await pool.query("INSERT INTO Tags (ParaID,Tag) VALUES ?",[tagsAndIDs]);
    return true;
}

async function paragraphBelongsTo(userID, paragraphID){
    const [rows, fields] = await pool.query("SELECT COUNT(*) FROM Paragraphs WHERE ParaID = ? AND UserID = ?",[paragraphID,userID]);
    return rows[0]["COUNT(*)"] == 1;
}

async function deleteTags(userID, paragraphID){
    await pool.query("DELETE FROM Tags WHERE ParaID = ?",[paragraphID]);
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
    updateParagraph,
    updateTags
};
