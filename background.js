let state = {
    currentUrl: null,
};
let portPopup;

// Maintain the state of the current URL
function updateCurrentUrl() {
    state.currentUrl = null;

    const gettingActiveTab = browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    gettingActiveTab.then((tabs) => {
        if (!tabs[0]) {
            return;
        }

        if (tabs[0].url) {
            state.currentUrl = encodeURIComponent(tabs[0].url);
        }

        if (portPopup) {
            portPopup.postMessage({
                type: 'state.changed',
                state,
            });
        }
    });
}

browser.tabs.onUpdated.addListener(updateCurrentUrl);
browser.tabs.onActivated.addListener(updateCurrentUrl);
browser.windows.onFocusChanged.addListener(updateCurrentUrl);
updateCurrentUrl();

// Handle the discussion with the popup menu
function listenPopupRequests(message) {
    if (message.type === 'state.get') {
        portPopup.postMessage({
            type: 'state.changed',
            state,
        });
    }
}

function disconnectPortPopup() {
    portPopup = null;
}

function portConnected(port) {
    if (port.name === 'port-from-popup') {
        portPopup = port;
        portPopup.onMessage.addListener(listenPopupRequests);
        portPopup.onDisconnect.addListener(disconnectPortPopup);
    }
}

browser.runtime.onConnect.addListener(portConnected);
