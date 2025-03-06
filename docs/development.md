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
