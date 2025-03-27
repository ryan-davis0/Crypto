document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('submitForm').addEventListener('click', onFormSubmit);
    const headers = document.querySelectorAll("th[id]");
    headers.forEach(function (header) {
        header.style.cursor = "pointer";
        header.addEventListener("click", function () {
            const table = header.closest("table");
            const rows = Array.from(table.querySelectorAll("tr"));
            const columnIndex = header.cellIndex;
            const type = header.getAttribute("id");
            const isAscending = !table.classList.contains("asc");
            // Sort rows based on the clicked header
            rows.sort(function (a, b) {
                if (a === table.rows[0] || b === table.rows[0]) {
                    return 0;
                }

                let aValue = a.cells[columnIndex].textContent;
                let bValue = b.cells[columnIndex].textContent;

                if (type === "currentPrice" || type === "purchasePrice" || type === "baseValue" || type === "currentValue" || type === "valueChange") {
                    aValue = parseFloat(aValue.replace(/[^0-9.-]+/g, "")) || 0;
                    bValue = parseFloat(bValue.replace(/[^0-9.-]+/g, "")) || 0;
                } else if (type === "percentChange") {
                    aValue = parseFloat(aValue) || 0;
                    bValue = parseFloat(bValue) || 0;
                }

                if (isAscending) {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            });

            table.classList.remove("asc", "desc");
            if (isAscending) {
                table.classList.add("asc");

            } else {
                table.classList.add("desc");

            }

            const tbody = table.querySelector("tbody");
            rows.forEach(function (row) {
                tbody.appendChild(row);
            });
        });
    });
});

// Function to fetch and add portfolio data
async function addPortfolioData() {
    const portfolioDataContainer = document.getElementById('portfolioData');
    const response = await fetch('/api/portfolio');
    const responseData = await response.json();
    const currentCryptos = responseData.currentCryptos;
    const portfolio = responseData.portfolio;
    portfolioDataContainer.innerHTML = "";
    for (let symbol in portfolio.cryptoCurrencies) {
        let sumSymbolPrice = 0;
        for (const price of portfolio.cryptoCurrencies[symbol]) {
            sumSymbolPrice += price;
        }

        let currentPrice = currentCryptos[symbol].price;
        let amount = portfolio.cryptoCurrencies[symbol].length;

        // Skip rows where the amount is 0
        if (amount === 0) {
            continue;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="name clickable">${currentCryptos[symbol].name}</td>
            <td class="symbol">${symbol}</td>
            <td class="currentPrice">${currentPrice}</td>
            <td class="amount">${amount}</td>
            <td class="purchasePrice">${sumSymbolPrice / amount}</td>
            <td class="baseValue">${sumSymbolPrice}</td>
            <td class="currentValue">${amount * currentPrice}</td>
            <td class="valueChange">${sumSymbolPrice - (amount * currentPrice)}</td>
            <td class="percentChange">${(sumSymbolPrice - (amount * currentPrice)) / sumSymbolPrice}</td>
        `;

 
        row.innerHTML = row.innerHTML.replace(/NaN/g, '0');

        portfolioDataContainer.appendChild(row);

        const nameCell = row.querySelector(".clickable");
        nameCell.addEventListener("click", function () {
            window.location.href = `detail?symbol=${crypto.symbol}`;
        });
    }
}

addPortfolioData();

const homeOption = document.getElementById("homeOption");
const portfolioOption = document.getElementById("portfolioOption");
const accountOption = document.getElementById("accountOption");
const logoutOption = document.getElementById("logoutOption");

async function onFormSubmit() {
    const symbol = document.getElementById('symbolInput').value;
    const amount = document.getElementById('amountInput').value;
    let transaction = document.getElementById('transaction');
    transaction = transaction.options[transaction.selectedIndex].value;
    console.log(symbol);

    const url = `/api/portfolio/${symbol}`;
    let method;
    if (transaction === "buy") {
        method = "PATCH";
    } else {
        method = "DELETE";
    }
    const otherInfo = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount })
    };
    const response = await fetch(url, otherInfo);
    const responseData = await response.json();
    console.log(responseData);
    if (responseData.ok) {
        addPortfolioData();
        alert(responseData.message);
    } else {
        alert(responseData.errorMessage);
    }
}

function navigateTo(page) {
    window.location.href = page;
}
