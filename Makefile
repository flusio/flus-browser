# This file is part of Flus Browser
# Copyright 2020-2025 Marien Fressinaud
# SPDX-License-Identifier: AGPL-3.0-or-later

.DEFAULT_GOAL := help

.PHONY: install
install: ## Install the dependencies
	npm install

.PHONY: watch
watch: ## Watch and build the assets
	rm -rf dist/dev_assets
	npm run start:watcher

.PHONY: run
run: BROWSER ?= firefox
run: ## Run the extension in a browser (can take a BROWSER argument)
ifeq ($(BROWSER), $(filter $(BROWSER), firefox))
	npm run start:browser -- \
		--target firefox-desktop \
		--firefox-profile ./profile-firefox \
		--profile-create-if-missing \
		--keep-profile-changes \
		--url=https://flus.fr
else ifeq ($(BROWSER), $(filter $(BROWSER), chromium))
	npm run start:browser -- \
		--target chromium \
		--chromium-profile ./profile-chromium \
		--profile-create-if-missing \
		--keep-profile-changes \
		--url=https://flus.fr
else
	npm run start:browser -- --target firefox-android --android-device $(BROWSER)
endif

.PHONY: build
build: ## Build the web extension
	rm -rf dist/assets
	npm run build:assets
	npm run build:artifact

.PHONY: lint
lint: LINTER ?= all
lint: ## Execute the linters (can take a LINTER argument)
ifeq ($(LINTER), $(filter $(LINTER), all biome))
	npm run lint:biome
endif
ifeq ($(LINTER), $(filter $(LINTER), all webext))
	rm -rf dist/assets
	npm run build:assets
	npm run lint:webext
endif

.PHONY: release
release: ## Release a new version (take a VERSION argument)
ifndef VERSION
	$(error You need to provide a "VERSION" argument)
endif
	sed -i 's/"version": ".*"/"version": "$(VERSION)"/' src/manifest.json
	$(EDITOR) CHANGELOG.md
	git add .
	git commit -m "release: Publish version v$(VERSION)"
	git tag -a v$(VERSION) -m "Release version v$(VERSION)"

.PHONY: help
help:
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
