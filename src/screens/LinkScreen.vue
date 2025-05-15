<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="title" header>
        <div class="flow text--center">
            <h1>
                {{ title }}
            </h1>
        </div>
    </Screen>
</template>

<script setup>
import { ref, onMounted } from "vue";
import browser from "webextension-polyfill";

import { requireAuth } from "../auth.js";

requireAuth();

const title = ref("");

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
    title.value = (await getCurrentTab()).title;
}

onMounted(refreshForCurrentTab);
</script>
