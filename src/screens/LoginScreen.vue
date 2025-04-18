<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <div class="panel text--center flow flow--large">
        <img :src="logo" alt="Flus" height="50">

        <p>
            {{ t("login.intro") }}
        </p>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

import { store } from "../store.js";

import logo from "url:../images/logo.svg";

const { t, locale } = useI18n();
locale.value = store.locale;
</script>
