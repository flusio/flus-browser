<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="title" header>
        <div v-if="ready && alert.type === ''" class="flow flow--large">
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

            <div v-else class="flow">
                <hr>

                <p>
                    {{ t("feeds.search_tip") }}
                </p>

                <form
                    @submit.prevent="testUrl"
                    class="flow flow--small"
                    :disabled="form.inProgress()"
                >
                    <div class="flow flow--smaller">
                        <label for="url">
                            {{ t('feeds.url_potential_feed') }}
                        </label>

                        <p v-if="form.isInvalid('url')" id="url-error" class="form-group__error" role="alert">
                            {{ t('forms.error') }}
                            {{ form.error('url') }}
                        </p>

                        <div class="cols cols--always cols--gap-smaller">
                            <input
                                v-model="urlToTest"
                                type="url"
                                id="url"
                                placeholder="https://…"
                                required
                                :aria-invalid="form.isInvalid('url')"
                                :aria-errormessage="form.isInvalid('url') ? 'url-error' : null"
                                :disabled="form.inProgress()"
                            />

                            <button class="button--primary button--big" :disabled="form.inProgress()">
                                {{ t('feeds.test') }}
                            </button>
                        </div>
                    </div>

                    <div aria-live="polite">
                        <div v-if="!autotestResult">
                            {{ t('forms.or') }}

                            <button type="button" @click="testCommonFeedsPatterns">
                                {{ t('feeds.autotest.submit') }}
                            </button>
                        </div>

                        <p v-else class="form-group__error">
                            <Icon name="error"></Icon>
                            {{ autotestResult }}
                        </p>
                    </div>
                </form>
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
import form from "../form.js";
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

const urlToTest = ref("");
const autotestResult = ref("");

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

function refreshForUrl(url) {
    form.startRequest();

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
            form.finishRequest();
        })
        .catch((error) => {
            if (error instanceof http.HttpError) {
                form.setAndFormatErrors(error.errors, t);
            } else {
                alert.value = {
                    type: "error",
                    message: t("errors.unknown"),
                };
            }

            ready.value = true;
            form.finishRequest();
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

    refreshForUrl(url);
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

function testUrl() {
    refreshForUrl(urlToTest.value);
}

async function testCommonFeedsPatterns() {
    // Try not to add too many patterns as they generate several HTTP requests.
    const commonFeedsPatterns = [
        "/feed",
        "/feed.xml",
        "/rss.xml",
        "/atom.xml",
        "/index.xml",
        "/rss",
        "/rss/",
        "/rss/feed.xml",
    ];

    const tabUrl = (await getCurrentTab()).url;
    const parsedUrl = URL.parse(tabUrl);

    if (!parsedUrl) {
        autotestResult.value = t("feeds.autotest.invalid_url");
        return;
    }

    if (!(await hasPermissionsForAutotest())) {
        const result = await requestPermissionsForAutotest();
        if (!result) {
            autotestResult.value = t("feeds.autotest.missing_permissions");
            return;
        }
    }

    form.startRequest();

    const baseUrl = parsedUrl.origin;
    let foundFeed = false;

    for (const urlPattern of commonFeedsPatterns) {
        const testedFeedUrl = baseUrl + urlPattern;

        urlToTest.value = testedFeedUrl;

        const response = await fetch(testedFeedUrl);

        if (!response.ok) {
            continue;
        }

        const content = await response.text();
        foundFeed = looksLikeFeedContent(content);

        if (foundFeed) {
            break;
        }
    }

    form.finishRequest();

    if (foundFeed) {
        testUrl();
    } else {
        urlToTest.value = "";
        autotestResult.value = t("feeds.autotest.no_results");
    }
}

function looksLikeFeedContent(content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "application/xml");

    const rootElement = doc.documentElement ? doc.documentElement.tagName : null;

    return rootElement === "rss" || rootElement === "feed" || rootElement === "rdf";
}

async function hasPermissionsForAutotest() {
    const origins = ["http://*/*", "https://*/*"];

    return await browser.permissions.contains({ origins });
}

async function requestPermissionsForAutotest() {
    const origins = ["http://*/*", "https://*/*"];

    try {
        return await browser.permissions.request({ origins });
    } catch {
        // On Firefox, requesting the permission fails with the error:
        // "permissions.request may only be called from a user input handler".
        // See https://stackoverflow.com/q/47723297 for a bit more context. I
        // wasn't able to make it works though.
        return false;
    }
}

onMounted(refreshForCurrentTab);
</script>
