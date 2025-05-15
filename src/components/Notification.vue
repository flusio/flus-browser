<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <div :class="['notification', 'panel', 'panel--rounded', panelType]">
        <div class="cols cols--always cols--gap-small">
            <p class="col--extend text--bold" role="alert">
                {{ store.notification.message }}
            </p>

            <div>
                <button class="button--icon button--small" type="button" @click="store.resetNotification">
                    <Icon name="times" />

                    <span class="sr-only">
                        {{ t('notification.close') }}
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { store } from "../store.js";

const { t, locale } = useI18n();
locale.value = store.locale;

const panelType = computed(() => {
    if (store.notification.type === "error") {
        return "panel--danger";
    }

    if (store.notification.type === "success") {
        return "panel--caribbean";
    }

    return "panel--grey";
});
</script>

<style>
.notification {
    overflow: hidden;

    position: absolute;
    top: var(--space-medium);
    right: var(--space-small);
    left: var(--space-small);

    box-shadow: 1px 2px 3px 0 var(--color-box-shadow);
}
</style>
