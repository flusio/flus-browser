<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="title" header>
        <div v-if="ready && alert.type === ''" class="flow">
            <p class="text--center">
                {{ t("feeds.count_detected", feeds.length) }}
            </p>

            <ul v-if="feeds.length > 0" class="list--nostyle list--padded list--separated">
                <li v-for="feed in feeds" class="cols cols--center cols--always cols--gap-smaller">
                    <span class="col--extend">
                        {{ feed.name }}
                    </span>

                    <div class="cols cols--always cols--center cols--gap-small">
                        <button
                            v-if="!feed.isFollowed"
                            @click.prevent="() => follow(feed)"
                        >
                            {{ t("feeds.follow") }}
                        </button>

                        <button
                            v-else
                            @click.prevent="() => unfollow(feed)"
                        >
                            {{ t("feeds.unfollow") }}
                        </button>

                        <a
                            class="button button--icon"
                            :href="feedUrl(feed)"
                            :title="t('feeds.open_in_flus')"
                            target="_blank"
                        >
                            <Icon name="pop-out" />
                            <span class="sr-only">
                                {{ t("feeds.open_in_flus") }}
                            </span>
                        </a>
                    </div>
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
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import browser from "webextension-polyfill";

import { store } from "../store.js";
import api from "../api.js";
import http from "../http.js";
import Feed from "../models/feed.js";

const { t, locale } = useI18n();
locale.value = store.locale;

const title = t("feeds.title");

const ready = ref(false);
const alert = ref({
    type: "",
    message: "",
});

const feeds = ref([]);

function feedUrl(feed) {
    return `${store.auth.server}/collections/${feed.id}`;
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
            // This array is used to deduplicate feeds with the same name.
            // This usually happens when a site declares both Atom and RSS
            // feeds. In our case, it's generally disturbing for the user to
            // have several feeds with the same name.
            const feedsNames = [];
            data.feeds.forEach((searchedFeed) => {
                const feed = reactive(new Feed());
                feed.init(searchedFeed);
                if (!feedsNames.includes(feed.name)) {
                    feeds.value = [...feeds.value, feed];
                    feedsNames.push(feed.name);
                }
            });
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

async function follow(feed) {
    api.follow(feed)
        .then(() => {
            feed.follow();
        })
        .catch(() => {
            alert.value = {
                type: "error",
                message: t("errors.unknown"),
            };
        });
}

async function unfollow(feed) {
    api.unfollow(feed)
        .then(() => {
            feed.unfollow();
        })
        .catch(() => {
            alert.value = {
                type: "error",
                message: t("errors.unknown"),
            };
        });
}

onMounted(refreshForCurrentTab);
</script>
