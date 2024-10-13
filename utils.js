const Utils = (function() {
    const MIN_DELAY = 1000;
    const MAX_DELAY = 3000;

    function getRandomDelay() {
        return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1) + MIN_DELAY);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return {
        getRandomDelay,
        delay
    };
})();
