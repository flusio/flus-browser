# Changelog of Flus Browser

## 2025-11-26 - v1.1.0

### Features

- Add Web feeds support to the extension
    - Allow to follow the feeds of the current page ([ec7912b](https://github.com/flusio/flus-browser/commit/ec7912b))
    - Allow to search for feeds by URL ([4789aab](https://github.com/flusio/flus-browser/commit/4789aab))
    - Allow to test common feeds URLs patterns ([d6db32e](https://github.com/flusio/flus-browser/commit/d6db32e))
- Allow to refresh extension if the tab URL changed ([1df5413](https://github.com/flusio/flus-browser/commit/1df5413))
- Allow to create collections ([435252a](https://github.com/flusio/flus-browser/commit/435252a))
- Allow to open shortcuts edition page ([da69d0f](https://github.com/flusio/flus-browser/commit/da69d0f))

### Bug fixes

- Fix opening registration url on Chrome ([9cf8c97](https://github.com/flusio/flus-browser/commit/9cf8c97))
- Disable note textarea during submission ([e47e139](https://github.com/flusio/flus-browser/commit/e47e139))

### Maintenance

- Delete session on logout ([22de5a1](https://github.com/flusio/flus-browser/commit/22de5a1))
- Update the Manifest description ([f16e6f7](https://github.com/flusio/flus-browser/commit/f16e6f7))
- Update the dependencies ([9732245](https://github.com/flusio/flus-browser/commit/9732245), [a631328](https://github.com/flusio/flus-browser/commit/a631328), [bb8f636](https://github.com/flusio/flus-browser/commit/bb8f636), [c8f7068](https://github.com/flusio/flus-browser/commit/c8f7068))

### Developers

- Execute "make run" with a profile ([bea1686](https://github.com/flusio/flus-browser/commit/bea1686))
- Fix "make run" for Android ([00437fc](https://github.com/flusio/flus-browser/commit/00437fc))
- Improve code to disable forms elements ([44501e4](https://github.com/flusio/flus-browser/commit/44501e4))
- Refactor the link model ([3bb55b9](https://github.com/flusio/flus-browser/commit/3bb55b9))
- Rename CollectionsSelector component into Collections ([2f3e5a0](https://github.com/flusio/flus-browser/commit/2f3e5a0))

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
