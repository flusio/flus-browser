<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="linkTitle" header>
        <div v-if="ready && alert.type === ''">
            <div class="flow flow--small">
                <h1 class="text--normal">
                    {{ linkTitle }}
                </h1>

                <p class="text--secondary">
                    {{ hostLabel }}&nbsp;·&nbsp;{{ readingTimeLabel }}
                </p>

                <div v-if="tags">
                    <span v-for="tag in tags" class="tag badge badge--accent">#{{ tag }}</span>
                </div>
            </div>
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
                {{ t("link.loading") }}
            </p>
        </div>
    </Screen>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import browser from "webextension-polyfill";

import { requireAuth, isAuthenticated } from "../auth.js";
import { store } from "../store.js";
import { redirect } from "../router.js";
import api from "../api.js";

requireAuth();

const { t, locale } = useI18n();
locale.value = store.locale;

const ready = ref(false);
const alert = ref({
    type: "",
    message: "",
});

const linkTitle = ref("");
const linkUrl = ref("");
const linkReadingTime = ref(0);
const linkTags = ref({});

const hostLabel = computed(() => {
    const parsedUrl = new URL(linkUrl.value);

    if (parsedUrl.host.startsWith("www.")) {
        return parsedUrl.host.slice(4);
    }

    return parsedUrl.host;
});

const readingTimeLabel = computed(() => {
    if (linkReadingTime.value < 1) {
        return "< 1 min";
    }

    return `${linkReadingTime.value} min`;
});

const tags = computed(() => {
    return Object.values(linkTags.value);
});

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

    api.searchLink(url)
        .then((link) => {
            linkTitle.value = link.title;
            linkUrl.value = link.url;
            linkReadingTime.value = link.reading_time;
            linkTags.value = link.tags;

            ready.value = true;
        })
        .catch((error) => {
            if (error instanceof api.ApiError && error.status === 401) {
                store.logout();
                store.notify("error", t("errors.auth.invalid_token"));
                redirect("/login");
            } else if (error instanceof api.ApiError) {
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

if (isAuthenticated()) {
    onMounted(refreshForCurrentTab);
}
</script>
