// This file is part of Flus Browser
// Copyright 2020-2025 Marien Fressinaud
// SPDX-License-Identifier: AGPL-3.0-or-later

import configuration from "../configuration.js";

let state = {};

// Create a port to discuss with the background process and keep the state
// synchronized
const myPort = browser.runtime.connect({ name: "port-from-popup" });

function changeState(message) {
    if (message.type !== "state.changed") {
        return;
    }

    state = message.state;
    updatePopup();
}

myPort.onMessage.addListener(changeState);
myPort.postMessage({
    type: "state.get",
});

// Manage the popup interface
const anchorLogin = document.querySelector("#anchor-login");
const anchorNews = document.querySelector("#anchor-news");
const anchorBookmarks = document.querySelector("#anchor-bookmarks");
const anchorCollections = document.querySelector("#anchor-collections");
const iconLoading = document.querySelector("#icon-loading");
const buttonBookmarks = document.querySelector("#button-bookmarks");
const paragraphBookmarked = document.querySelector("#paragraph-bookmarked");
const popupConnected = document.querySelector("#popup-connected");
const popupNotConnected = document.querySelector("#popup-not-connected");

anchorLogin.addEventListener("click", (event) => {
    event.preventDefault();
    browser.tabs.create({
        url: `${configuration.app_endpoint}/login`,
    });
});

anchorNews.addEventListener("click", (event) => {
    event.preventDefault();
    browser.tabs.create({
        url: `${configuration.app_endpoint}/news`,
    });
});

anchorBookmarks.addEventListener("click", (event) => {
    event.preventDefault();
    browser.tabs.create({
        url: `${configuration.app_endpoint}/bookmarks`,
    });
});

anchorCollections.addEventListener("click", (event) => {
    event.preventDefault();
    browser.tabs.create({
        url: `${configuration.app_endpoint}/collections`,
    });
});

function updatePopup() {
    if (!state.csrf || !state.bookmarksId) {
        popupConnected.style.display = "none";
        popupNotConnected.style.display = "block";
        return;
    }

    popupConnected.style.display = "block";
    popupNotConnected.style.display = "none";
    if (state.currentUrl) {
        buttonBookmarks.disabled = false;
    } else {
        buttonBookmarks.disabled = true;
    }

    iconLoading.style.display = "none";
    if (state.currentUrlBookmarked) {
        buttonBookmarks.style.display = "none";
        paragraphBookmarked.style.display = "initial";
    } else {
        buttonBookmarks.style.display = "initial";
        paragraphBookmarked.style.display = "none";
    }
}

// Manage adding links to Flus
function addCurrentUrlToBookmarks() {
    if (state.currentUrl && state.csrf && state.bookmarksId) {
        const url = `${configuration.app_endpoint}/links/new`;
        const formData = new FormData();
        formData.append("csrf", state.csrf);
        formData.append("url", state.currentUrl);
        formData.append("is_public", false);
        formData.append("collection_ids[]", [state.bookmarksId]);

        buttonBookmarks.style.display = "none";
        iconLoading.style.display = "block";
        return window
            .fetch(url, {
                method: "POST",
                body: formData,
            })
            .then((response) => {
                if (response.ok) {
                    myPort.postMessage({ type: "state.refresh" });
                    fetchLink(response.url);
                }
            });
    }
}

function fetchLink(fetchUrl) {
    if (state.csrf) {
        const formData = new FormData();
        formData.append("csrf", state.csrf);
        return window.fetch(fetchUrl, {
            method: "POST",
            body: formData,
        });
    }
}

buttonBookmarks.addEventListener("click", addCurrentUrlToBookmarks);
