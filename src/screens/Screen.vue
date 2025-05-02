<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <main role="main">
        <span
            ref="title"
            tabindex="-1"
            class="sr-only"
            aria-live="polite"
        >{{ title }}</span>

        <Notification v-if="store.notification" />

        <slot />
    </main>
</template>

<script setup>
import { watch, useTemplateRef, onMounted, onUpdated } from "vue";

import { store } from "../store.js";
import Notification from "../components/Notification.vue";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
});

const titleRef = useTemplateRef("title");

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
