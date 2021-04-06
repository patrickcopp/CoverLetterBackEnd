var shajs = require('sha.js')

function emailValidator(email)
{
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}

function passwordValidator(password)
{
    return password.length == 32;
}

function encryptPassword(password)
{
    return shajs('sha256').update(password).digest('hex');
}

module.exports = { emailValidator, passwordValidator, encryptPassword };
