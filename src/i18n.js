// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createI18n } from "vue-i18n";

export const i18n = createI18n({
    locale: "en",
    fallbackLocale: "en",
    legacy: false,

    messages: {
        en: {
            "loading.in_progress": "Loading in progress…",
            "login.intro": "Log in to access Flus.",
            "not_found.title": "Page not found",
        },

        fr: {
            "loading.in_progress": "Chargement en cours…",
            "login.intro": "Identifiez-vous pour accéder à votre veille Flus.",
            "not_found.title": "Page introuvable",
        },
    },
});
