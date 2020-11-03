import configuration from '../configuration.js';

let state = {};

// Create a port to discuss with the background process and keep the state
// synchronized
let myPort = browser.runtime.connect({name: 'port-from-popup'});;

function changeState(message) {
    if (message.type !== 'state.changed') {
        return;
    }

    state = message.state;
    updatePopup();
}

myPort.onMessage.addListener(changeState);
myPort.postMessage({
    type: 'state.get',
});

// Manage the popup interface
const anchorLogin = document.querySelector('#anchor-login');
const buttonBookmarks = document.querySelector('#bookmarks-button');
const popupConnected = document.querySelector('#popup-connected');
const popupNotConnected = document.querySelector('#popup-not-connected');

function updatePopup() {
    if (!state.csrf || !state.bookmarksId) {
        popupConnected.style.display = 'none';
        popupNotConnected.style.display = 'block';
        anchorLogin.addEventListener('click', () => {
            browser.tabs.create({
                url: configuration.app_endpoint + '/login',
            });
        });
        return;
    }

    popupConnected.style.display = 'block';
    popupNotConnected.style.display = 'none';
    if (state.currentUrl) {
        buttonBookmarks.disabled = false;
    } else {
        buttonBookmarks.disabled = true;
    }
}

buttonBookmarks.addEventListener('click', () => {
    if (state.currentUrl) {
        const encodedUrl = encodeURIComponent(state.currentUrl);
        const destination = configuration.app_endpoint + '/links/new?url=' + encodedUrl;
        browser.tabs.create({
            url: destination,
        });
    }
});
