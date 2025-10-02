// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import browser from "webextension-polyfill";

export function open(url) {
    browser.tabs.create({ url });
}
