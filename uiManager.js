const UIManager = (function () {
    let state = {
        isCounting: false,
        verifiedCount: 0,
        totalCount: 0,
        loadedCount: 0,
        scrollPercentage: 0,
    };

    function addControls() {
        const controlsDiv = document.createElement("div");
        controlsDiv.id = "verifiedCounterControls";
        controlsDiv.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 10000;
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            width: 280px;
            color: #333333;
            border: 2px solid #dc3545;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        `;

        controlsDiv.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #1DA1F2; font-size: 20px; text-align: center; font-weight: 700;">Verified Account Counter</h3>
            <button id="startCount" style="width: 100%; padding: 12px; margin-bottom: 20px; border: none; border-radius: 9999px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s, transform 0.1s; text-align: center;">Start Count</button>
            <div id="countStatus" style="font-size: 15px; line-height: 1.5;">
                <p style="margin: 10px 0;"><strong>Verified Accounts:</strong> <span id="verifiedCount">0</span></p>
                <p style="margin: 10px 0;"><strong>Total Followers:</strong> <span id="totalCount">0</span></p>
                <p style="margin: 10px 0;"><strong>Status:</strong> <span id="statusMessage">Ready</span></p>
            </div>
            <div id="chartContainer" style="margin-top: 20px;">
                <div id="barChart" style="height: 20px; background-color: #e9ecef; border-radius: 10px; overflow: hidden;">
                    <div id="verifiedBar" style="height: 100%; width: 0%; background-color: #28a745; transition: width 0.5s ease;"></div>
                </div>
                <p id="ratioText" style="text-align: center; margin-top: 5px; font-size: 14px; font-weight: bold;">0% Verified</p>
            </div>
        `;

        document.body.appendChild(controlsDiv);

        const button = document.getElementById("startCount");
        button.addEventListener("click", handleButtonClick);
        button.addEventListener(
            "mousedown",
            () => (button.style.transform = "scale(0.95)")
        );
        button.addEventListener(
            "mouseup",
            () => (button.style.transform = "scale(1)")
        );
        updateButtonStyle(button, false);
    }

    function updateButtonStyle(button, isCounting) {
        if (isCounting) {
            button.textContent = "Stop Count";
            button.style.backgroundColor = "#dc3545";
            button.style.color = "white";
            button.style.fontSize = "18px"; // Increased font size for "Stop Count"
        } else {
            button.textContent = "Start Count";
            button.style.backgroundColor = "#1DA1F2";
            button.style.color = "white";
            button.style.fontSize = "18px"; // Original font size for "Start Count"
        }
    }

    function handleButtonClick() {
        const button = document.getElementById("startCount");
        state.isCounting = !state.isCounting;
        updateButtonStyle(button, state.isCounting);

        if (state.isCounting) {
            Counter.startCounting();
        } else {
            Counter.stopCounting();
        }
    }

    function updateStatus(
        verifiedCount,
        totalCount,
        statusMessage,
        loadedCount,
        scrollPercentage
    ) {
        state.verifiedCount = verifiedCount;
        state.totalCount = totalCount;
        state.loadedCount = loadedCount;
        state.scrollPercentage = scrollPercentage;

        document.getElementById("verifiedCount").textContent =
            verifiedCount.toLocaleString();
        document.getElementById("totalCount").textContent =
            totalCount.toLocaleString();

        let statusText = statusMessage;
        if (loadedCount !== undefined && scrollPercentage !== undefined) {
            statusText += ` (${loadedCount.toLocaleString()} loaded, ${scrollPercentage}% scrolled)`;
        }
        document.getElementById("statusMessage").textContent = statusText;

        updateChart(verifiedCount, totalCount);
    }

    function updateChart(verifiedCount, totalCount) {
        const verifiedBar = document.getElementById("verifiedBar");
        const ratioText = document.getElementById("ratioText");

        if (totalCount > 0) {
            const ratio = (verifiedCount / totalCount) * 100;
            verifiedBar.style.width = `${ratio}%`;
            ratioText.textContent = `${ratio.toFixed(2)}% Verified`;
        } else {
            verifiedBar.style.width = "0%";
            ratioText.textContent = "0% Verified";
        }
    }

    function initialize() {
        if (window.location.href.endsWith("followers")) {
            addControls();
        }
    }

    return {
        initialize,
        updateStatus,
    };
})();

// Only initialize if we're on the followers page
if (window.location.href.endsWith("followers")) {
    console.log("uiManager.js loaded");
    UIManager.initialize();
}
