// Global variables
var serverURL = ""; // Se actualizará con la URL de Ngrok obtenida de config.json
var startTime;

document.addEventListener('DOMContentLoaded', function() {
    var lastSystemTurnSelect = document.getElementById('lastSystemTurn');
    var customInputContainer = document.getElementById('customInputContainer');
    var submitButton = document.getElementById('submitButton');
    var responseContainer = document.getElementById('response');
    var loading = document.getElementById('loading');
    var curlCommand = document.getElementById('curlCommand');
    var debugMessages = document.getElementById('debugMessages');

    lastSystemTurnSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customInputContainer.style.display = 'block';
        } else {
            customInputContainer.style.display = 'none';
        }
    });

    submitButton.addEventListener('click', function() {
        displayMessage("Button 'Submit' clicked.");
        consultarServicio();
    });

    function displayMessage(message) {
        console.log(message);
        debugMessages.innerText = message;
    }

    function displayError(errorMessage) {
        console.error(errorMessage);
        debugMessages.innerText = errorMessage;
        responseContainer.innerHTML = `<p>${errorMessage}</p>`;
        loading.style.display = "none";
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

        responseContainer.innerHTML = responseHTML;

        const responseTimeMessage = `<p>Response time: ${responseTime} seconds</p>`;
        responseContainer.innerHTML += responseTimeMessage;
        loading.style.display = "none";
    }

    async function sendRequest(data) {
        displayMessage("Sending request to server...");
        loading.style.display = "block";

        try {
            const response = await fetch(`${serverURL}/ask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Error requesting service. Error code: ${response.status}`);
            }

            const responseData = await response.json();
            displayResponse(responseData);
        } catch (error) {
            displayError(error.message);
        }
    }

    function consultarServicio() {
        displayMessage("Requesting service...");
        loading.style.display = "block";

        startTime = new Date().getTime();
        const lastSystemTurn = lastSystemTurnSelect.value.trim();
        const user = document.getElementById("user").value.trim();

        if (!user) {
            displayError("Please enter a user message.");
            return;
        }

        const customInput = document.getElementById("customInput").value.trim();
        const systemTurn = customInput ? customInput : lastSystemTurn;

        const data = {
            "question": systemTurn,
            "user": user
        };

        displayMessage("Request data:");
        console.log(data);

        sendRequest(data);
    }

    // Cargar la URL de Ngrok desde config.json
    // Cargar la URL de Ngrok desde config.json
fetch('config.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load config.json (${response.status} ${response.statusText})`);
        }
        return response.json();
    })
    .then(config => {
        serverURL = config.ngrok_url;
        console.log(`Server URL set to: ${serverURL}`);
    })
    .catch(error => {
        console.error('Error loading config:', error);
        displayError('Error loading configuration.');
    });

});
