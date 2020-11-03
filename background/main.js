import configuration from '../configuration.js';

let state = {
    currentUrl: null,
    csrf: null,
    bookmarksId: null,
};
let portPopup;

// Get user info from flus.fr
function fetchUserInfo() {
    const fetchInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'manual',
    }
    window.fetch(configuration.app_endpoint + '/my/info.json', fetchInit)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                let error = new Error('request failed, error ' + response.status);
                error.data = response.statusText;
                throw error;
            }
        }).then((data) => {
            state.csrf = data.csrf;
            state.bookmarksId = data.bookmarks_id;

            if (portPopup) {
                portPopup.postMessage({
                    type: 'state.changed',
                    state,
                });
            }
        }).catch((error) => {
            // Can’t get user info (i.e. not logged in)
            state.csrf = null;
            state.bookmarksId = null;

            if (portPopup) {
                portPopup.postMessage({
                    type: 'state.changed',
                    state,
                });
            }
        });
}

function interceptFlusRequest(requestDetails) {
    // We try to detect that the current login status of the user changed:
    // 1. if csrf is set (i.e. user is connected) but redirect_url is /login,
    //    it probably means the user is disconnected.
    // 2. if csrf is not set (i.e. user disconnected) but current url is
    //    /login, it might mean the user is currently connecting.
    let redirectUrl = new URL(requestDetails.redirectUrl);
    let url = new URL(requestDetails.url);
    if (
        (state.csrf && redirectUrl.pathname.startsWith('/login')) ||
        (!state.csrf && url.pathname.startsWith('/login'))
    ) {
        fetchUserInfo();
    }
}

// We need to remove the port from the endpoint if any
const appUrl = new URL(configuration.app_endpoint);
const appUrlFilter = appUrl.protocol + '//' + appUrl.hostname + '/*';
browser.webRequest.onBeforeRedirect.addListener(interceptFlusRequest, {
    urls: [appUrlFilter],
    types: ['main_frame'],
});

fetchUserInfo();

// Maintain the state of the current URL
function updateCurrentUrl() {
    state.currentUrl = null;

    const gettingActiveTab = browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    gettingActiveTab.then((tabs) => {
        if (!tabs[0] || !tabs[0].url) {
            return;
        }

        const url = new URL(tabs[0].url);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            state.currentUrl = tabs[0].url;
        }
    }).then(() => {
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
