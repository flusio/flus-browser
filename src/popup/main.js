// This file is part of Flus Browser
// Copyright 2020-2025 Marien Fressinaud
// SPDX-License-Identifier: AGPL-3.0-or-later

import browser from "webextension-polyfill";
import configuration from "../configuration.js";

let currentUrl = null;
let csrf = null;
let bookmarksId = null;
let bookmarkedUrls = [];

// Refresh the popup interface
const anchorLogin = document.querySelector("#anchor-login");
const anchorNews = document.querySelector("#anchor-news");
const anchorBookmarks = document.querySelector("#anchor-bookmarks");
const anchorCollections = document.querySelector("#anchor-collections");
const iconLoading = document.querySelector("#icon-loading");
const buttonBookmarks = document.querySelector("#button-bookmarks");
const paragraphBookmarked = document.querySelector("#paragraph-bookmarked");
const popupLoading = document.querySelector("#popup-loading");
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

function isCurrentUrlBookmarked() {
    return currentUrl !== null && bookmarkedUrls.includes(currentUrl);
}

function updatePopup() {
    popupLoading.style.display = "none";

    if (!csrf || !bookmarksId) {
        popupConnected.style.display = "none";
        popupNotConnected.style.display = "block";
        return;
    }

    popupConnected.style.display = "block";
    popupNotConnected.style.display = "none";
    if (currentUrl) {
        buttonBookmarks.disabled = false;
    } else {
        buttonBookmarks.disabled = true;
    }

    iconLoading.style.display = "none";
    if (isCurrentUrlBookmarked()) {
        buttonBookmarks.style.display = "none";
        paragraphBookmarked.style.display = "initial";
    } else {
        buttonBookmarks.style.display = "initial";
        paragraphBookmarked.style.display = "none";
    }
}

// Manage adding links to Flus
function addCurrentUrlToBookmarks() {
    if (currentUrl && csrf && bookmarksId) {
        const url = `${configuration.app_endpoint}/links/new`;

        const formData = new FormData();
        formData.append("csrf", csrf);
        formData.append("url", currentUrl);
        formData.append("collection_ids[]", [bookmarksId]);

        buttonBookmarks.style.display = "none";
        iconLoading.style.display = "block";

        return fetch(url, {
            method: "POST",
            body: formData,
        }).then((response) => {
            fetchUserInfo().then(() => refreshForCurrentTab());
        });
    }
}

buttonBookmarks.addEventListener("click", addCurrentUrlToBookmarks);

// Maintain the state of the current URL when the current tab changes
function refreshForCurrentTab() {
    currentUrl = null;

    const gettingActiveTab = browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    gettingActiveTab
        .then((tabs) => {
            if (!tabs[0] || !tabs[0].url) {
                return;
            }

            const url = new URL(tabs[0].url);
            if (url.protocol === "http:" || url.protocol === "https:") {
                currentUrl = tabs[0].url;
            }
        })
        .then(() => updatePopup());
}

browser.tabs.onUpdated.addListener(refreshForCurrentTab);
browser.tabs.onActivated.addListener(refreshForCurrentTab);
browser.windows.onFocusChanged.addListener(refreshForCurrentTab);

// Load the initial state
function fetchUserInfo() {
    const fetchInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    return fetch(`${configuration.app_endpoint}/my/info.json`, fetchInit)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            const error = new Error(`request failed, error ${response.status}`);
            error.data = response.statusText;
            throw error;
        })
        .then((data) => {
            csrf = data.csrf;
            bookmarksId = data.bookmarks_id;
            bookmarkedUrls = data.bookmarked_urls;
        })
        .catch((error) => {
            // Can’t get user info (i.e. not logged in)
            csrf = null;
            bookmarksId = null;
            bookmarkedUrls = [];
        });
}

fetchUserInfo().then(() => refreshForCurrentTab());
