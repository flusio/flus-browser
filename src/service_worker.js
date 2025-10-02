// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import browser from "webextension-polyfill";

import api from "./api";
import * as tabs from "./tabs";

async function updateBadge() {
    const currentTab = await tabs.current();

    if (!currentTab || !currentTab.url) {
        browser.action.setBadgeText({ text: "" });
        return;
    }

    const link = await api.search(currentTab.url);

    if (link?.is_read) {
        browser.action.setBadgeText({ text: "✓" });
    } else {
        browser.action.setBadgeText({ text: "" });
    }
}

browser.tabs.onUpdated.addListener(updateBadge);
browser.tabs.onActivated.addListener(updateBadge);
browser.windows.onFocusChanged.addListener(updateBadge);
updateBadge();

chrome.action.setBadgeBackgroundColor({ color: '#00d7ad' });
