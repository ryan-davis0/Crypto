//Import Portfolio model
let portfolio = require("../Models/Portfolio");

//Import CryptoController for searching cryptocurrencies
let cryptoController = require("../Controllers/CryptoController");

//Add a cryptocurrency to the portfolio
exports.addCrypto = async function(req, res) {
    let userIsLoggedIn = req.cookies && req.cookies.username;
    if (!userIsLoggedIn) {
        res.send(JSON.stringify({ok: false, errorMessage: "Please log in!"}));
        return;
    }
    const p = await portfolio.getPortfolio(req.cookies.username);
    const id = req.params.id;
    const amount = req.body.amount;
    const crypto = cryptoController.searchCurrency(id);
    if (!crypto) {
        res.send(JSON.stringify({ok: false, errorMessage: "Could not find coin!"}));
        return;
    } else if (!amount) {
        res.send(JSON.stringify({ok: false, errorMessage: "There was no amount"}));
        return;
    } 

    const result = await p.addItem(crypto, amount);
    console.log(result)
    res.send(JSON.stringify(result));
}

//Remove a cryptocurrency from the portfolio
exports.removeCrypto = async function(req, res) {
    let userIsLoggedIn = req.cookies && req.cookies.username;
    if (!userIsLoggedIn) {
        res.send(JSON.stringify({ok: false, errorMessage: "Please log in!"}));
        return;
    }
    const p = await portfolio.getPortfolio(req.cookies.username);
    const id = req.params.id;
    const amount = req.body.amount;
    const crypto = cryptoController.searchCurrency(id);
    if (!crypto) {
        res.send(JSON.stringify({ok: false, errorMessage: "Could not find coin!"}));
        return;
    } else if (!amount) {
        res.send(JSON.stringify({ok: false, errorMessage: "There was no amount"}));
        return;
    } 
    const result = await p.removeItem(crypto, amount);
    console.log(result)
    res.send(JSON.stringify(result));
}

//Get the state of the portfolio
exports.getPortfolio = async function(req, res) {
    let userIsLoggedIn = req.cookies && req.cookies.username;
    if (!userIsLoggedIn) {
        res.send(JSON.stringify({ok: false, errorMessage: "Please log in!"}));
        return;
    }
    const p = await portfolio.getPortfolio(req.cookies.username);
    const currentCryptos = {};
    for (let symbol in p.cryptoCurrencies) {
        currentCryptos[symbol] = cryptoController.searchCurrency(symbol);
    }
    //Send the current portfolio content
    res.send(JSON.stringify({portfolio: p, currentCryptos: currentCryptos}));
}

//Get the current value of the portfolio
exports.getPortfolioValue = function(req, res) {
   
}

//Get the historical value of the portfolio
exports.getPortfolioValueHistory = function(req, res) {
    
}