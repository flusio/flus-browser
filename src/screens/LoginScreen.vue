<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="title">
        <div class="flow flow--large">
            <div class="panel text--center flow">
                <img :src="logo" alt="Flus" height="50">

                <p>
                    {{ t("login.intro") }}
                </p>
            </div>

            <form @submit.prevent="login" class="flow">
                <p v-if="form.isInvalid('@base')" class="form-group__error" role="alert">
                    {{ t('forms.error') }}
                    {{ form.error('@base') }}
                </p>

                <div class="flow flow--smaller">
                    <label for="login-email">
                        {{ t('login.email.label') }}
                    </label>

                    <p v-if="form.isInvalid('email')" id="login-email-error" class="form-group__error" role="alert">
                        {{ t('forms.error') }}
                        {{ form.error('email') }}
                    </p>

                    <input
                        id="login-email"
                        type="email"
                        required
                        v-model.trim="email"
                        :aria-invalid="form.isInvalid('email')"
                        :aria-errormessage="form.isInvalid('email') ? 'login-email-error' : null"
                    >
                </div>

                <div class="flow flow--smaller">
                    <label for="login-password">
                        {{ t('login.password.label') }}
                    </label>

                    <p v-if="form.isInvalid('password')" id="login-password-error" class="form-group__error" role="alert">
                        {{ t('forms.error') }}
                        {{ form.error('password') }}
                    </p>

                    <input
                        id="login-password"
                        type="password"
                        required
                        v-model="password"
                        :aria-invalid="form.isInvalid('password')"
                        :aria-errormessage="form.isInvalid('password') ? 'login-password-error' : null"
                    >
                </div>

                <div v-if="displayServerInput" class="flow flow--smaller">
                    <label for="login-server">
                        {{ t('login.server.label') }}
                    </label>

                    <input
                        id="login-server"
                        type="text"
                        required
                        v-model.trim="server"
                    >
                </div>

                <div v-else class="cols cols--always cols--center cols--gap">
                    <p class="col--extend">
                        {{ t('login.server') }} {{ serverWithoutScheme }}
                    </p>

                    <button @click="displayServerInput = true" type="button" class="button--small">
                        {{ t('login.server.change') }}
                    </button>
                </div>

                <div class="text--center">
                    <button class="button--primary" :disabled="form.inProgress() ? 'true' : null">
                        {{ t("login.submit") }}
                    </button>
                </div>
            </form>
        </div>
    </Screen>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

import { requireNotAuth } from "../auth.js";
import { store } from "../store.js";
import api from "../api.js";
import form from "../form.js";

import logo from "url:../images/logo.svg";

requireNotAuth();

const { t, locale } = useI18n();
locale.value = store.locale;

const title = t("login.title");

const email = ref(store.auth.email);
const password = ref();
const server = ref(store.auth.server);

const displayServerInput = ref(false);

const serverWithoutScheme = computed(() => {
    const serverUrl = new URL(server.value);
    let urlWithoutScheme = serverUrl.host;
    if (serverUrl.pathname !== "/") {
        urlWithoutScheme += serverUrl.pathname;
    }
    return urlWithoutScheme;
});

function login() {
    form.startRequest();

    api.authenticate(server.value, email.value, password.value)
        .then((token) => {
            form.finishRequest();

            store.rememberCredentials(server.value, email.value, token);
        })
        .catch((error) => {
            form.finishRequest();

            if (error instanceof api.ApiError) {
                form.setAndFormatErrors(error.errors, t);
            } else {
                store.notify("error", t("login.errors.server_error", { server: server.value }));
            }
        });
}
</script>
