require('dotenv').config();

let EMAIL_VERIFICATION_FAILURE = "email.verification.failed";
let PASSWORD_VERIFICATION_FAILURE = "password.verification.failed";
let ACCOUNT_ALREADY_EXISTS = "account.already.exists";
let LOGIN_FAILED = "login.failed";
let LOGIN_SUCCESSFUL = "login.successful";
let NOT_LOGGED_IN = 'not.logged.in';
let SALT = process.env.SALT;
let LOGIN_HOURS = 4;

module.exports = { 
    EMAIL_VERIFICATION_FAILURE,
    PASSWORD_VERIFICATION_FAILURE,
    ACCOUNT_ALREADY_EXISTS,
    LOGIN_FAILED,
    LOGIN_SUCCESSFUL,
    LOGIN_HOURS,
    NOT_LOGGED_IN,
    SALT
};