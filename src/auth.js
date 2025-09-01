// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { currentPath } from "./router.js";
import { store } from "./store.js";

export function isAuthenticated() {
    return store.auth.token.length > 0;
}

export function requireAuth() {
    return currentPath.value === "/";
}
