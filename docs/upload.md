# Upload a new version

Build the extension with:

```console
$ make build
```

It builds the assets under the `dist/assets` folder, and builds a ZIP archive under `dist/artifacts/`.

## Upload to the Firefox Add-ons store

Go to [addons.mozilla.org/developers](https://addons.mozilla.org/fr/developers/) and login.

Click on "Edit Product Page" under the "Flus" extension.

Verify that the information on that page are correct.

Then, click on "Upload New Version" and upload the ZIP archive.

## Upload to the Chrome Web Store

Go to [chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole/) and login.

Click on the "Flus" extension and check that the information on that page are correct.

Then, click on "Package", "Import a new package" and upload the ZIP archive.
