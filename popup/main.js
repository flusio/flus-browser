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
const buttonBookmarks = document.querySelector('#button-bookmarks');
const paragraphBookmarked = document.querySelector('#paragraph-bookmarked');
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

// Manage adding links to Flus
function addCurrentUrlToBookmarks() {
    if (state.currentUrl && state.csrf && state.bookmarksId) {
        const url = configuration.app_endpoint + '/links/new';
        const formData = new FormData();
        formData.append('csrf', state.csrf);
        formData.append('url', state.currentUrl);
        formData.append('is_public', false);
        formData.append('collection_ids[]', [state.bookmarksId]);
        return window.fetch(url, {
            method: 'POST',
            body: formData,
        }).then((response) => {
            if (response.ok) {

                buttonBookmarks.style.display = 'none';
                paragraphBookmarked.style.display = 'initial';

                setTimeout(() => {
                    buttonBookmarks.style.display = 'initial';
                    paragraphBookmarked.style.display = 'none';
                }, 3000);

                fetchLink(response.url);
            }
        });
    }
}

function fetchLink(fetchUrl) {
    if (state.csrf) {
        const formData = new FormData();
        formData.append('csrf', state.csrf);
        return window.fetch(fetchUrl, {
            method: 'POST',
            body: formData,
        });
    }
}

buttonBookmarks.addEventListener('click', addCurrentUrlToBookmarks);
