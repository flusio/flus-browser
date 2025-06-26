// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import http from "./http.js";

function authenticate(server, email, password) {
    return http
        .post(
            "/sessions",
            {
                app_name: "Flus Browser",
                email,
                password,
            },
            {
                server,
                authorization: "none",
            },
        )
        .then((data) => {
            return data.token;
        });
}

function search(url) {
    return http.post("/search", { url }).then((data) => {
        return data.links[0];
    });
}

function markLinkAsRead(link) {
    return http.post(`/links/${link.id}/read`);
}

function markLinkAsReadLater(link) {
    return http.post(`/links/${link.id}/later`);
}

function collections() {
    return http.get("/collections");
}

function addCollectionToLink(link, collection) {
    return http.put(`/links/${link.id}/collections/${collection.id}`);
}

function removeCollectionFromLink(link, collection) {
    return http.delete(`/links/${link.id}/collections/${collection.id}`);
}

export default {
    authenticate,
    collections,
    addCollectionToLink,
    removeCollectionFromLink,
    search,
    markLinkAsRead,
    markLinkAsReadLater,
};
