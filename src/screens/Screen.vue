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

        <slot />
    </main>
</template>

<script setup>
import { watch, useTemplateRef, onMounted, onUpdated } from "vue";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
});

const titleRef = useTemplateRef("title");

function giveFocusToTitle() {
    const titleValue = titleRef.value.innerText;

    document.title = titleValue;

    titleRef.value.focus();
}

onMounted(() => {
    giveFocusToTitle();
});

onUpdated(() => {
    giveFocusToTitle();
});
</script>
