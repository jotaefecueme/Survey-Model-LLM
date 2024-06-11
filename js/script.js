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
            fetch(`${serverIP}:${serverPort}${apiEndpoint}`, {
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

// Función para realizar la consulta al servicio
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

    fetch('http://95.60.72.15:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        // Devolver la respuesta como JSON
        return response.json();
    })
    .then(data => {
        // Manejar los datos de la respuesta
        console.log('Respuesta del servidor:', data);
        // Mostrar la respuesta en la página
        mostrarRespuesta(data);
    })
    .catch(error => {
        // Manejar errores
        console.error('Error al hacer la solicitud:', error);
        // Mostrar el error en la página
        mostrarError(error.message);
    });
}

// Función para mostrar la respuesta en la página
function mostrarRespuesta(responseData) {
    const responseHTML = `
        <p>Respuesta recibida del servidor:</p>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
    `;
    document.getElementById("response").innerHTML = responseHTML;
}

// Función para mostrar errores en la página
function mostrarError(errorMessage) {
    const errorHTML = `
        <p>Error al realizar la solicitud:</p>
        <p>${errorMessage}</p>
    `;
    document.getElementById("response").innerHTML = errorHTML;
}

// Llamar a la función consultarServicio al hacer clic en el botón de enviar
document.getElementById("submitButton").addEventListener("click", function() {
    console.log("Botón 'Enviar' clickeado.");
    consultarServicio();
});
