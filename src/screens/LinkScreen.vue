<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="link.title" header>
        <div v-if="ready && alert.type === ''" class="flow">
            <div class="flow">
                <div class="flow flow--smaller">
                    <h1 class="text--normal">
                        {{ link.title }}
                    </h1>

                    <p class="text--secondary">
                        {{ link.host() }}&nbsp;·&nbsp;{{ link.readingTimeLabel() }}

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

                <div v-if="link.url != currentTabUrl" class="panel panel--rounded panel--grey cols cols--always cols--gap-small cols--center">
                    <p class="col--extend">
                        {{ t("link.tab_unsync") }}
                    </p>

                    <div>
                        <button type="button" @click="refreshForCurrentTab">
                            <Icon name="sync" />
                            {{ t("link.refresh") }}
                        </button>
                    </div>
                </div>

                <div class="cols cols--always cols--center cols--gap-small">
                    <div class="col--extend cols cols--always cols--center cols--gap-small">
                        <button v-if="!link.isRead || link.isReadLater" class="button--icon" @click.prevent="markAsRead">
                            <Icon name="check" />
                            <span class="sr-only">
                                {{ t("link.mark_as_read") }}
                            </span>
                        </button>

                        <button v-if="!link.isReadLater" class="button--icon" @click.prevent="markAsReadLater">
                            <Icon name="bookmark" />
                            <span class="sr-only">
                                {{ t("link.mark_as_read_later") }}
                            </span>
                        </button>
                    </div>

                    <button
                        @click="toggleCollections"
                        :aria-expanded="displayCollections"
                        aria-controls="collections"
                    >
                        <Icon name="collection" />
                        {{ t("link.count_collections", link.collections.length) }}
                    </button>
                </div>

                <Collections
                    id="collections"
                    :link="link"
                    :open="displayCollections"
                />
            </div>

            <hr>

            <Notes :link="link" />
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
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import browser from "webextension-polyfill";

import { store } from "../store.js";
import api from "../api.js";
import http from "../http.js";
import Link from "../models/link.js";
import Collections from "../components/Collections.vue";
import Notes from "../components/Notes.vue";

const { t, locale } = useI18n();
locale.value = store.locale;

const link = reactive(new Link());
const currentTabUrl = ref("");
const ready = ref(false);
const displayCollections = ref(false);
const alert = ref({
    type: "",
    message: "",
});

function toggleCollections() {
    displayCollections.value = !displayCollections.value;
}

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
    ready.value = false;

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
        .then((data) => {
            link.init(data.links[0]);
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

async function refreshCurrentTabUrl() {
    currentTabUrl.value = (await getCurrentTab()).url;
}

async function markAsRead() {
    api.markLinkAsRead(link)
        .then(() => {
            link.markAsRead();
        })
        .catch(() => {
            alert.value = {
                type: "error",
                message: t("errors.unknown"),
            };
        });
}

async function markAsReadLater() {
    api.markLinkAsReadLater(link)
        .then(() => {
            link.markAsReadLater();
        })
        .catch(() => {
            alert.value = {
                type: "error",
                message: t("errors.unknown"),
            };
        });
}

onMounted(refreshForCurrentTab);
onMounted(refreshCurrentTabUrl);

browser.tabs.onUpdated.addListener(refreshCurrentTabUrl);
browser.tabs.onActivated.addListener(refreshCurrentTabUrl);
browser.windows.onFocusChanged.addListener(refreshCurrentTabUrl);
</script>
