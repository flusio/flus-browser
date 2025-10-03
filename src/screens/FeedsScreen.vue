<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="title" header>
        <div v-if="ready && alert.type === ''" class="flow">
            <ul class="list--nostyle list--padded list--border">
                <li v-for="feed in feeds" class="cols cols--center cols--always cols--gap-smaller">
                    <span class="col--extend">
                        {{ feed.name }}
                    </span>

                    <a :href="feed.url" target="_blank" class="button button--icon">
                        <Icon name="eye" />
                        <span class="sr-only">
                            {{ t("feeds.open_feed") }}
                        </span>
                    </a>
                </li>
            </ul>
        </div>

        <div v-else-if="ready && alert.type == 'info'">
            <p class="panel panel--rounded panel--caribbean text--bold" role="alert">
                <Icon name="info" />

                {{ alert.message }}
            </p>
        </div>

        <div v-else-if="ready && alert.type == 'error'">
            <p class="panel panel--rounded panel--danger text--bold" role="alert">
                <Icon name="error" />

                {{ t("forms.error") }}
                {{ alert.message }}
            </p>
        </div>

        <div v-else-if="!ready" class="flow text--center">
            <div class="spinner"></div>

            <p>
                {{ t("feeds.loading") }}
            </p>
        </div>
    </Screen>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import browser from "webextension-polyfill";

import { store } from "../store.js";
import api from "../api.js";
import http from "../http.js";

const { t, locale } = useI18n();
locale.value = store.locale;

const title = t("feeds.title");

const ready = ref(false);
const alert = ref({
    type: "",
    message: "",
});

const feeds = ref([]);

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
    const url = (await getCurrentTab()).url;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        alert.value = {
            type: "info",
            message: t("link.invalid_protocol"),
        };

        ready.value = true;

        return;
    }

    api.searchFeeds(url)
        .then((searchedFeeds) => {
            searchedFeeds.forEach((feed) => {
                feeds.value = [...feeds.value, feed];
            });
            ready.value = true;
        })
        .catch((error) => {
            console.log(error);
            if (error instanceof http.HttpError) {
                alert.value = {
                    type: "error",
                    message: error.errors.url.map((error) => {
                        return t(`errors.url.${error.code}`);
                    }),
                };
            } else {
                alert.value = {
                    type: "error",
                    message: t("errors.unknown"),
                };
            }

            ready.value = true;
        });
}

onMounted(refreshForCurrentTab);
</script>
