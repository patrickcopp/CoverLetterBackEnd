const express = require('express')
const app = express()
const port = 3000
var pool = require('./sql_details');
bodyParser = require('body-parser');
const util = require('./util/users');
const config = require('./util/config');

app.use(bodyParser.json());


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  pool.query('CREATE TABLE IF NOT EXISTS Users (UserID int NOT NULL AUTO_INCREMENT, Email varchar(255) NOT NULL, Password varchar(255) NOT NULL, PRIMARY KEY(UserID));')
  pool.query('CREATE TABLE IF NOT EXISTS Paragraphs (ParaID int NOT NULL AUTO_INCREMENT, UserID int NOT NULL, Paragraph varchar(2048), PRIMARY KEY(ParaID), FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE);')
  pool.query('CREATE TABLE IF NOT EXISTS Tags (TagID int NOT NULL AUTO_INCREMENT, ParaID int NOT NULL, Tag varchar(32), PRIMARY KEY(TagID), FOREIGN KEY (ParaID) REFERENCES Paragraphs(ParaID) ON DELETE CASCADE);')

});



app.post('/register', async (req, res) => {
    res.setHeader('content-type', 'text/JSON');

    if (!util.emailValidator(req.body.email))
        return res.status(400).send(400, JSON.stringify({statusMessage: config.EMAIL_VERIFICATION_FAILURE}));
    if (!util.passwordValidator(req.body.password))
        return res.status(400).send(JSON.stringify({statusMessage: config.PASSWORD_VERIFICATION_FAILURE}));
    
    const [rows, fields] = await pool.query("SELECT * FROM Users WHERE Email = ?", [req.body.email]);
    if (rows.length > 0){
        console.log("DASDSA")
    }
    pool.execute("INSERT INTO Users (Email, Password) VALUES (?,?)",[req.body.email, util.encryptPassword(req.body.password + config.SALT)]);
    res.send();
});