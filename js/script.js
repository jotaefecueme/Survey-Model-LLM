<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Debugging Info</title>
</head>
<body>
    <div id="debugMessages"></div>
    <div id="response"></div>
    <button id="submitButton">Submit</button>

    <script>
        var serverIP = "http://95.60.72.15";
        var serverPort = "1024";

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
        }

        function sendRequest(data) {
            displayMessage("Sending request to server...");
            document.getElementById("loading").style.display = "block";

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${serverIP}:${serverPort}/ask`, true);
            xhr.setRequestHeader("Content-Type", "application/json");

            const timer = setTimeout(function() {
                console.error("Request timed out.");
                displayError("Request timed out. Service is unavailable.");
                xhr.abort(); // Abort the request if it takes too long
            }, 15000); // 15 seconds

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    clearTimeout(timer);
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        displayResponse(response);
                    } else {
                        displayError(`Error requesting service. Error code: ${xhr.status}`);
                    }
                }
            };

            xhr.send(JSON.stringify(data));
        }

        function consultarServicio() {
            displayMessage("Requesting service...");
            document.getElementById("loading").style.display = "block";

            const startTime = new Date().getTime();
            const lastSystemTurn = document.getElementById("lastSystemTurn").value.trim();
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

        document.getElementById("submitButton").addEventListener("click", function() {
            displayMessage("Button 'Submit' clicked.");
            consultarServicio();
        });
    </script>
</body>
</html>
