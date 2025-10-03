<h1 align="center">Flus Browser</h1>

<p align="center">
    <strong>Collect, organise, comment on and share links from around the Web.</strong>
</p>

---

Flus brings together news feed aggregation and social bookmarking in a modern way.
It is designed as a simple, yet complete tool for organising the links you gather around the Web.

This repository contains the code of the browser extension.
The extension is the perfect companion for the web application as it allows you to easily mark links as read, save them for later, or add them to collections, as well as add notes.
It is also able to let you follow Web feeds.

For the code of the Web application, see [flusio/Flus](https://github.com/flusio/Flus).

Flus Browser is licensed under [GNU Affero General Public License v3.0 or later](/LICENSE.txt).

![Screenshot of the opened extension.](/docs/screenshot.webp)

## Quick start

Make sure to have the `npm` command available:

```console
$ npm --version
10.9.2
```

Install the dependencies:

```console
$ make install
```

Build the extension with:

```console
$ make build
```

It builds the assets under the `dist/assets` folder, and builds a ZIP archive under `dist/artifacts/`.

## Documentation

Dedicated to the developers:

- [Setup the development environment](/docs/development.md)

Dedicated to the maintainers:

- [How to release a version](/docs/release.md)
- [Upload a new version](/docs/upload.md)
