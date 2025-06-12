// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ref, computed } from "vue";

import LinkScreen from "./screens/LinkScreen.vue";
import LoginScreen from "./screens/LoginScreen.vue";
import MenuScreen from "./screens/MenuScreen.vue";
import NotFoundScreen from "./screens/NotFoundScreen.vue";
import SettingsScreen from "./screens/SettingsScreen.vue";

const routes = {
    "/": LinkScreen,
    "/login": LoginScreen,
    "/menu": MenuScreen,
    "/settings": SettingsScreen,
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
    currentPath.value = window.location.hash;
});

export const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || "/"] || NotFoundScreen;
});

export function redirect(path) {
    window.location.hash = `#${path}`;
}
