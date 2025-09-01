<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <component :is="screen" />
</template>

<script setup>
import { computed } from "vue";

import { store } from "./store.js";
import { requireAuth, isAuthenticated } from "./auth.js";
import { currentScreen } from "./router.js";

import LoadingScreen from "./screens/LoadingScreen.vue";
import LoginScreen from "./screens/LoginScreen.vue";
import MenuScreen from "./screens/MenuScreen.vue";
import NotFoundScreen from "./screens/NotFoundScreen.vue";

const screen = computed(() => {
    if (!store.ready) {
        return LoadingScreen;
    }

    if (currentScreen.value == null) {
        return NotFoundScreen;
    }

    if (requireAuth() && !isAuthenticated()) {
        return LoginScreen;
    }

    if (store.menuOpened) {
        return MenuScreen;
    }

    return currentScreen.value;
});
</script>
