# Setup the development environment

Make sure to have the `npm` command available:

```console
$ npm --version
10.9.2
```

Install the dependencies:

```console
$ make install
```

Build the assets with the Parcel watcher:

```console
$ make watch
```

Run the extension in Firefox:

```console
$ make run
```

Or in Chromium:

```console
$ make run BROWSER=chromium
```

## Linters

Run the linters with:

```console
$ make lint
```

You can run a specific linter with:

```console
$ make lint LINTER=biome
$ make lint LINTER=webext
```

Note that the webext linter runs over the `dist/assets` files and not the files under `src/`.
This is to check that the final assets don't present any problems.
