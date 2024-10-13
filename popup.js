document.addEventListener('DOMContentLoaded', function() {
    const countButton = document.getElementById('startCount');
    const countDisplay = document.getElementById('count-display');
    let isCounting = false;

    countButton.addEventListener('click', () => {
        isCounting = !isCounting;
        updateButtonState(countButton, isCounting);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: isCounting ? "startCount" : "stopCount" });
        });
    });

    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === "updateCount") {
            countDisplay.textContent = `Verified Accounts: ${request.count}`;
        }
    });

    function updateButtonState(button, isCounting) {
        button.textContent = isCounting ? "Stop Count" : "Start Count";
        button.style.backgroundColor = isCounting ? "#e0245e" : "#1da1f2";
    }
});
