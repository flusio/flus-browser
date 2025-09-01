<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="title" header menuOpened>
        <ul class="list--nostyle flow text--bold text--center">
            <li>
                <a :href="store.auth.server" target="_blank" class="button button--big button--ghost">
                    {{ t("menu.open_flus") }}
                </a>
            </li>

            <li>
                <a href="#/settings" class="button button--big button--ghost">
                    {{ t("menu.settings") }}
                </a>
            </li>

            <li v-if="isAuthenticated()">
                <button @click="logout" class="button--big button--ghost">
                    {{ t("menu.logout") }}
                </button>
            </li>
        </ul>
    </Screen>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import browser from "webextension-polyfill";

import { isAuthenticated } from "../auth.js";
import { store } from "../store.js";
import { redirect } from "../router.js";

const { t, locale } = useI18n();
locale.value = store.locale;

const title = t("menu.title");

function logout() {
    store.logout();
    redirect("/");
}
</script>
