// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ref, computed } from "vue";

import LinkScreen from "./screens/LinkScreen.vue";
import LoginScreen from "./screens/LoginScreen.vue";
import MenuScreen from "./screens/MenuScreen.vue";
import SettingsScreen from "./screens/SettingsScreen.vue";

const routes = {
    "/": LinkScreen,
    "/menu": MenuScreen,
    "/settings": SettingsScreen,
};

const currentHash = ref(window.location.hash);

window.addEventListener("hashchange", () => {
    currentHash.value = window.location.hash;
});

export const currentPath = computed(() => {
    return currentHash.value.slice(1) || "/";
});

export const currentScreen = computed(() => {
    return routes[currentPath.value];
});

export function redirect(path) {
    window.location.hash = `#${path}`;
}
