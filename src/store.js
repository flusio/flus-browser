// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { reactive, watch, toRaw } from "vue";
import browser from "webextension-polyfill";

import { applyTheme } from "./theme.js";

export const store = reactive({
    ready: false,

    locale: "fr",

    theme: "auto",

    auth: {
        server: "https://app.flus.fr",
        email: "",
        token: "",
    },

    notification: null,

    menuOpened: false,

    drafts: {},

    setLocale(locale) {
        this.locale = locale;
    },

    setTheme(theme) {
        this.theme = theme;
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
            server: this.auth.server,
            email: "",
            token: "",
        };
    },

    notify(type, message) {
        this.notification = {
            type,
            message,
        };
    },

    resetNotification() {
        this.notification = null;
    },

    openMenu() {
        this.menuOpened = true;
    },

    closeMenu() {
        this.menuOpened = false;
    },

    getDraft(link) {
        return this.drafts[link.id] || "";
    },

    saveDraft(link, noteContent) {
        if (noteContent) {
            this.drafts = {
                ...this.drafts,
                [link.id]: noteContent,
            };
        } else {
            const newDraftEntries = Object.entries(this.drafts).filter(([linkId, _noteContent]) => {
                return linkId !== link.id;
            });

            this.drafts = Object.fromEntries(newDraftEntries);
        }
    },
});

browser.storage.local.get(["theme", "locale", "auth", "drafts"]).then((results) => {
    if (Object.hasOwn(results, "theme")) {
        store.theme = results.theme;
        applyTheme(store.theme);
    }

    if (Object.hasOwn(results, "locale")) {
        store.setLocale(results.locale);
    }

    if (Object.hasOwn(results, "auth")) {
        store.auth = results.auth;
    }

    if (Object.hasOwn(results, "drafts")) {
        store.drafts = results.drafts;
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

watch(
    () => store.theme,
    (theme) => {
        applyTheme(theme);
        browser.storage.local.set({ theme: toRaw(theme) });
    },
);

watch(
    () => store.drafts,
    (drafts) => {
        browser.storage.local.set({ drafts: toRaw(drafts) });
    },
);
