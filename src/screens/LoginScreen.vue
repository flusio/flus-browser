<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="title">
        <div class="flow">
            <div>
                <div class="cols cols--always">
                    <div class="col--extend">
                    </div>

                    <a href="#/menu" class="button button--icon button--ghost">
                        <Icon name="menu" />

                        <span class="sr-only">
                            {{ t("menu.open") }}
                        </span>
                    </a>
                </div>

                <div class="panel text--center flow flow--small">
                    <img :src="logo" alt="Flus" height="50">

                    <p>
                        {{ t("login.intro") }}
                    </p>
                </div>
            </div>

            <form @submit.prevent="login" class="flow flow--small">
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
                        autofocus
                        v-model.trim="server"
                    >
                </div>

                <div v-else class="cols cols--always cols--center cols--gap">
                    <p class="col--extend">
                        {{ t('login.server') }} {{ serverWithoutScheme }}
                    </p>

                    <button @click="displayServerInput = true" type="button">
                        {{ t('login.server.change') }}
                    </button>
                </div>

                <div class="flow flow--small text--center">
                    <div>
                        <button class="button--primary button--big" :disabled="form.inProgress() ? 'true' : null">
                            {{ t("login.submit") }}
                        </button>
                    </div>

                    <p>
                        {{ t("login.or") }}

                        <a @click.prevent="openRegistrationPage" :href="registrationUrl">
                            {{ t("login.register") }}
                        </a>
                    </p>
                </div>
            </form>
        </div>
    </Screen>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

import { store } from "../store.js";
import api from "../api.js";
import form from "../form.js";
import http from "../http.js";

import logo from "url:../images/logo.svg";

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

const registrationUrl = computed(() => {
    return `${server.value}/registration`;
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

            if (error instanceof http.HttpError) {
                form.setAndFormatErrors(error.errors, t);
            } else {
                store.notify("error", t("login.errors.server_error", { server: server.value }));
            }
        });
}

function openRegistrationPage() {
    browser.tabs.create({
        url: registrationUrl.value,
    });
}
</script>
