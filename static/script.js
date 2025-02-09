// document.getElementById("userInput").addEventListener("keypress", function(event) {
//     if (event.key === "Enter") {
//         event.preventDefault();
//         sendRequest();
//     }
// });

// async function sendRequest() {
//     let inputText = document.getElementById("userInput").value;
//     let responseContainer = document.getElementById("response");

//     let response = await fetch("/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ input: inputText })
//     });

//     let data = await response.json();
//     let formattedResponse = formatResponse(data.output);

//     let scrollPosition = window.scrollY;

//     responseContainer.innerHTML = `<div class="response-container">${formattedResponse}</div>`;

//     window.scrollTo(0, scrollPosition);
// }

// function formatResponse(text) {
//     let categories = text.split("**").filter(item => item.trim() !== "");
//     let outputHTML = "";

//     categories.forEach(category => {
//         let lines = category.split("*").filter(line => line.trim() !== "");
//         let title = lines.shift().trim();
//         outputHTML += `<h3>${title}</h3><ul>`;
//         lines.forEach(item => {
//             outputHTML += `<li>${item.trim()}</li>`;
//         });
//         outputHTML += `</ul>`;
//     });

//     return outputHTML;
// }
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
    // Check if the text contains bullet points or numbered lists
    const hasBulletPoints = /^[-•*]\s/m.test(text);
    const hasNumberedList = /^\d+[\.)]\s/m.test(text);
    
    if (hasBulletPoints || hasNumberedList) {
        return formatListResponse(text);
    } else if (text.includes("**")) {
        return formatCategorizedResponse(text);
    } else {
        return formatParagraphResponse(text);
    }
}

function formatListResponse(text) {
    // Split the text into lines
    let lines = text.split('\n').filter(line => line.trim() !== '');
    let outputHTML = '<ul>';
    let inList = false;
    let currentTitle = '';

    lines.forEach(line => {
        // Check if line is a title (not starting with bullet point or number)
        if (!line.match(/^[-•*]\s/) && !line.match(/^\d+[\.)]\s/)) {
            if (inList) {
                outputHTML += '</ul>';
                inList = false;
            }
            outputHTML += `<h3>${line}</h3><ul>`;
            inList = true;
        } else {
            // Remove bullet point or number and add as list item
            let cleanLine = line.replace(/^[-•*]\s|\d+[\.)]\s/, '');
            outputHTML += `<li>${cleanLine}</li>`;
        }
    });

    if (inList) {
        outputHTML += '</ul>';
    }

    return outputHTML;
}

function formatCategorizedResponse(text) {
    let categories = text.split("**").filter(item => item.trim() !== "");
    let outputHTML = "";

    categories.forEach(category => {
        let lines = category.split("*").filter(line => line.trim() !== "");
        let title = lines.shift().trim();
        outputHTML += `<h3>${title}</h3><ul>`;
        lines.forEach(item => {
            outputHTML += `<li>${item.trim()}</li>`;
        });
        outputHTML += '</ul>';
    });

    return outputHTML;
}

function formatParagraphResponse(text) {
    // Split by double newlines to separate paragraphs
    let paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
    let outputHTML = '';

    paragraphs.forEach(paragraph => {
        // Check if paragraph looks like a header
        if (paragraph.length < 50 && paragraph.endsWith(':')) {
            outputHTML += `<h3>${paragraph}</h3>`;
        } else {
            outputHTML += `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
        }
    });

    return outputHTML;
}