// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import { reactive, computed } from "vue";

export const link = reactive({
    id: "",
    title: "",
    url: "",
    readingTime: 0,
    collections: [],
    tags: [],
    isRead: false,
    isReadLater: false,

    init(fetchedLink) {
        this.id = fetchedLink.id;
        this.title = fetchedLink.title;
        this.url = fetchedLink.url;
        this.readingTime = fetchedLink.reading_time;
        this.collections = fetchedLink.collections;
        this.tags = Object.values(fetchedLink.tags);
        this.isRead = fetchedLink.is_read;
        this.isReadLater = fetchedLink.is_read_later;
    },

    markAsRead() {
        this.isRead = true;
        this.isReadLater = false;
    },

    markAsReadLater() {
        this.isReadLater = true;
    },

    addCollection(collection) {
        this.collections = [...this.collections, collection.id];
    },

    removeCollection(collection) {
        this.collections = this.collections.filter((collectionId) => {
            return collectionId !== collection.id;
        });
    },
});

export const host = computed(() => {
    const parsedUrl = new URL(link.url);

    if (parsedUrl.host.startsWith("www.")) {
        return parsedUrl.host.slice(4);
    }

    return parsedUrl.host;
});

export const readingTime = computed(() => {
    if (link.readingTime < 1) {
        return "< 1 min";
    }

    return `${link.readingTime} min`;
});
