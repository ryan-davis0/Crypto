//Account model
let account = require("../Models/Account");

//user login
exports.login = async function (req, res) {
    //Username and password from request 
    const { username, password } = req.body;

    //Check if the login credentials are ok
    const shouldLogInUser = await account.login(username, password);
    if (shouldLogInUser) {
        res.cookie('username', username, {maxAge: 1000*60*15});
        res.redirect('/home');
    } else {
        //Return an unauthorized status if the credentials are invalid
        res.status(401).send("Invalid credentials");
    }
};

//User logout
exports.logout = function (req, res) {
    //Call the logout method from the Account model
    res.clearCookie('username');
    res.redirect('/home');
};

//Account creation
exports.createAccount = async function (req, res) {
    //Username and password from the request 
    const { firstname, lastname, dob, username, password, confirm_password } = req.body;
    if( password !== confirm_password ) {
        res.status(400).send("The passwords do not match");
        return
    }

    //Create a new account
    if (await account.createAccount(firstname, lastname, dob, username, password)) {
        res.cookie('username', username, {maxAge: 1000*60*15});
        res.redirect('/home');
        return
    } else {
        //Return a bad request status if account creation fails
        res.status(400).send("Account creation failed. Username may already exist.");
        return
    }
};

//Account deletion
exports.deleteAccount = function (req, res) {
    //Delete the current account
    if (account.deleteAccount()) {
        res.send("Account deleted successfully");
    } else {
        //Return a bad request status if account deletion fails
        res.status(400).send("Account deletion failed");
    }
};

// Retrieve account information
exports.getAccountInfo = async function (req, res) {
    let userIsLoggedIn = req.cookies && req.cookies.username;
    if (!userIsLoggedIn) {
        res.redirect('/login');
        return;
    }
    // Get information about the current account
    const accountInfo = await account.getAccountInfo(req.cookies.username);
    res.render('account', { account: accountInfo });
};