import configuration from '../configuration.js';

let state;

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
const bookmarksButton = document.querySelector('#bookmarks-button');

function updatePopup() {
    if (state.currentUrl) {
        bookmarksButton.disabled = false;
    } else {
        bookmarksButton.disabled = true;
    }
}

bookmarksButton.addEventListener('click', () => {
    if (state.currentUrl) {
        const destination = configuration.app_endpoint + '/links/new?url=' + state.currentUrl;
        browser.tabs.create({
            url: destination,
        });
    }
});
