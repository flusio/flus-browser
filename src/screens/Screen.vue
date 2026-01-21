<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <div class="screen">
        <header v-if="header" class="screen__header panel panel--gable cols cols--always cols--center">
            <div class="col--extend">
                <a v-if="currentPath == '/'" class="screen__logo" href="#/">
                    <img :src="logo" alt="Flus" height="32">
                </a>
                <a v-else class="button button--ghost button--big button--animated" href="#/">
                    <Icon name="arrow-left" />
                    {{ t("menu.back") }}
                </a>
            </div>

            <div class="cols cols--always cols--gap-smaller">
                <a
                    v-if="currentPath != '/feeds'"
                    href="#/feeds"
                    class="button button--icon button--ghost"
                    :title="t('menu.feeds')"
                >
                    <Icon name="feed" />

                    <span class="sr-only">
                        {{ t("menu.feeds") }}
                    </span>
                </a>

                <button
                    v-if="store.menuOpened"
                    class="button button--icon button--ghost"
                    @click.prevent="store.closeMenu"
                >
                    <Icon name="times" />

                    <span class="sr-only">
                        {{ t("menu.close") }}
                    </span>
                </button>

                <button
                    v-else
                    class="button button--icon button--ghost"
                    @click.prevent="store.openMenu"
                >
                    <Icon name="menu" />

                    <span class="sr-only">
                        {{ t("menu.open") }}
                    </span>
                </button>
            </div>
        </header>

        <main role="main" :class="{ 'screen__body': true, 'screen__body--menu': store.menuOpened }">
            <span
                ref="title"
                tabindex="-1"
                class="sr-only"
                aria-live="polite"
            >{{ title }}</span>

            <Notification v-if="store.notification" />

            <slot />
        </main>
    </div>
</template>

<script setup>
import { watch, useTemplateRef, onMounted, onUpdated } from "vue";
import { useI18n } from "vue-i18n";

import { store } from "../store.js";
import { currentPath } from "../router.js";
import Notification from "../components/Notification.vue";

import logo from "url:../images/logo-white.svg";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    header: {
        type: Boolean,
    },
});

const titleRef = useTemplateRef("title");

const { t, locale } = useI18n();
locale.value = store.locale;

function giveFocusToTitle() {
    const titleValue = titleRef.value.innerText;

    const previousTitle = document.title;

    if (previousTitle !== titleValue) {
        document.title = titleValue;
        titleRef.value.focus();
    }
}

onMounted(() => {
    giveFocusToTitle();
});

onUpdated(() => {
    giveFocusToTitle();
});
</script>
