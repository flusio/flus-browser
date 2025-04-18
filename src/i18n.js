// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createI18n } from "vue-i18n";

export const i18n = createI18n({
    locale: "en",
    fallbackLocale: "en",
    legacy: false,

    messages: {
        en: {
            "auth.logout": "Log out",
            "loading.in_progress": "Loading in progress…",
            "login.form.submit": "Log in",
            "login.intro": "Log in to access Flus.",
            "login.title": "Login",
            "not_found.back": "Back",
            "not_found.details":
                "This screen doesn’t exist, so it’s probably a problem with the extension.",
            "not_found.title": "Screen not found",
        },

        fr: {
            "auth.logout": "Se déconnecter",
            "loading.in_progress": "Chargement en cours…",
            "login.form.submit": "Se connecter",
            "login.intro": "Identifiez-vous pour accéder à votre veille Flus.",
            "login.title": "Connexion",
            "not_found.back": "Retour",
            "not_found.details":
                "Cet écran n’existe pas, il s’agit probablement d’un problème de l’extension.",
            "not_found.title": "Écran introuvable",
        },
    },
});
