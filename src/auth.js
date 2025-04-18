// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { watch } from "vue";

import { redirect } from "./router.js";
import { store } from "./store.js";

export function requireAuth() {
    const redirectPath = "/login";

    if (store.auth.token.length === 0) {
        redirect(redirectPath);
    }

    watch(
        () => store.auth.token,
        (token) => {
            if (token.length === 0) {
                redirect(redirectPath);
            }
        },
    );
}

export function requireNotAuth() {
    const redirectPath = "/";

    if (store.auth.token.length > 0) {
        redirect(redirectPath);
    }

    watch(
        () => store.auth.token,
        (token) => {
            if (token.length > 0) {
                redirect(redirectPath);
            }
        },
    );
}
