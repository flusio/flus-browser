// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

import sanitizeHtml from "sanitize-html";

// These are the same tags that are allowed server-side.
// See https://github.com/flusio/Flus/blob/main/src/utils/MiniMarkdown.php
const allowedNoteTags = [
    "a",
    "blockquote",
    "br",
    "code",
    "del",
    "em",
    "li",
    "ol",
    "p",
    "pre",
    "strong",
    "ul",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
];

export default class {
    id = "";
    title = "";
    url = "";
    readingTime = 0;
    collections = [];
    tags = [];
    isRead = false;
    isReadLater = false;
    notes = [];

    init(fetchedLink) {
        this.id = fetchedLink.id;
        this.title = fetchedLink.title;
        this.url = fetchedLink.url;
        this.readingTime = fetchedLink.reading_time;
        this.collections = fetchedLink.collections;
        this.tags = Object.values(fetchedLink.tags);
        this.isRead = fetchedLink.is_read;
        this.isReadLater = fetchedLink.is_read_later;
        this.notes = [];
    }

    host() {
        const parsedUrl = new URL(this.url);

        if (parsedUrl.host.startsWith("www.")) {
            return parsedUrl.host.slice(4);
        }

        return parsedUrl.host;
    }

    readingTimeLabel() {
        if (this.readingTime < 1) {
            return "< 1 min";
        }

        return `${this.readingTime} min`;
    }

    markAsRead() {
        this.isRead = true;
        this.isReadLater = false;
    }

    markAsReadLater() {
        this.isReadLater = true;
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags = [...this.tags, tag];
        }
    }

    addCollection(collection) {
        this.collections = [...this.collections, collection.id];
    }

    removeCollection(collection) {
        this.collections = this.collections.filter((collectionId) => {
            return collectionId !== collection.id;
        });
    }

    addNote(note) {
        this.notes = [
            ...this.notes,
            {
                id: note.id,
                createdAt: new Date(note.created_at),
                htmlContent: sanitizeHtml(note.html_content, {
                    allowedTags: allowedNoteTags,
                    allowedSchemes: ["http", "https"],
                    allowProtocolRelative: false,
                }),
            },
        ];

        for (const tag of note.tags) {
            this.addTag(tag);
        }
    }
}
