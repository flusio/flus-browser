// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createI18n } from "vue-i18n";

export const i18n = createI18n({
    locale: "en",
    fallbackLocale: "en",
    legacy: false,

    messages: {
        en: {
            "errors.@base.invalid_credentials": "The credentials are invalid.",
            "errors.email.presence": "The email address is required.",
            "errors.password.presence": "The password is required.",
            "forms.error": "Error:",
            "loading.in_progress": "Loading in progress…",
            "login.email.label": "Email address",
            "login.errors.server_error":
                "The server “{server}” cannot be reached, please check its address.",
            "login.intro": "Log in to access Flus.",
            "login.or": "or",
            "login.password.label": "Password",
            "login.register": "create an account",
            "login.server": "Server:",
            "login.server.label": "Server",
            "login.server.change": "Change",
            "login.submit": "Log in",
            "login.title": "Login",
            "menu.close": "Close the menu",
            "menu.logout": "Log out",
            "menu.open": "Open the menu",
            "menu.open_flus": "Open Flus",
            "menu.title": "Menu",
            "not_found.back": "Back",
            "not_found.details":
                "This screen doesn’t exist, so it’s probably a problem with the extension.",
            "not_found.title": "Screen not found",
            "notification.close": "Close the notification",
        },

        fr: {
            "errors.@base.invalid_credentials": "Les identifiants sont incorrects.",
            "errors.email.presence": "L’adresse email est obligatoire.",
            "errors.password.presence": "Le mot de passe est obligatoire.",
            "forms.error": "Erreur :",
            "loading.in_progress": "Chargement en cours…",
            "login.email.label": "Adresse courriel",
            "login.errors.server_error":
                "Le serveur « {server} » est injoignable, veuillez vérifier son adresse.",
            "login.intro": "Identifiez-vous pour accéder à votre veille Flus.",
            "login.or": "ou",
            "login.password.label": "Mot de passe",
            "login.register": "créer un compte",
            "login.server": "Serveur :",
            "login.server.label": "Serveur",
            "login.server.change": "Changer",
            "login.submit": "Se connecter",
            "login.title": "Connexion",
            "menu.close": "Fermer le menu",
            "menu.logout": "Se déconnecter",
            "menu.open": "Ouvrir le menu",
            "menu.open_flus": "Ouvrir Flus",
            "menu.title": "Menu",
            "not_found.back": "Retour",
            "not_found.details":
                "Cet écran n’existe pas, il s’agit probablement d’un problème de l’extension.",
            "not_found.title": "Écran introuvable",
            "notification.close": "Fermer la notification",
        },
    },
});
