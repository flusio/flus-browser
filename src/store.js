// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { reactive, watch, toRaw } from "vue";
import browser from "webextension-polyfill";

export const store = reactive({
    ready: false,

    locale: "fr",

    auth: {
        server: "https://app.flus.fr",
        email: "",
        token: "",
    },

    setLocale(locale) {
        this.locale = locale;
    },

    rememberCredentials(server, email, token) {
        this.auth = {
            server,
            email,
            token,
        };
    },

    logout() {
        this.auth = {
            server: "https://app.flus.fr",
            email: "",
            token: "",
        };
    },
});

browser.storage.local.get(["locale", "auth"]).then((results) => {
    if (Object.hasOwn(results, "locale")) {
        store.setLocale(results.locale);
    }

    if (Object.hasOwn(results, "auth")) {
        store.auth = results.auth;
    }

    store.ready = true;
});

watch(
    () => store.auth,
    (auth) => {
        browser.storage.local.set({ auth: toRaw(auth) });
    },
);

watch(
    () => store.locale,
    (locale) => {
        document.documentElement.setAttribute("lang", locale);
        browser.storage.local.set({ locale: toRaw(locale) });
    },
);
