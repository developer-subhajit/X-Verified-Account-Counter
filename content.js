(function() {
    function injectScript(file, node) {
        var th = document.getElementsByTagName(node)[0];
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', file);
        th.appendChild(s);
    }

    // Check if the current URL ends with 'followers'
    if (window.location.href.endsWith('followers')) {
        injectScript(chrome.runtime.getURL('uiManager.js'), 'body');
        injectScript(chrome.runtime.getURL('counter.js'), 'body');
    }
})();
