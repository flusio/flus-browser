<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <div v-if="ready" class="panel panel--grey panel--rounded flow">
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
                    class="button--small"
                    :disabled="props.disabled"
                >
                    {{ t('collection.remove') }}
                </button>
            </li>
        </ul>

        <form
            v-if="notSelectedCollections.length > 0"
            @submit.prevent="addCollection"
            class="flow flow--smaller"
            :disabled="props.disabled"
        >
            <label for="collection-select">
                {{ t('collection.add_to_collection') }}
            </label>

            <div class="cols cols--always cols--center cols--gap-smaller">
                <select v-model="newCollectionId" id="collection-select" :disabled="props.disabled">
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

                <div>
                    <button class="button--icon button--small" :disabled="props.disabled">
                        <Icon name="plus" />

                        <span class="sr-only">
                            {{ t('collection.add') }}
                        </span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import api from "../api.js";
import http from "../http.js";
import { store } from "../store.js";

const { t, locale } = useI18n();
locale.value = store.locale;

const props = defineProps({
    link: {
        type: Object,
        required: true,
    },
    disabled: {
        type: Boolean,
    },
});

const emit = defineEmits(["add", "remove"]);

const ready = ref(false);
const collections = ref([]);
const newCollectionId = ref("");

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

function setDefaultSelectedCollectionId() {
    if (notSelectedCollectionsNoGroup.value.length > 0) {
        newCollectionId.value = notSelectedCollectionsNoGroup.value[0].id;
    } else if (notSelectedCollections.value.length > 0) {
        newCollectionId.value = notSelectedCollections.value[0].id;
    }
}

function loadCollections() {
    api.collections().then((userCollections) => {
        userCollections.sort((collection1, collection2) => {
            return collection1.name.localeCompare(collection2.name);
        });

        collections.value = userCollections.map((collection) => {
            return {
                id: collection.id,
                name: collection.name,
                description: collection.description,
                group: collection.group,
                isPublic: collection.is_public,
            };
        });

        setDefaultSelectedCollectionId();

        ready.value = true;
    });
}

function addCollection() {
    const collection = collections.value.find((collection) => {
        return collection.id === newCollectionId.value;
    });

    if (!collection) {
        return;
    }

    emit("add", collection);
}

function removeCollection(collection) {
    emit("remove", collection);
}

watch(
    () => props.link.collections,
    (value) => {
        setDefaultSelectedCollectionId();
    },
);

onMounted(loadCollections);
</script>
