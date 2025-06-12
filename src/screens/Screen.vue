<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <div class="screen">
        <header v-if="header" class="screen__header panel panel--gable cols cols--always cols--center">
            <div class="col--extend">
                <a class="screen__logo" href="#/">
                    <img :src="logo" alt="Flus" height="32">
                </a>
            </div>

            <div>
                <a v-if="menuOpened" href="#/" class="button button--icon button--ghost button--small">
                    <Icon name="times" />

                    <span class="sr-only">
                        {{ t("menu.close") }}
                    </span>
                </a>

                <a v-else href="#/menu" class="button button--icon button--ghost button--small">
                    <Icon name="menu" />

                    <span class="sr-only">
                        {{ t("menu.open") }}
                    </span>
                </a>
            </div>
        </header>

        <main role="main" :class="{ 'panel': true, 'screen__body': true, 'panel--gable': menuOpened }">
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
    menuOpened: {
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
