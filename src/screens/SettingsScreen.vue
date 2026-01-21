<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <Screen :title="title" header>
        <form @submit.prevent="save" class="flow">
            <p v-if="form.isInvalid('@base')" class="form-group__error" role="alert">
                {{ t('forms.error') }}
                {{ form.error('@base') }}
            </p>

            <div class="form-group">
                <label for="settings-language">
                    {{ t('settings.language.label') }}
                </label>

                <p v-if="form.isInvalid('language')" id="settings-language-error" class="form-group__error" role="alert">
                    {{ t('forms.error') }}
                    {{ form.error('language') }}
                </p>

                <select
                    id="settings-language"
                    required
                    v-model.trim="language"
                    :aria-invalid="form.isInvalid('language')"
                    :aria-errormessage="form.isInvalid('language') ? 'settings-language-error' : null"
                >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                </select>
            </div>

            <div class="form-group">
                <label for="settings-theme">
                    {{ t('settings.theme.label') }}
                </label>

                <p v-if="form.isInvalid('theme')" id="settings-theme-error" class="form-group__error" role="alert">
                    {{ t('forms.error') }}
                    {{ form.error('theme') }}
                </p>

                <select
                    id="settings-theme"
                    required
                    v-model.trim="theme"
                    :aria-invalid="form.isInvalid('theme')"
                    :aria-errormessage="form.isInvalid('theme') ? 'settings-theme-error' : null"
                >
                    <option value="auto">{{ t('settings.theme.auto') }}</option>
                    <option value="light">{{ t('settings.theme.light') }}</option>
                    <option value="dark">{{ t('settings.theme.dark') }}</option>
                </select>
            </div>

            <div class="text--center">
                <button class="button--primary button--big" :disabled="form.inProgress()">
                    {{ t("settings.submit") }}
                </button>
            </div>
        </form>
    </Screen>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { isAuthenticated } from "../auth.js";
import { store } from "../store.js";
import form from "../form.js";

const { t, locale } = useI18n();
locale.value = store.locale;

const title = t("settings.title");

const language = ref(store.locale);
const theme = ref(store.theme);

watch(
    () => store.locale,
    (storeLocale) => {
        locale.value = storeLocale;
    },
);

watch(
    () => store.theme,
    (storeTheme) => {
        theme.value = storeTheme;
    },
);

function save() {
    form.startRequest();

    if (["en", "fr"].includes(language.value)) {
        store.setLocale(language.value);
    } else {
        form.setAndFormatErrors(
            {
                language: [{ code: "invalid" }],
            },
            t,
        );
    }

    if (["auto", "light", "dark"].includes(theme.value)) {
        store.setTheme(theme.value);
    } else {
        form.setAndFormatErrors(
            {
                theme: [{ code: "invalid" }],
            },
            t,
        );
    }

    form.finishRequest();
}
</script>
