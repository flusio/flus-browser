<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <component v-if="store.ready" :is="currentView" />
    <LoadingScreen v-else />
</template>

<script setup>
import { store } from "./store.js";
import { currentView } from "./router.js";

import LoadingScreen from "./screens/LoadingScreen.vue";
</script>
