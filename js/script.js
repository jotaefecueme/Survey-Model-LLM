// Global variables
var serverIP = "https://95.60.72.15";
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
