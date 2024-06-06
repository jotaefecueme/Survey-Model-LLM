var serverIP = "http://95.60.72.15";
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

    var customInput = document.getElementById("customInput").value;

    if (customInput.trim() !== "") {
        lastSystemTurn = customInput;
    }

    var data = {
        "question": lastSystemTurn,
        "user": user
    };

    console.log("Request data:", data);

    document.getElementById("loading").style.display = "block";
    document.getElementById("debugMessages").innerText = "Sending request to server...";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${serverIP}:${serverPort}/ask`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    var timeout = 15000; 
    var timer; 

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            document.getElementById("loading").style.display = "none";

            clearTimeout(timer);

            if (xhr.status === 200) {
                console.log("Response received:", xhr.responseText);
                document.getElementById("debugMessages").innerText = "Response received from server";
                var endTime = new Date().getTime();
                var responseTime = (endTime - startTime) / 1000; // Convert to seconds
                console.log("Response time:", responseTime, "seconds");
                var response = JSON.parse(xhr.responseText);
                console.log("Server response:", response);

                var responseHTML = "<ul>";
                for (var key in response) {
                    responseHTML += "<li><strong>" + key + ":</strong> " + JSON.stringify(response[key]) + "</li>";
                }
                responseHTML += "</ul>";

                document.getElementById("response").innerHTML = responseHTML;

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

    timer = setTimeout(function() {
        console.error("Request timed out.");
        document.getElementById("debugMessages").innerText = "Request timed out. Service is unavailable.";
        document.getElementById("response").innerHTML = "<p>Service is unavailable. Please try again later.</p>";
        document.getElementById("loading").style.display = "none";
        xhr.abort(); 
    }, timeout);
}

document.getElementById("submitButton").addEventListener("click", function() {
    console.log("Button 'Submit' clicked");
    document.getElementById("debugMessages").innerText = "Button 'Submit' clicked.";
    consultarServicio();
});
