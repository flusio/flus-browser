// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createApp } from "vue";

import App from "./App.vue";
import { i18n } from "./i18n.js";

import Icon from "./components/Icon.vue";

const app = createApp(App);

app.use(i18n);
app.component("Icon", Icon);

app.mount("#app");
