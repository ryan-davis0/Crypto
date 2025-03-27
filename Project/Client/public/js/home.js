async function addData() {
    const firstRepsonse = await fetch("/api/cryptoData");
    const firstData = await firstRepsonse.json();

    const cryptoDataContainer = document.getElementById('cryptoData');
    cryptoDataContainer.innerHTML = "";
    addCryptoData(firstData);
}

// every 2 min
setInterval(addData, 1000 * 60 * 15);

document.addEventListener("DOMContentLoaded", async function () {
    const headers = document.querySelectorAll("th[id]");
    addData();
    const cryptoDataContainer = document.getElementById('cryptoData');
    headers.forEach(function (header) {
        header.style.cursor = "pointer";
        header.addEventListener("click", async function () {
            const table = header.closest("table");
            const rows = Array.from(table.querySelectorAll("tr"));
            const attribute = header.getAttribute("id");
            const isAscending = !table.classList.contains("asc");
            
            const body = { sortField: attribute }
            const context = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            };
            const response = await fetch('/api/cryptoData/sort', context);
            const data = await response.json();
            cryptoDataContainer.innerHTML = "";
            addCryptoData(data);
            table.classList.remove("asc", "desc");
            if (isAscending) {
                table.classList.add("asc");

            } else {
                table.classList.add("desc");
   
            }
        });
    });
});



function navigateTo(page) {
    window.location.href = page;
}


function addCryptoData(cryptocurrencies) {
    const cryptoDataContainer = document.getElementById('cryptoData');

    cryptocurrencies.forEach(crypto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="rank">${crypto.rank}</td>
            <td class="name clickable">${crypto.name}</td>
            <td class="symbol">${crypto.symbol}</td>
            <td class="price">${crypto.price}</td>
            <td class="change">${crypto.percentChange}</td>
            <td class="marketCap">${crypto.marketCap}</td>
            <td class="supply">${crypto.supply}</td>
            <td class="volume">${crypto.volume24hr}</td>
            <td class="vwPrice">${crypto.volumeWAP24hr}</td>
        `;

        
        const nameCell = row.querySelector(".clickable");
        nameCell.addEventListener("click", function () {
            window.location.href = `detail?symbol=${crypto.symbol}`;
        });

        cryptoDataContainer.appendChild(row);
    });
}
