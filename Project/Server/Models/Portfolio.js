const mysql = require('mysql2/promise');
const databaseModel = require('./databaseConnection');
const databaseConstants = databaseModel.databaseConstants;

class Portfolio {
    constructor(username) {
        this.username = username
        this.cryptoCurrencies = {};
    }

    async addItem(cryptocurrency, amount) {
        const con = await mysql.createConnection(databaseConstants);
        if (!(cryptocurrency.symbol in this.cryptoCurrencies)) {
            await con.execute( 'INSERT INTO portfolio (username, symbol, name) VALUES (?, ?, ?)',
                [this.username, cryptocurrency.symbol, cryptocurrency.name]
            )
        }

        await con.execute(
            'INSERT INTO transaction (username, symbol, amount, price, trans_date) VALUES (?,?,?,?,?)',
            [this.username, cryptocurrency.symbol, amount, cryptocurrency.price*amount, new Date()]);

        con.end();
        return {ok: true, message: "Success you purchased a coin!"}
    }

    async removeItem(cryptocurrency, amount) {
        amount = Number(amount)
        if (!this.cryptoCurrencies[cryptocurrency.symbol]) {
            return {ok: false, errorMessage: "You do not own any of these cryptos"};
        } else if (this.cryptoCurrencies[cryptocurrency.symbol].length < amount) {
            return {ok: false, errorMessage: "You do not own enough of these cryptos"};
        }

        const con = await mysql.createConnection(databaseConstants);
        if (this.cryptoCurrencies[cryptocurrency.symbol].length === amount) {
            await con.execute('DELETE FROM portfolio WHERE username=? AND symbol=?',
                [this.username, cryptocurrency.symbol]);
            await con.execute('DELETE FROM transaction WHERE username=? AND symbol=?',
                [this.username, cryptocurrency.symbol]);
        } else {
            await con.execute(
                'INSERT INTO transaction (username, symbol, amount, price, trans_date) VALUES (?,?,?,?,?)',
                [this.username, cryptocurrency.symbol, amount*-1, cryptocurrency.price*amount, new Date()]);
        }
        
        await con.end();
        return {ok: true, message: "Sold!"}
    }
}

exports.getPortfolio = async function (username) {
    const con = await mysql.createConnection(databaseConstants);
    const portfolio = new Portfolio(username);
    const cryptoCurrencies = {};
    // order by to ensure that sells come after
    const transactions = await con.execute('SELECT * FROM transaction WHERE username = ? ORDER BY amount DESC',
        [username]);
    for (const transaction of transactions[0]) {
        if(!cryptoCurrencies[transaction.symbol]) {
            cryptoCurrencies[transaction.symbol] = [];
        }
        if (transaction.amount > 0) {
            for(let i=0; i < transaction.amount; i++) {
                cryptoCurrencies[transaction.symbol].push(transaction.price / transaction.amount);
            }
        } else {
            cryptoCurrencies[transaction.symbol].splice(0, transaction.amount*-1);
        }
    }
    portfolio.cryptoCurrencies = cryptoCurrencies;
    return portfolio;
}
