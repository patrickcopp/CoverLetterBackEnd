const {v4: uuidv4} = require('uuid');
const db = require('./db_util');
const config = require('./config');

function emailValidator(email){
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) && email.length < 50;
}

function passwordValidator(password){
    return password.length < 50 && password.length > 7;
}

function generateUUID(){
    return uuidv4();
}

async function cookieLogin(userID, loginCookie){
    rows = await db.cookieCheck(userID, loginCookie);
    if (rows.length != 1){
        return false;
    }
    date = new Date(rows[0]['Created'])
    date.setTime(date.getTime()+ (config.LOGIN_HOURS*60*60*1000));
    return new Date < date;
}

module.exports = { 
    emailValidator,
    passwordValidator,
    generateUUID,
    cookieLogin
};
