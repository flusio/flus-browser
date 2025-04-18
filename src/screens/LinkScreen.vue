<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <div class="flow text--center">
        <h1>
            {{ title }}
        </h1>

        <button @click="logout">
            {{ t("auth.logout") }}
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import browser from "webextension-polyfill";

import { requireAuth } from "../auth.js";
import { store } from "../store.js";

requireAuth();

const { t, locale } = useI18n();
locale.value = store.locale;

const title = ref("");

async function getCurrentTab() {
    return await browser.tabs
        .query({
            active: true,
            currentWindow: true,
        })
        .then((tabs) => {
            return tabs[0];
        });
}

async function refreshForCurrentTab() {
    title.value = (await getCurrentTab()).title;
}

onMounted(refreshForCurrentTab);

function logout() {
    store.logout();
}
</script>
