const Counter = (() => {
    let isCountingInProgress = false,
        verifiedCount = 0,
        totalCount = 0,
        isScrolling = false;

    const isVerified = (cell) =>
        cell.querySelector('svg[data-testid="icon-verified"]') !== null;

    const smoothScroll = (duration, distance, direction = "down") =>
        new Promise((resolve) => {
            const start = window.scrollY;
            const startTime = performance.now();

            const scroll = () => {
                const now = performance.now();
                const time = Math.min(1, (now - startTime) / duration);
                window.scrollTo(
                    0,
                    start + (direction === "down" ? 1 : -1) * (time * distance)
                );
                time < 1 ? requestAnimationFrame(scroll) : resolve();
            };

            requestAnimationFrame(scroll);
        });

    const waitForNewContent = async (timeout = 20) => {
        const startHeight = document.documentElement.scrollHeight;
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            if (document.documentElement.scrollHeight > startHeight)
                return true;
        }
        return false;
    };

    const scrollToBottom = async () => {
        let unchangedCount = 0;

        while (isScrolling) {
            const { scrollHeight, clientHeight } = document.documentElement;
            const currentPosition = window.scrollY + clientHeight;
            const loadedFollowers = document.querySelectorAll(
                '[data-testid="cellInnerDiv"]'
            ).length;
            const scrollPercentage = Math.round(
                (currentPosition / scrollHeight) * 100
            );

            UIManager.updateStatus(
                verifiedCount,
                totalCount,
                "Loading followers...",
                loadedFollowers,
                scrollPercentage
            );

            if (currentPosition >= scrollHeight - 100) {
                if (++unchangedCount >= 5) break;
            } else {
                unchangedCount = 0;
            }

            await smoothScroll(200, 700, "down");
            await waitForNewContent();
        }
    };

    const processVisibleAccounts = async () => {
        Array.from(document.querySelectorAll('[data-testid="cellInnerDiv"]'))
            .reverse()
            .forEach((cell) => {
                const contentContainer = cell.querySelector(
                    '[data-testid="UserCell"]'
                );
                if (
                    !cell.processed &&
                    isElementInViewport(cell) &&
                    contentContainer
                ) {
                    totalCount++;
                    if (isVerified(cell)) {
                        verifiedCount++;
                        highlightProfile(cell, true);
                    } else {
                        highlightProfile(cell, false);
                    }
                    addSequentialNumber(cell, totalCount);
                    cell.processed = true;
                }
            });

        UIManager.updateStatus(verifiedCount, totalCount, "Counting...");

        if (window.scrollY > 0 && isCountingInProgress) {
            await smoothScroll(500, 300, "up");
            await processVisibleAccounts();
        } else {
            stopCounting();
        }
    };

    const isElementInViewport = (el) => {
        const { top, left, bottom, right } = el.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        return (
            top >= 0 &&
            left >= 0 &&
            bottom <= innerHeight &&
            right <= innerWidth
        );
    };

    const highlightProfile = (cell, isVerified) => {
        const contentContainer = cell.querySelector('[data-testid="UserCell"]');
        if (contentContainer) {
            Object.assign(contentContainer.style, {
                border: isVerified ? "5px solid #20B2AA" : "5px solid #FF6347",
                borderRadius: "12px",
                margin: "8px 0",
                padding: "8px",
                boxSizing: "border-box",
                display: "block",
                boxShadow: isVerified
                    ? "0 4px 8px rgba(32, 178, 170, 0.3)"
                    : "0 2px 4px rgba(255, 99, 71, 0.3)",
                transition: "all 0.3s ease",
            });
        }
    };

    const addSequentialNumber = (cell, number) => {
        const contentContainer = cell.querySelector('[data-testid="UserCell"]');
        if (contentContainer) {
            contentContainer.querySelector(".sequential-number")?.remove();

            const isVerifiedAccount = isVerified(cell);
            const numberText = isVerifiedAccount
                ? `#${number} (V${verifiedCount})`
                : `#${number}`;

            const numberDiv = Object.assign(document.createElement("div"), {
                textContent: numberText,
                className: "sequential-number",
            });
            Object.assign(numberDiv.style, {
                position: "absolute",
                top: "5px",
                left: "5px",
                backgroundColor: isVerifiedAccount
                    ? "rgba(29, 161, 242, 0.8)"
                    : "rgba(101, 119, 134, 0.7)",
                color: "white",
                padding: "2px 6px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "bold",
                zIndex: "1000",
            });
            contentContainer.style.position = "relative";
            contentContainer.appendChild(numberDiv);
        }
    };

    const startCounting = async () => {
        if (isCountingInProgress) return;
        isCountingInProgress = isScrolling = true;
        verifiedCount = totalCount = 0;

        UIManager.updateStatus(0, 0, "Initiating follower loading process...");
        await scrollToBottom();

        if (!isScrolling) {
            UIManager.updateStatus(
                0,
                0,
                "Scrolling interrupted. Please try again."
            );
            isCountingInProgress = false;
            return;
        }

        UIManager.updateStatus(
            0,
            0,
            "All followers loaded. Initiating count..."
        );
        await processVisibleAccounts();
    };

    const stopCounting = () => {
        isScrolling = false;
        isCountingInProgress = false;
        UIManager.updateStatus(
            verifiedCount,
            totalCount,
            `Count completed. Verified: ${verifiedCount}, Total: ${totalCount}`
        );
        const button = document.getElementById("startCount");
        if (button) {
            button.textContent = "Start Count";
            button.style.backgroundColor = "#1DA1F2";
        }
    };

    return { startCounting, stopCounting };
})();

if (window.location.href.endsWith("followers")) {
    console.log("Counter module loaded successfully");
}
