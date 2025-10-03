// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

export default class {
    id = "";
    name = "";
    url = "";
    isFollowed = false;

    init(fetchedFeed) {
        this.id = fetchedFeed.id;
        this.name = fetchedFeed.name;
        this.url = fetchedFeed.url;
        this.isFollowed = fetchedFeed.is_followed;
    }

    follow() {
        this.isFollowed = true;
    }

    unfollow() {
        this.isFollowed = false;
    }
}
