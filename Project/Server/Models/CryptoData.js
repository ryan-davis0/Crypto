class CryptoData {
    constructor() {
        this.cryptoCurrencies = [];
        this.currentSort;
        this.currentSortAsc = false;
        this.searchResults = [];
        this.searchQuery;
        this.currentCrypto;
    }

    sort(sortAttribute) {
        if (sortAttribute === this.currentSort && this.currentSortAsc) {
            this.currentSortAsc = false;
        } else {
            this.currentSortAsc = true;
        }
        this.currentSort = sortAttribute;
        if (this.currentSortAsc) {
            this.cryptoCurrencies.sort(
                (a, b) => {
                    return a[sortAttribute] > b[sortAttribute] ? 1 : -1
                }
            )
        } else {
            this.cryptoCurrencies.sort(
                (a, b) => {
                    return b[sortAttribute] > a[sortAttribute] ? 1 : -1
                }
            )
        }
    }

    getCryptoCurrencies() {
        return this.cryptoCurrencies;
    }
}

let cryptoData = new CryptoData();

exports.cryptoData = cryptoData;
