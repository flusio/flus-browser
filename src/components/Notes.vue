<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <div v-if="ready" class="flow flow--large">
        <div class="cols cols--always cols--center cols--gap">
            <h2 class="col--extend text--big">{{ t('notes.title') }}</h2>

            <a
                class="button button--ghost"
                :href="notesUrl"
                :title="t('notes.open_in_flus')"
                target="_blank"
            >
                <Icon name="pop-out" />
                {{ t('notes.open') }}
            </a>
        </div>

        <article v-if="link.notes.length > 0" class="panel panel--base panel--rounded text-container">
            <div v-for="[dateIso, notes] in notesByDates">
                <p class="text--secondary text--small text--right">
                    <time :datetime="dateIso">
                        {{ dateToLocaleString(dateIso) }}
                    </time>
                </p>

                <!-- This displays raw HTML coming from the API. The HTML
                     should already be safe as it is generated from Markdown
                     syntax and limited to a few tags. As an additional security
                     measure, the HTML is also sanitized on client-side (see the
                     models/link.js file). -->
                <div
                    v-for="note in notes"
                    v-html="note.htmlContent"
                >
                </div>
            </div>
        </article>

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
                    ref="note-content"
                    :aria-invalid="form.isInvalid('content')"
                    :aria-errormessage="form.isInvalid('content') ? 'note-content-error' : null"
                ></textarea>
            </div>

            <div class="text--center">
                <button class="button--primary button--big" :disabled="form.inProgress()">
                    {{ t('notes.add') }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, computed } from "vue";
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

const noteContentRef = useTemplateRef("note-content");

const notesByDates = computed(() => {
    const linkNotes = props.link.notes;

    linkNotes.sort((note1, note2) => {
        return note1.createdAt - note2.createdAt;
    });

    const linkNotesByDates = Map.groupBy(linkNotes, (note) => {
        const date = new Date(note.createdAt);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.toISOString();
    });

    return Array.from(linkNotesByDates.entries());
});

const notesUrl = computed(() => {
    return `${store.auth.server}/links/${props.link.id}`;
});

function dateToLocaleString(dateIso) {
    const date = new Date(dateIso);
    return date.toLocaleDateString(locale.value, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

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

            noteContentRef.value.focus();
        })
        .catch((error) => {
            form.finishRequest();

            if (error instanceof http.HttpError) {
                form.setAndFormatErrors(error.errors, t);
            } else {
                store.notify("error", t("errors.unknown"));
            }

            noteContentRef.value.focus();
        });
}

onMounted(loadNotes);
</script>
