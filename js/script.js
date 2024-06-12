let startTime;

function displayMessage(message) {
    console.log(message);
    document.getElementById("debugMessages").innerText = message;
}

function displayError(errorMessage) {
    console.error(errorMessage);
    document.getElementById("debugMessages").innerText = errorMessage;
    document.getElementById("response").innerHTML = `<p>${errorMessage}</p>`;
    document.getElementById("loading").style.display = "none";
}

function displayResponse(response) {
    console.log("Response received:", response);
    displayMessage("Response received from server");
    const endTime = new Date().getTime();
    const responseTime = (endTime - startTime) / 1000; // Convert to seconds
    console.log("Response time:", responseTime, "seconds");

    let responseHTML = "<ul>";
    for (const key in response) {
        responseHTML += `<li><strong>${key}:</strong> ${JSON.stringify(response[key])}</li>`;
    }
    responseHTML += "</ul>";

    document.getElementById("response").innerHTML = responseHTML;

    const responseTimeMessage = `<p>Response time: ${responseTime} seconds</p>`;
    document.getElementById("response").innerHTML += responseTimeMessage;

    document.getElementById("loading").style.display = "none";
}

async function sendRequest(data) {
    displayMessage("Sending request to server...");
    document.getElementById("loading").style.display = "block";

    try {
        const response = await Promise.race([
            fetch('https://c700-95-60-72-15.ngrok-free.app/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), 15000)
            )
        ]);

        if (!response.ok) {
            throw new Error(`Error requesting service. Error code: ${response.status}`);
        }

        const responseData = await response.json();
        displayResponse(responseData);
    } catch (error) {
        displayError(`Failed to fetch: ${error.message}`);
    }
}

function consultarServicio() {
    const data = {
        model: "metrica-v03",
        prompt: "last_system_turn: im talking with john?\ncurrent_user_input: i give u a 4",
        stream: false,
        raw: false,
        keep_alive: "3600m",
        options: {
            temperature: 0
        }
    };

    sendRequest(data);
}

function mostrarRespuesta(responseData) {
    const responseHTML = `
        <p>Respuesta recibida del servidor:</p>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
    `;
    document.getElementById("response").innerHTML = responseHTML;
}

function mostrarError(errorMessage) {
    const errorHTML = `
        <p>Error al realizar la solicitud:</p>
        <p>${errorMessage}</p>
    `;
    document.getElementById("response").innerHTML = errorHTML;
}

document.getElementById("submitButton").addEventListener("click", function() {
    consultarServicio();
});
