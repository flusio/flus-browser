<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <p>
        {{ t("loading.in_progress") }}
    </p>
</template>

<script setup>
import { useI18n } from "vue-i18n";

import { store } from "../store.js";

const { t, locale } = useI18n();
locale.value = store.locale;
</script>
