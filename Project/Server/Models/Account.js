// Require necessary modules and files
const mysql = require('mysql2/promise');
const databaseModel = require('./databaseConnection');
const databaseConstants = databaseModel.databaseConstants;
const crypto = require('crypto');

// Function to hash a string using SHA-256
function makeHashed (notHashed) {
    const hashAlg = crypto.createHash('sha256');
    hashAlg.update(notHashed);
    return hashAlg.digest('hex');
}

// Exported function for logging in a user
exports.login = async function (username, password) {
    const hashedPassword = makeHashed(password);
    // Creating a connection to the database
    const con = await mysql.createConnection(databaseConstants);
    // Querying the database for the user
    const accounts = await con.execute('SELECT * FROM account WHERE username=?', [username])
    // Checking if the account exists and if the password matches
    if (accounts[0][0]) {
        return accounts[0][0].password === hashedPassword;
    } else {
        return false
    }
}

// Exported function to create a new user account
exports.createAccount = async function (firstname, lastname, dob, username, password) {
    let con;
    try {
        con = await mysql.createConnection(databaseConstants);
        // Inserting the new user's data into the database
        con.execute("INSERT INTO account (firstname, lastname, dob, username, password) VALUES (?,?,?,?,?);",
            [firstname, lastname, dob, username, makeHashed(password)]);
        // Closing the database connection
        await con.end();
        return true;
    } catch (err) {
        // Logging the error and closing the connection in case of failure
        console.log(err)
        await con.end();
        return false;
    }
}

// Exported function to retrieve account information
exports.getAccountInfo = async function (username) {
    // Creating a connection to the database
    const con = await mysql.createConnection(databaseConstants);
    // Querying the database for the user
    const account = (await con.execute('SELECT * FROM account WHERE username=?', [username]))[0][0];
    // Closing the database connection and returning the account info
    con.end();
    return account
}
