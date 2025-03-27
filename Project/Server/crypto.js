const path = require('path')
const express = require("express");
const app = express();
const port = 1337;

// Serve static files from the 'Client/public' directory
app.use(express.static("Client/public"));

const bodyParser = require("body-parser");
app.use(express.json()); // For parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true, // For parsing application/x-www-form-urlencoded
  })
);

// Include and use cookie-parser for handling cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Set EJS as the view engine and define the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Client/views'));

// Require controller modules for handling specific routes
var cryptoController = require("./Controllers/CryptoController");
var portfolioController = require("./Controllers/PortfolioController");
var accountController = require("./Controllers/AccountController");

// Define the root route and send the index.html file as a response
app.get("/", function (req, res) {
    res.sendFile("index.html", { root: "./Client/views" });
});

// Define the route for the home page, checking user login status
app.get("/home", function (req, res) {
    let userIsLoggedIn = req.cookies && req.cookies.username;
    res.render("home", {userIsLoggedIn: userIsLoggedIn});
});

// Define the route for the detail page, rendering it with specific coin data
app.get("/detail", function (req, res) {
    let userIsLoggedIn = req.cookies && req.cookies.username;
    const coin = cryptoController.searchCurrency(req.query.symbol);
    if (!coin) {
        res.redirect('/home');
    } else {
        res.render("detail", {coin: coin, userIsLoggedIn: userIsLoggedIn});
    }
});

// Define routes for portfolio, account, register, login, and logout
app.get("/portfolio", function (req, res) {
    res.sendFile("portfolio.html", { root: "./Client/views" });
});
app.get("/account", accountController.getAccountInfo );
app.get("/register", function (req, res) {
    res.sendFile("register.html", { root: "./Client/views" });
});
app.post("/register", accountController.createAccount);
app.get("/login", function (req, res) {
    res.sendFile("login.html", { root: "./Client/views" });
});
app.post("/login", accountController.login);
app.get("/logout", accountController.logout);

// Include Axios for making HTTP requests
const axios = require('axios');
// Initialize a variable to store the response from the API
let response = null;

// Define a function to fetch and process cryptocurrency data from an API
const getNewData = async () => {
    // Request data from the CoinMarketCap API
    response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', 
        { headers: { 'X-CMC_PRO_API_KEY': '1492d15d-5887-49c2-ab95-c85613563d1f'}});

    let arr = cryptoData.getCryptoCurrencies();
    const json = response.data.data;
    
    for (const x of json) {
        let obj = {
            rank: x.cmc_rank,
            name: x.name,
            symbol: x.symbol,
            price: x.quote.USD.price,
            percentChange: x.quote.USD.percent_change_24h,
            marketCap: x.quote.USD.market_cap,
            supply: x.total_supply,
            volume24hr: x.quote.USD.volume_24h,
            volumeWAP24hr: x.quote.USD.volume_change_24h
        };
        arr.push(obj);
    }
};

// Invoke the function to fetch new data
getNewData();

// Define API routes for handling requests related to cryptocurrency data and portfolio
app.route("/api/cryptoData").get(cryptoController.getCurrencies);
app.route("/api/cryptoData/:id").get(cryptoController.getCurrency);
app.route("/api/cryptoData/sort").post(cryptoController.sortCurrencies);
app.route("/api/cryptoData/search").post(cryptoController.searchCurrencies);
app.route("/api/portfolio/:id")
  .patch(portfolioController.addCrypto)
  .delete(portfolioController.removeCrypto);
app.route("/api/portfolio").get(portfolioController.getPortfolio);

// Start the server and log that it is listening on the specified port
app.listen(port, () => {
  console.log(`Crypto Website listening on port ${port}`);
});
