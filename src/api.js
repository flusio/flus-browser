// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

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
                throw new ApiError(response.data.errors);
            }

            return response.data.token;
        });
}

class ApiError extends Error {
    constructor(errors) {
        super("API error");
        this.name = this.constructor.name;
        this.errors = errors;
    }
}

export default {
    authenticate,
    ApiError,
};
