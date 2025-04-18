// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { reactive, watch, toRaw } from "vue";
import browser from "webextension-polyfill";

export const store = reactive({
    ready: false,

    locale: "fr",

    setLocale(locale) {
        this.locale = locale;
    },
});

browser.storage.local.get(["locale"]).then((results) => {
    if (Object.hasOwn(results, "locale")) {
        store.setLocale(results.locale);
    }

    store.ready = true;
});

watch(
    () => store.locale,
    (locale) => {
        document.documentElement.setAttribute("lang", locale);
        browser.storage.local.set({ locale: toRaw(locale) });
    },
);
