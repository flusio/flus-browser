# Changelog of Flus Browser

## 2025-09-01 - v1.0.0

### New

This version brings a whole new version of Flus Browser, allowing you to:

- mark links as read;
- save them for later;
- add them to collections;
- add notes.

The extension is now translated in both English and French.
It comes with a native dark mode.

Also, self-hosted users can now use the extension as well, without having to recompile the extension.

### Technical

- Remove the `host_permissions` in manifest ([060304f](https://github.com/flusio/flus-browser/commit/060304f))

### Documentation

- Provide a quick start in the README ([0c64c7e](https://github.com/flusio/flus-browser/commit/0c64c7e))
- Adapt the README to the new version ([d6f7d01](https://github.com/flusio/flus-browser/commit/d6f7d01))

### Developers

- Setup Vue.js ([a9f7abc](https://github.com/flusio/flus-browser/commit/a9f7abc))
- Don't optimize SVG images ([334ea95](https://github.com/flusio/flus-browser/commit/334ea95))
- Don't fail on webext lint warnings ([1ea0929](https://github.com/flusio/flus-browser/commit/1ea0929))

## 2025-03-07 - v0.9.0

### Documentation

- Add the entry for Flus 0.8 to the changelog ([771f0dc](https://github.com/flusio/flus-browser/commit/771f0dc))

### Developers

- Migrate to Manifest v3 ([59af69a](https://github.com/flusio/flus-browser/commit/59af69a))
- Add the AGPL license file and a README ([23b9512](https://github.com/flusio/flus-browser/commit/23b9512))
- Build the extension with Parcel ([fa2c668](https://github.com/flusio/flus-browser/commit/fa2c668), [cbee5ec](https://github.com/flusio/flus-browser/commit/cbee5ec))
- Provide a make command to run the extension in browser ([1d15b61](https://github.com/flusio/flus-browser/commit/1d15b61))
- Provide a make command to release a version ([2c9c530](https://github.com/flusio/flus-browser/commit/2c9c530))
- Provide a make command to build the extension ([481d485](https://github.com/flusio/flus-browser/commit/481d485))
- Move the code under the `src/` folder ([eccf248](https://github.com/flusio/flus-browser/commit/eccf248))
- Configure the linters ([98e9724](https://github.com/flusio/flus-browser/commit/98e9724), [d1d1523](https://github.com/flusio/flus-browser/commit/d1d1523), [40f27b9](https://github.com/flusio/flus-browser/commit/40f27b9))
- Provide a pull request template ([761e20e](https://github.com/flusio/flus-browser/commit/761e20e))
- Remove the `content-script.js` file ([bff4087](https://github.com/flusio/flus-browser/commit/bff4087))

## 2021-02-17 - v0.8

### New

- The extension is now available on Firefox and Chrome extension stores

## 2020-11-05 - v0.5

### New

- Remove .no-extension-class elements in flusio

### Improvements

- Show a spinner on link adding

### Misc

- Remove the `update_url` for Chrome
- Prepare extension for web-ext script

## 2020-11-04 - v0.4

### New

- Configure an auto-update server

## 2020-11-03 - v0.3

Just a mistake when publishing the extension. Nothing changed :)

## 2020-11-03 - v0.2

### New

- Add automatically links to bookmarks
- Display if the link is bookmarked
- Provide a navigation menu
- Allow disconnected users to go to login page

### Bug fixes

- Forbid to add non-http URLs

### Misc

- Move app endpoint URL to a configuration file
- Handle the URL state in background

## 2020-07-29 - v0.1

First version, don’t expect much :) It only allows to add links to Flus via a
redirection to the /links/new page.
