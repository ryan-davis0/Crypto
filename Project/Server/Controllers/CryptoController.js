let cryptoDataModel = require("../Models/CryptoData");
const cryptoData = cryptoDataModel.cryptoData;

//Get all cryptocurrencies
exports.getCurrencies = (req, res) => {
    res.send(cryptoData.getCryptoCurrencies().slice(0, 100));
}

//Function to search for a specific cryptocurrency by symbol
function searchCurrencyHelper(id) {
    let arr = cryptoData.getCryptoCurrencies();
    return arr.find(obj => obj.symbol === id);
}

//Search for a cryptocurrency by symbol
exports.searchCurrency = id => searchCurrencyHelper(id);

//Details for a specific cryptocurrency by ID
exports.getCurrency = (req, res) => {
    let result = searchCurrencyHelper(req.params.id);
    res.send(result ? result : 'Cryptocurrency not found');
}

//Sort cryptocurrencies based on the field and direction
exports.sortCurrencies = (req, res) => {
    let field = req.body.sortField;
    cryptoData.sort(field);

    res.send(cryptoData.getCryptoCurrencies().slice(0, 100));
}

//Search for cryptocurrencies based on the field, operator, and value
exports.searchCurrencies = (req, res) => {
    let { sortField, operator, value } = req.body;

    //Request body
    if (!sortField || !operator || !value) {
        return res.status(400).send('Missing required fields in the request body');
    }

    //Validate operator
    let validOperators = ["==", "<", "<=", ">", ">=", "!="];
    if (!validOperators.includes(operator)) {
        return res.status(400).send('Invalid operator');
    }

    let arr = cryptoData.getCryptoCurrencies();
    let ans = arr.filter(obj => {
        switch (operator) {
            case "==": return obj[sortField] == value;
            case "<": return obj[sortField] < value;
            case "<=": return obj[sortField] <= value;
            case ">": return obj[sortField] > value;
            case ">=": return obj[sortField] >= value;
            case "!=": return obj[sortField] != value;
        }
    });

    res.send(ans);
};

//View details for a specific cryptocurrency
exports.viewDetail = (req, res) => {
    
}