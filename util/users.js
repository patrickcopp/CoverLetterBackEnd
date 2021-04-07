const shajs = require('sha.js');
const {v4: uuidv4} = require('uuid');
function emailValidator(email){
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}

function passwordValidator(password){
    return password.length == 32;
}

function encryptPassword(password){
    return shajs('sha256').update(password).digest('hex');
}

function generateUUID(){
    return uuidv4();
}

module.exports = { 
    emailValidator,
    passwordValidator,
    encryptPassword,
    generateUUID
 };
