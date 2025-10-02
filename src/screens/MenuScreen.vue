<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="title" header>
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

            <li v-if="shouldShowShortcuts">
                <a href="#" class="button button--big button--ghost" @click="openShortcuts">
                    {{ t("menu.shortcuts") }}
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
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import browser from "webextension-polyfill";

import { isAuthenticated } from "../auth.js";
import { store } from "../store.js";
import { redirect } from "../router.js";
import api from "../api.js";
import * as browserUtils from "../browser.js";
import * as tabs from "../tabs.js";

const { t, locale } = useI18n();
locale.value = store.locale;

const title = t("menu.title");

function logout() {
    api.logout().finally(() => {
        store.logout();
        redirect("/");
    });
}

async function openShortcuts() {
    if (await browserUtils.isChrome()) {
        tabs.open("chrome://extensions/shortcuts");
    } else {
        browser.commands.openShortcutSettings();
    }
}

const shouldShowShortcuts = ref(false);

onMounted(async () => {
    shouldShowShortcuts.value =
        (await browserUtils.isChrome()) || browser.commands.openShortcutSettings != null;
});
</script>
