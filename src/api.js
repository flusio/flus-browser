// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { store } from "./store.js";

function authenticate(server, email, password) {
    const endpoint = `${server}/api/v1/sessions`;

    return fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            app_name: "Flus Browser",
            email,
            password,
        }),
    })
        .then((response) => {
            return response.json().then((data) => ({
                ok: response.ok,
                status: response.status,
                data: data,
            }));
        })
        .then((response) => {
            if (!response.ok) {
                throw new ApiError(response.status, response.data.errors);
            }

            return response.data.token;
        });
}

function searchLink(url) {
    const endpoint = new URL(`${store.auth.server}/api/v1/search`);

    return fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.auth.token}`,
        },
        body: JSON.stringify({
            url,
        }),
    })
        .then((response) => {
            return response.json().then((data) => ({
                ok: response.ok,
                status: response.status,
                data: data,
            }));
        })
        .then((response) => {
            if (!response.ok) {
                throw new ApiError(response.status, response.data.errors);
            }

            return response.data.links[0];
        });
}

class ApiError extends Error {
    constructor(status, errors) {
        super("API error");
        this.name = this.constructor.name;
        this.status = status;
        this.errors = errors;
    }
}

export default {
    authenticate,
    searchLink,
    ApiError,
};
