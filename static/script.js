document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendRequest();
    }
});

async function sendRequest() {
    let inputText = document.getElementById("userInput").value;
    let responseContainer = document.getElementById("response");

    let response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputText })
    });

    let data = await response.json();
    let formattedResponse = formatResponse(data.output);

    let scrollPosition = window.scrollY;

    responseContainer.innerHTML = `<div class="response-container">${formattedResponse}</div>`;

    window.scrollTo(0, scrollPosition);
}

function formatResponse(text) {
    let categories = text.split("**").filter(item => item.trim() !== "");
    let outputHTML = "";

    categories.forEach(category => {
        let lines = category.split("*").filter(line => line.trim() !== "");
        let title = lines.shift().trim();
        outputHTML += `<h3>${title}</h3><ul>`;
        lines.forEach(item => {
            outputHTML += `<li>${item.trim()}</li>`;
        });
        outputHTML += `</ul>`;
    });

    return outputHTML;
}
