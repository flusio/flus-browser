// This file is part of Flus Browser
// SPDX-License-Identifier: AGPL-3.0-or-later

const mediaQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

function handleColorSchemeChange(event) {
    const colorScheme = event.matches ? "dark" : "light";
    document.documentElement.dataset.colorScheme = colorScheme;
}

export function applyTheme(theme) {
    let colorScheme = theme;

    if (mediaQuery) {
        mediaQuery.removeEventListener("change", handleColorSchemeChange);

        if (theme === "auto") {
            if (mediaQuery.matches) {
                colorScheme = "dark";
            } else {
                colorScheme = "light";
            }

            mediaQuery.addEventListener("change", handleColorSchemeChange);
        }
    } else if (theme === "auto") {
        colorScheme = "light";
    }

    document.documentElement.dataset.colorScheme = colorScheme;
}
