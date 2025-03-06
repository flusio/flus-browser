// This file is part of Flus Browser
// Copyright 2020-2025 Marien Fressinaud
// SPDX-License-Identifier: AGPL-3.0-or-later

function removeNoExtensionElements() {
    let elementsToRemove = document.querySelectorAll('.no-extension');
    for (element of elementsToRemove) {
        element.remove();
    }
}

document.addEventListener('turbolinks:load', removeNoExtensionElements);
removeNoExtensionElements();
