// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class {
    id = "";
    name = "";
    description = "";
    group = "";
    isPublic = false;

    init(fetchedCollection) {
        this.id = fetchedCollection.id;
        this.name = fetchedCollection.name;
        this.description = fetchedCollection.description;
        this.group = fetchedCollection.group;
        this.isPublic = fetchedCollection.is_public;
    }
}
