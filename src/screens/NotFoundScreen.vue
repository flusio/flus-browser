<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="title">
        <div class="panel flow text--center">
            <h1>
                {{ title }}
            </h1>

            <p>
                {{ t("not_found.details") }}
            </p>

            <p>
                <a class="button button--primary" href="#/">
                    {{ t("not_found.back") }}
                </a>
            </p>
        </div>
    </Screen>
</template>

<script setup>
import { useI18n } from "vue-i18n";

import { store } from "../store.js";

const { t, locale } = useI18n();
locale.value = store.locale;

const title = t("not_found.title");
</script>
