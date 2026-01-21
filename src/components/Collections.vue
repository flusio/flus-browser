<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <div>
        <div v-if="open && ready" class="panel panel--grey panel--rounded flow">
            <ul v-if="selectedCollections.length > 0" class="list--nostyle flow flow--smaller">
                <li
                    v-for="collection in selectedCollections"
                    class="cols cols--always cols--center cols--gap-smaller"
                >
                    <span class="col--extend">
                        {{ collection.name }}

                        <span v-if="collection.isPublic" class="badge badge--accent">
                            {{ t('collection.public') }}
                        </span>
                    </span>

                    <button
                        @click="() => removeCollection(collection)"
                        type="button"
                        :disabled="form.inProgress()"
                    >
                        {{ t('collection.remove') }}
                    </button>
                </li>
            </ul>

            <form
                v-if="notSelectedCollections.length > 0"
                @submit.prevent="addCollection"
                class="flow"
                :disabled="form.inProgress()"
            >
                <div v-if="fillMode === 'select'" class="form-group">
                    <div class="cols cols--always cols--center cols--gap-smaller">
                        <label for="collection-select" class="col--extend">
                            {{ t('collection.add_to_collection') }}
                        </label>

                        <div>
                            <button
                                type="button"
                                class="button--smaller"
                                @click="setFillModeToText"
                                :disabled="form.inProgress()"
                            >
                                <Icon name="pencil" />
                                {{ t('collection.new') }}
                            </button>
                        </div>
                    </div>

                    <select
                        v-model="newCollectionId"
                        id="collection-select"
                        ref="collection-select"
                        :disabled="form.inProgress()"
                    >
                        <option v-for="collection in notSelectedCollectionsNoGroup" :value="collection.id">
                            {{ collection.name }}

                            <template v-if="collection.isPublic">
                                ({{ t('collection.public') }})
                            </template>
                        </option>

                        <optgroup v-for="[groupName, groupCollections] in notSelectedCollectionsByGroup" :label="groupName">
                            <option v-for="collection in groupCollections" :value="collection.id">
                                {{ collection.name }}

                                <template v-if="collection.isPublic">
                                    ({{ t('collection.public') }})
                                </template>
                            </option>
                        </optgroup>
                    </select>
                </div>

                <div v-else class="form-group">
                    <div class="cols cols--always cols--center cols--gap-smaller">
                        <label for="collection-name" class="col--extend">
                            {{ t('collection.name') }}
                        </label>

                        <div>
                            <button
                                type="button"
                                class="button--smaller"
                                @click="setFillModeToSelect"
                                :disabled="form.inProgress()"
                            >
                                {{ t('collection.new_cancel') }}
                            </button>
                        </div>
                    </div>

                    <input
                        type="text"
                        v-model="newCollectionName"
                        id="collection-name"
                        ref="collection-name"
                        :disabled="form.inProgress()"
                    >
                </div>

                <div class="text--center">
                    <button class="button--primary" :disabled="form.inProgress()">
                        {{ t('collection.add') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, useTemplateRef, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";

import api from "../api.js";
import http from "../http.js";
import { store } from "../store.js";
import form from "../form.js";
import Collection from "../models/collection.js";

const { t, locale } = useI18n();
locale.value = store.locale;

const props = defineProps({
    link: {
        type: Object,
        required: true,
    },
    open: {
        type: Boolean,
    },
});

const ready = ref(false);
const collections = ref([]);
const newCollectionId = ref("");
const newCollectionName = ref("");
const fillMode = ref("select");

const collectionSelectRef = useTemplateRef("collection-select");
const collectionNameRef = useTemplateRef("collection-name");

const selectedCollections = computed(() => {
    return collections.value.filter((collection) => {
        return props.link.collections.includes(collection.id);
    });
});

const notSelectedCollections = computed(() => {
    return collections.value.filter((collection) => {
        return !props.link.collections.includes(collection.id);
    });
});

const notSelectedCollectionsNoGroup = computed(() => {
    return notSelectedCollections.value.filter((collection) => {
        return collection.group === null;
    });
});

const notSelectedCollectionsByGroup = computed(() => {
    const collectionsWithGroup = notSelectedCollections.value.filter((collection) => {
        return collection.group !== null;
    });

    const groupedCollections = Object.groupBy(collectionsWithGroup, (collection) => {
        return collection.group;
    });

    return Object.entries(groupedCollections);
});

async function setFillModeToText() {
    fillMode.value = "text";

    await nextTick();

    collectionNameRef.value.focus();
}

async function setFillModeToSelect() {
    fillMode.value = "select";
    newCollectionName.value = "";

    await nextTick();

    collectionSelectRef.value.focus();
}

function setDefaultSelectedCollectionId() {
    if (notSelectedCollectionsNoGroup.value.length > 0) {
        newCollectionId.value = notSelectedCollectionsNoGroup.value[0].id;
    } else if (notSelectedCollections.value.length > 0) {
        newCollectionId.value = notSelectedCollections.value[0].id;
    }
}

function loadCollections() {
    api.collections().then((fetchedCollections) => {
        fetchedCollections.sort((collection1, collection2) => {
            return collection1.name.localeCompare(collection2.name);
        });

        collections.value = fetchedCollections.map((fetchedCollection) => {
            const collection = reactive(new Collection());
            collection.init(fetchedCollection);
            return collection;
        });

        setDefaultSelectedCollectionId();

        ready.value = true;
    });
}

async function addCollection() {
    form.startRequest();

    let collection = null;

    if (newCollectionName.value) {
        // First, check if the "new" name already exists.
        collection = collections.value.find((collection) => {
            return collection.name === newCollectionName.value;
        });

        if (!collection) {
            try {
                // No? Then create the collection.
                const fetchedCollection = await api.createCollection(newCollectionName.value);

                collection = new Collection();
                collection.init(fetchedCollection);

                collections.value = [...collections.value, collection];
            } catch (error) {
                store.notify("error", t("errors.unknown"));
            }
        }
    } else {
        collection = collections.value.find((collection) => {
            return collection.id === newCollectionId.value;
        });
    }

    if (!collection) {
        form.finishRequest();
        return;
    }

    try {
        await api.addCollectionToLink(props.link, collection);

        props.link.addCollection(collection);

        setFillModeToSelect();
    } catch (error) {
        store.notify("error", t("errors.unknown"));
    }

    form.finishRequest();
}

async function removeCollection(collection) {
    form.startRequest();

    try {
        await api.removeCollectionFromLink(props.link, collection);

        props.link.removeCollection(collection);
    } catch (error) {
        store.notify("error", t("errors.unknown"));
    }

    form.finishRequest();
}

watch(
    () => props.link.collections,
    () => {
        setDefaultSelectedCollectionId();
    },
);

onMounted(loadCollections);
</script>
