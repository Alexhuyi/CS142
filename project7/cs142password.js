var randomBytes = require("crypto").randomBytes;
var createHash = require("crypto").createHash;

/*
 * Return a salted and hashed password entry from a
 * clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry
 * where passwordEntry is an object with two string
 * properties:
 *      salt - The salt used for the password.
 *      hash - The sha1 hash of the password and salt
 */
function makePasswordEntry(clearTextPassword) {
    let passwordEntry = {};
    passwordEntry.salt = randomBytes(16).toString('binary');
    let salted = clearTextPassword.concat(passwordEntry.salt);
    let input = createHash("sha1");
    input.update(salted);
    passwordEntry.hash = input.digest("hex");
    return passwordEntry;
}

/*
 * Return true if the specified clear text password
 * and salt generates the specified hash.
 * @param {string} hash
 * @param {string} salt
 * @param {string} clearTextPassword
 * @return {boolean}
 */
function doesPasswordMatch(hash, salt, clearTextPassword) {
    let input = createHash("sha1");
    let salted = clearTextPassword.concat(salt);
    input.update(salted);
    let digest = input.digest("hex");
    if (digest === hash) {
    return true;
    } else {
    return false;
    }
}

module.exports =  {makePasswordEntry,doesPasswordMatch};
