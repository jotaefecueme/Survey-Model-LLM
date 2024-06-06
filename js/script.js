<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Survey Model LLM v0.2</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container">
        <h1>Survey Model LLM v0.2 (multilingual)</h1>

        <label for="lastSystemTurn">Last System Turn:</label><br>
        <select id="lastSystemTurn" name="lastSystemTurn">
            <option value="Hello. My name is Eliza, the Virtual Assistant of Lekta Company. Im reaching out regarding your recent contact with our helpline. Do I have the pleasure of speaking with Jose?">
                Hello. My name is Eliza, the Virtual Assistant of Lekta Company. Im reaching out regarding your recent contact with our helpline. Do I have the pleasure of speaking with Jose?
            </option>
            <option value="Based on this contact, how likely are you to recommend Lekta Company to your friends or family? Please rate on a scale from 0 to 10.">
                Based on this contact, how likely are you to recommend Lekta Company to your friends or family? Please rate on a scale from 0 to 10.
            </option>
            <option value="Did the consultant resolve your issue?">Did the consultant resolve your issue?</option>
            <option value="How can we improve to better meet your needs?">How can we improve to better meet your needs?</option>
            <option value="custom">(Write your own Last System Turn message)</option>
        </select><br>

        <div id="customInputContainer" style="display: none;">
            <label for="customInput">Last System Turn:</label><br>
            <textarea id="customInput" name="customInput" rows="4" cols="50"></textarea><br>
        </div>

        <label for="user">Current User Input:</label><br>
        <textarea id="user" name="user" rows="4" cols="50" aria-label="Current User Input"></textarea><br>

        <button id="submitButton">Submit</button><br>

        <div id="response" style="margin-top: 30px;"></div>
        <div id="loading" class="loading"></div>
        <div id="curlCommand" style="display: none;"></div>
        <div id="debugMessages"></div>
    </div>

    <script src="js/script.js"></script>
    <script>
        // Global variables
        var serverIP = "http://127.0.0.1";
        var serverPort = "1024";

        function consultarServicio() {
            console.log("Requesting service...");
            document.getElementById("debugMessages").innerText = "Requesting service...";

            var startTime = new Date().getTime();
            var lastSystemTurn = document.getElementById("lastSystemTurn").value;
            var user = document.getElementById("user").value;

            // Data validation
            if (!user.trim()) {
                alert("Please enter a user message.");
                return;
            }

            // Obtener el valor del campo de texto personalizado
            var customInput = document.getElementById("customInput").value;

            // Si se ha ingresado un valor en el campo personalizado, usarlo como "lastSystemTurn"
            if (customInput.trim() !== "") {
                lastSystemTurn = customInput;
            }

            var data = {
                "question": lastSystemTurn,
                "user": user
            };

            console.log("Request data:", data);

            // Show loading indicator
            document.getElementById("loading").style.display = "block";
            document.getElementById("debugMessages").innerText = "Sending request to server...";

            var xhr = new XMLHttpRequest();
            xhr.open("POST", `${serverIP}:${serverPort}/ask`, true);
            xhr.setRequestHeader("Content-Type", "application/json");

            var timeout = 15000; // 15 seconds
            var timer; // Variable to hold the timer

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    // Hide loading indicator
                    document.getElementById("loading").style.display = "none";

                    // Clear the timer when the response is received
                    clearTimeout(timer);

                    if (xhr.status === 200) {
                        console.log("Response received:", xhr.responseText);
                        document.getElementById("debugMessages").innerText = "Response received from server";
                        var endTime = new Date().getTime();
                        var responseTime = (endTime - startTime) / 1000; // Convert to seconds
                        console.log("Response time:", responseTime, "seconds");
                        var response = JSON.parse(xhr.responseText);
                        console.log("Server response:", response);

                        // Show server response in the user interface
                        var responseHTML = "<ul>";
                        for (var key in response) {
                            responseHTML += "<li><strong>" + key + ":</strong> " + JSON.stringify(response[key]) + "</li>";
                        }
                        responseHTML += "</ul>";

                        // Add content to the response container
                        document.getElementById("response").innerHTML = responseHTML;

                        // Show response time message
                        var responseTimeMessage = "<p>Response time: " + responseTime + " seconds</p>";
                        document.getElementById("response").innerHTML += responseTimeMessage;
                    } else {
                        console.error("Error requesting service. Error code:", xhr.status);
                        document.getElementById("debugMessages").innerText = "Error requesting service. Please try again later.";
                        document.getElementById("response").innerHTML = "<p>Error requesting service. Please try again later.</p>";
                    }
                }
            };

            xhr.send(JSON.stringify(data));

            // Set the timeout
            timer = setTimeout(function() {
                console.error("Request timed out.");
                document.getElementById("debugMessages").innerText = "Request timed out. Service is unavailable.";
                document.getElementById("response").innerHTML = "<p>Service is unavailable. Please try again later.</p>";
                document.getElementById("loading").style.display = "none";
                xhr.abort(); // Abort the request if it takes too long
            }, timeout);
        }

        document.getElementById("submitButton").addEventListener("click", function() {
            console.log("Button 'Submit' clicked");
            document.getElementById("debugMessages").innerText = "Button 'Submit' clicked.";
            consultarServicio();
        });
    </script>
</body>
</html>
