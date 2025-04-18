<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="title">
        <div class="panel text--center flow flow--large">
            <img :src="logo" alt="Flus" height="50">

            <p>
                {{ t("login.intro") }}
            </p>

            <button @click="login">
                {{ t("login.form.submit") }}
            </button>
        </div>
    </Screen>
</template>

<script setup>
import { useI18n } from "vue-i18n";

import { requireNotAuth } from "../auth.js";
import { store } from "../store.js";

import logo from "url:../images/logo.svg";

requireNotAuth();

const { t, locale } = useI18n();
locale.value = store.locale;

const title = t("login.title");

function login() {
    store.rememberCredentials("https://app.flus.fr", "alix", "my-token");
}
</script>
