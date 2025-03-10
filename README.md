<h1 align="center">Flus Browser</h1>

<p align="center">
    <strong>Collect, organise, comment on and share links from around the Web.</strong>
</p>

---

Flus brings together news feed aggregation and social bookmarking in a modern way.
It is designed as a simple, yet complete tool for organising the links you gather around the Web.

This repository contains the code of the browser extension.
For now, it allows you to easily add any website URL to your bookmarks.

**Note that it only works for the [flus.fr](https://flus.fr) service at the moment.**
If you want to use it with your self-hosted service, you’ll have to change the URL in the file [`src/configuration.js`](/src/configuration.js) and package the extension yourself.

For the code of the Web application, see [flusio/Flus](https://github.com/flusio/Flus).

Flus Browser is licensed under [GNU Affero General Public License v3.0 or later](/LICENSE.txt).

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
