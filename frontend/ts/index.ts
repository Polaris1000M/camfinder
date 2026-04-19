function platformToColor(platform: string) {
    if(platform === "EBAY") {
        return "red";
    }
    else if(platform === "FACEBOOK") {
        return "blue";
    }
    else {
        return "green";
    }
}

function createCard(row: string[]) {
    const card = document.createElement("div");
    card.className = "col-4 card";
    const platform = row[3].toUpperCase();
    const color = `var(--${platformToColor(platform)})`;
    card.style.setProperty("--before-bg", color);
    card.style.setProperty("--hover-bg", color);
    card.innerHTML = `
        <div class="tag" style="background-color: ${color};">${platform}</div>
        <h2 class="bold-2">${row[0]}</h2>
        <div class="bold-3">${row[1]}</div>
        <div class="light-1">${row[2]}</div>
        <a class="light-1" href="${row[5]}" target="_blank">
            View Listing
            <i class="fas fa-external-link-alt"></i>
        </a>
    `;
    return card;
}

window.addEventListener("load", async () => {
    fetch("../data/data.tsv")
    .then(response => response.text())
    .then(csvText => {
        const data = csvText.split("\n").map(row => row.split("\t"));
        data.shift();
        const toNum = (str: string) => parseFloat(str.replace(/[$,]/g, ""));
        data.sort((a, b) => toNum(a[1]) - toNum(b[1]));
        
        const grid = document.querySelector(".grid");
        if(grid) data.forEach(row => grid.appendChild(createCard(row)));
    });
});
