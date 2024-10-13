const BackgroundManager = (() => {
    const debugInfo = {
        followingButtonFound: false,
        followsYouFound: false,
        verifiedIconFound: false
    };

    const findAndHighlightButton = () => {
        console.log("Starting search...");

        const buttons = document.querySelectorAll('button');
        let followingButton = Array.from(buttons).find(button => button.textContent.trim().toLowerCase() === 'following');

        if (followingButton) {
            debugInfo.followingButtonFound = true;
            console.log("Found 'Following' button:", followingButton);

            const userCard = followingButton.closest('[data-testid="UserCell"]');
            if (userCard) {
                debugInfo.followsYouFound = !!userCard.querySelector('[data-testid="userFollowIndicator"]');
                debugInfo.verifiedIconFound = !!userCard.querySelector('svg[aria-label="Verified account"]');

                if (!debugInfo.followsYouFound && !debugInfo.verifiedIconFound) {
                    highlightButton(followingButton);
                    return { result: true, debugInfo };
                }
            }
        }

        console.log("No button highlighted. Debug info:", debugInfo);
        return { result: false, debugInfo };
    };

    const highlightButton = (button) => {
        button.style.border = '3px solid red';
        button.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
        console.log("Highlighting button for non-verified user who doesn't follow back");
    };

    return {
        findAndHighlightButton
    };
})();

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: BackgroundManager.findAndHighlightButton
    });
});

function countNonReciprocalFollows() {
    const buttons = document.querySelectorAll('button');
    let count = 0;
    
    buttons.forEach(button => {
        if (button.textContent.trim().toLowerCase() === 'following') {
            const userCard = button.closest('[data-testid="UserCell"]'); // Adjust this selector as needed
            if (userCard) {
                const followsYouElement = userCard.querySelector('[data-testid="userFollowIndicator"]');
                if (!followsYouElement || !followsYouElement.textContent.includes('Follows you')) {
                    count++;
                }
            }
        }
    });
    
    return count;
}

function gatherProfileInfo() {
    const info = {
        name: null,
        handle: null,
        isVerified: false,
        followsYou: false,
        youFollow: false,
        followButtonText: null
    };

    // Get name and handle
    const nameElement = document.querySelector('div[data-testid="UserName"]');
    if (nameElement) {
        const nameSpans = nameElement.querySelectorAll('span');
        if (nameSpans.length >= 1) {
            info.name = nameSpans[0].textContent.trim();
        }
        if (nameSpans.length >= 2) {
            info.handle = nameSpans[1].textContent.trim();
        }
    }

    // Check if verified
    const verifiedIcon = document.querySelector('svg[aria-label="Verified account"]');
    info.isVerified = !!verifiedIcon;

    // Check if follows you
    const followsYouElement = document.querySelector('[data-testid="userFollowIndicator"]');
    info.followsYou = !!followsYouElement && followsYouElement.textContent.includes('Follows you');

    // Check if you follow
    const followButton = document.querySelector('div[data-testid*="follow"]');
    if (followButton) {
        info.followButtonText = followButton.textContent.trim();
        info.youFollow = info.followButtonText.toLowerCase() === 'following';
    }

    return info;
}
