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

export default {
    authenticate,
    search,
};
