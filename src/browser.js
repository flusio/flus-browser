// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import browser from "webextension-polyfill";

export async function getBrowserName() {
    if (browser.runtime.getBrowserInfo == null) {
        // Chrome doesn't provide this function.
        // See https://issues.chromium.org/issues/40671645
        return "chrome";
    } else {
        const info = await browser.runtime.getBrowserInfo();
        return info.name.toLowerCase();
    }
}

export async function isFirefox() {
    const browserName = await getBrowserName();
    return browserName === "firefox";
}

export async function isChrome() {
    const browserName = await getBrowserName();
    return browserName === "chrome";
}
