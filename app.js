const express = require('express')
const app = express()
const port = 3000
bodyParser = require('body-parser');
const util = require('./util/users');
const config = require('./util/config');
const db = require('./util/db_util');

app.use(bodyParser.json());


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    db.createTables();
});



app.post('/register', async (req, res) => {
    res.setHeader('content-type', 'text/JSON');
    if (!util.emailValidator(req.body.email))
        return res.status(400).send(400, JSON.stringify({statusMessage: config.EMAIL_VERIFICATION_FAILURE}));
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
        return res.status(400).send(400, JSON.stringify({statusMessage: config.EMAIL_VERIFICATION_FAILURE}));
    
    rows = await db.loginCheck(req.body.email, req.body.password);

    if (rows.length != 0)
        return res.status(403).send(JSON.stringify({statusMessage: config.LOGIN_FAILED}));
    res.send();
});