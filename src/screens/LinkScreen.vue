<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="link.title" header>
        <div v-if="ready && alert.type === ''" class="flow">
            <div class="flow flow--smaller">
                <h1 class="text--normal">
                    {{ link.title }}
                </h1>

                <p class="text--secondary">
                    {{ host }}&nbsp;·&nbsp;{{ readingTime }}

                    <span v-if="link.isRead" :title="t('link.is_read')">
                        <Icon name="check" />
                    </span>

                    <span v-if="link.isReadLater" :title="t('link.is_read_later')">
                        <Icon name="bookmark" />
                    </span>
                </p>

                <div v-if="link.tags">
                    <span v-for="tag in link.tags" class="tag badge badge--accent">#{{ tag }}</span>
                </div>
            </div>

            <div class="cols cols--always cols--center cols--gap">
                <button v-if="!link.isRead || link.isReadLater" class="button--icon button--small" @click.prevent="markAsRead">
                    <Icon name="check" />
                    <span class="sr-only">
                        {{ t("link.mark_as_read") }}
                    </span>
                </button>

                <button v-if="!link.isReadLater" class="button--icon button--small" @click.prevent="markAsReadLater">
                    <Icon name="bookmark" />
                    <span class="sr-only">
                        {{ t("link.mark_as_read_later") }}
                    </span>
                </button>
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
import api from "../api.js";
import http from "../http.js";
import { link, host, readingTime } from "../models/link.js";

requireAuth();

const { t, locale } = useI18n();
locale.value = store.locale;

const ready = ref(false);
const alert = ref({
    type: "",
    message: "",
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

    api.search(url)
        .then((fetchedLink) => {
            link.init(fetchedLink);
            ready.value = true;
        })
        .catch((error) => {
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

async function markAsRead() {
    api.markLinkAsRead(link)
        .then((result) => {
            link.markAsRead();
        })
        .catch((error) => {
            alert.value = {
                type: "error",
                message: t("errors.unknown"),
            };
        });
}

async function markAsReadLater() {
    api.markLinkAsReadLater(link)
        .then((result) => {
            link.markAsReadLater();
        })
        .catch((error) => {
            alert.value = {
                type: "error",
                message: t("errors.unknown"),
            };
        });
}

if (isAuthenticated()) {
    onMounted(refreshForCurrentTab);
}
</script>
