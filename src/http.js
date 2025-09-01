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
        redirect("/");
    } else if (!response.ok) {
        throw new HttpError(response.status, response.data);
    }

    return response.data;
}

function get(endpoint, options = { server: null, authorization: "normal" }) {
    return request("GET", endpoint, null, options);
}

function post(endpoint, payload = null, options = { server: null, authorization: "normal" }) {
    return request("POST", endpoint, payload, options);
}

function put(endpoint, payload = null, options = { server: null, authorization: "normal" }) {
    return request("PUT", endpoint, payload, options);
}

function delete_(endpoint, payload = null, options = { server: null, authorization: "normal" }) {
    return request("DELETE", endpoint, payload, options);
}

function request(
    method,
    endpoint,
    payload = null,
    options = { server: null, authorization: "normal" },
) {
    const server = options.server ? options.server : store.auth.server;
    const url = new URL(`${server}/api/v1${endpoint}`);

    const fetchOptions = {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (options.authorization !== "none") {
        fetchOptions.headers.Authorization = `Bearer ${store.auth.token}`;
    }

    if (payload !== null) {
        fetchOptions.body = JSON.stringify(payload);
    }

    return fetch(url, fetchOptions).then(parseJson).then(handleErrors);
}

class HttpError extends Error {
    constructor(status, data) {
        super("HTTP error");
        this.name = this.constructor.name;
        this.status = status;
        this.errors = data.errors != null ? data.errors : data;
    }
}

export default {
    delete: delete_,
    get,
    post,
    put,
    request,
    HttpError,
};
