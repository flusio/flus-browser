// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ref } from "vue";

const formErrors = ref({});
const formStatus = ref("pending");

function startRequest() {
    formStatus.value = "in progress";
    formErrors.value = {};
}

function finishRequest() {
    formStatus.value = "pending";
}

function inProgress() {
    return formStatus.value === "in progress";
}

function setAndFormatErrors(errors, t) {
    const formattedErrors = {};

    for (const [field, fieldErrors] of Object.entries(errors)) {
        const messages = fieldErrors.map((error) => t(`errors.${field}.${error.code}`));
        formattedErrors[field] = messages.join(" ");
    }

    formErrors.value = formattedErrors;
}

function isInvalid(field) {
    return formErrors.value[field] != null;
}

function error(field) {
    return formErrors.value[field];
}

export default {
    startRequest,
    finishRequest,
    inProgress,
    setAndFormatErrors,
    isInvalid,
    error,
};
