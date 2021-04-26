const express = require('express')
const app = express()
const port = 3000
bodyParser = require('body-parser');
const util = require('./util/users');
const config = require('./util/config');
const db = require('./util/db_util');
const cookieParser = require('cookie-parser');
const fs = require('fs')
const path = require('path')


app.use(bodyParser.json());
app.use(cookieParser());

db.createTables().then(() =>
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
);




app.post('/register', async (req, res) => {
    res.setHeader('content-type', 'text/JSON');
    if (!util.emailValidator(req.body.email))
        return res.status(400).send(JSON.stringify({statusMessage: config.EMAIL_VERIFICATION_FAILURE}));
    if (!util.passwordValidator(req.body.password))
        return res.status(400).send(JSON.stringify({statusMessage: config.PASSWORD_VERIFICATION_FAILURE}));
    rows = await db.retrieveUsers(req.body.email);
    if (rows.length != 0)
        return res.status(403).send(JSON.stringify({statusMessage: config.ACCOUNT_ALREADY_EXISTS}));
    await db.register(req.body.email, req.body.password);
    res.send();
}); 

app.post('/login', async (req, res) => {
    res.setHeader('content-type', 'text/JSON');
    if (!util.emailValidator(req.body.email))
        return res.status(400).send(JSON.stringify({statusMessage: config.EMAIL_VERIFICATION_FAILURE}));
    
    rows = await db.loginCheck(req.body.email, req.body.password);

    if (rows.length != 1)
        return res.status(403).send(JSON.stringify({statusMessage: config.LOGIN_FAILED}));
    
    userCookie = util.generateUUID();
    await db.saveCookie(rows[0]['UserID'], userCookie);
    res.cookie('login',userCookie);
    res.cookie('userID',rows[0]['UserID'])

    return res.send(JSON.stringify({statusMessage: config.LOGIN_SUCCESSFUL}));
});

app.post('/paragraph', async (req, res) => {
    res.setHeader('content-type', 'text/JSON');
    if (!await loggedIn(req.cookies))
        return res.status(403).send(JSON.stringify({statusMessage: config.NOT_LOGGED_IN}));
    if(req.body.paragraph == undefined || req.body.paragraph.length > 2047)
        return res.status(404).send(JSON.stringify({statusMessage: config.INVALID_REQUEST}));

    if (req.body.ID != undefined){
        if (!await db.updateParagraph(req.cookies.userID, req.body.paragraph, req.body.ID))
            return res.status(403).send(JSON.stringify({statusMessage: config.FORBIDDEN_REQUEST}));
    }
    else
        await db.saveParagraph(req.cookies.userID, req.body.paragraph);
    res.send();
});

app.get('/paragraph', async (req, res) => {
    res.setHeader('content-type', 'text/JSON');
    if (!await loggedIn(req.cookies))
        return res.status(403).send(JSON.stringify({statusMessage: config.NOT_LOGGED_IN}));
    
    paragraphs = await db.getParagraphs(req.cookies.userID);
    res.send(JSON.stringify(paragraphs));
});

app.post('/tags', async (req, res) => {
    res.setHeader('content-type', 'text/JSON');
    if (!await loggedIn(req.cookies))
        return res.status(403).send(JSON.stringify({statusMessage: config.NOT_LOGGED_IN}));
    if(req.body.paragraphID == undefined || req.body.tags == undefined)
        return res.status(404).send(JSON.stringify({statusMessage: config.INVALID_REQUEST}));
    if (req.body.tags.length > 30)
        return res.status(404).send(JSON.stringify({statusMessage: config.TOO_MANY_TAGS}));
    if (!await db.updateTags(req.cookies.userID, req.body.paragraphID, req.body.tags))
        return res.status(403).send(JSON.stringify({statusMessage: config.FORBIDDEN_REQUEST}));

    res.send();
});

app.use( express.static( path.resolve( __dirname, "../public" ) ) );


app.get('/', async (req, res) =>{
    if (! await loggedIn(req.cookies))
        return res.status(403).send(JSON.stringify({statusMessage: config.NOT_LOGGED_IN}));
    fs.readFile(path.resolve('./public/index.html'), 'utf-8', (err,data) => {
        if(err){
            console.log(err);
            return res.status(500).send("Something bad happened :(")
        }
        return res.send(data);
    });
})
app.get('/style.css',function(req, res){
    res.sendFile(path.join('./public/style.css'));
});
  
app.get('/index.js',function(req, res){
    fs.readFile(path.join('./public/index.js'), 'utf8', function(err, data) {
      res.contentType('application/javascript');
      res.send(data);
    });
});

app.get('/login', (req, res) => {
    fs.readFile(path.resolve('./public/login.html'), 'utf-8', (err,data) => {
        if(err){
            console.log(err);
            return res.status(500).send("Something bad happened :(")
        }
        return res.send(data);
    });
});

app.get('/login.js',function(req, res){
    fs.readFile(path.join('./public/login.js'), 'utf8', function(err, data) {
      res.contentType('application/javascript');
      res.send(data);
    });
});



async function loggedIn(cookies){
    if(cookies==undefined || cookies['userID']==undefined || cookies['login']==undefined)
        return false;
    return await util.cookieLogin(cookies['userID'], cookies['login']);
}