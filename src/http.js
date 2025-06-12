// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { store } from "./store.js";
import { redirect } from "./router.js";

function parseJson(response) {
    return response.json().then((data) => ({
        ok: response.ok,
        status: response.status,
        data: data,
    }));
}

function handleErrors(response) {
    if (response.status === 401) {
        store.logout();
        store.notify("error", t("errors.auth.invalid_token"));
        redirect("/login");
    } else if (!response.ok) {
        throw new HttpError(response.status, response.data);
    }

    return response.data;
}

function get(endpoint, options = { server: null, authorization: "normal" }) {
    const server = options.server ? options.server : store.auth.server;
    const url = new URL(`${server}/api/v1${endpoint}`);

    const fetchOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (options.authorization !== "none") {
        fetchOptions.headers.Authorization = `Bearer ${store.auth.token}`;
    }

    return fetch(url, fetchOptions).then(parseJson).then(handleErrors);
}

function post(endpoint, payload, options = { server: null, authorization: "normal" }) {
    const server = options.server ? options.server : store.auth.server;
    const url = new URL(`${server}/api/v1${endpoint}`);

    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    };

    if (options.authorization !== "none") {
        fetchOptions.headers.Authorization = `Bearer ${store.auth.token}`;
    }

    return fetch(url, fetchOptions).then(parseJson).then(handleErrors);
}

class HttpError extends Error {
    constructor(status, errors) {
        super("HTTP error");
        this.name = this.constructor.name;
        this.status = status;
        this.errors = errors;
    }
}

export default {
    get,
    post,
    HttpError,
};
