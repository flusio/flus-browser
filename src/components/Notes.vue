<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <div v-if="ready" class="flow flow--large">
        <h2 class="text--normal text--center">{{ t('notes.title') }}</h2>

        <div class="flow">
            <article
                v-for="note in notes"
                :id="`note-${note.id}`"
                class="note panel panel--rounded"
            >
                <header>
                    <div class="cols cols--always cols--center cols--gap-smaller">
                        <p class="col--extend note__author text--bold">
                            {{ note.user.username }}
                        </p>

                        <time class="text--secondary text--small" :datetime="note.createdAt.toISOString()">
                            {{ note.createdAt.toLocaleString(locale, {
                                'year': 'numeric',
                                'month': 'short',
                                'day': 'numeric',
                                'hour': '2-digit',
                                'minute': '2-digit',
                            }) }}
                        </time>
                    </div>
                </header>

                <!-- This displays raw HTML coming from the API. The HTML
                     should already be safe as it is generated from Markdown
                     syntax and limited to a few tags. As an additional security
                     measure, the HTML is also sanitized on client-side (see the
                     models/link.js file). -->
                <div
                    class="message__content text-container"
                    v-html="note.htmlContent"
                >
                </div>
            </article>
        </div>

        <form
            @submit.prevent="addNote"
            class="flow"
        >
            <p v-if="form.isInvalid('@base')" class="form-group__error" role="alert">
                {{ t('forms.error') }}
                {{ form.error('@base') }}
            </p>

            <div class="flow flow--small">
                <label for="note-content">
                    {{ t('notes.content') }}
                </label>

                <p v-if="form.isInvalid('content')" id="note-content-error" class="form-group__error" role="alert">
                    {{ t('forms.error') }}
                    {{ form.error('content') }}
                </p>

                <textarea
                    v-model="newNoteContent"
                    id="note-content"
                    required
                    :aria-invalid="form.isInvalid('content')"
                    :aria-errormessage="form.isInvalid('content') ? 'note-content-error' : null"
                ></textarea>
            </div>

            <div class="text--center">
                <button class="button--primary" :disabled="form.inProgress()">
                    {{ t('notes.add') }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";

import api from "../api.js";
import http from "../http.js";
import { store } from "../store.js";
import form from "../form.js";

const { t, locale } = useI18n();
locale.value = store.locale;

const props = defineProps({
    link: {
        type: Object,
        required: true,
    },
});

const ready = ref(false);
const newNoteContent = ref("");

const notes = computed(() => {
    const linkNotes = props.link.notes;

    linkNotes.sort((note1, note2) => {
        return note1.createdAt - note2.createdAt;
    });

    return linkNotes;
});

function loadNotes() {
    api.notes(props.link).then((linkNotes) => {
        for (const note of linkNotes) {
            props.link.addNote(note);
        }

        ready.value = true;
    });
}

function addNote() {
    form.startRequest();
    api.addNoteToLink(props.link, newNoteContent.value)
        .then((note) => {
            form.finishRequest();
            newNoteContent.value = "";
            props.link.addNote(note);
        })
        .catch((error) => {
            form.finishRequest();

            if (error instanceof http.HttpError) {
                form.setAndFormatErrors(error.errors, t);
            } else {
                store.notify("error", t("errors.unknown"));
            }
        });
}

onMounted(loadNotes);
</script>
