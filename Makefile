# This file is part of Flus Browser
# Copyright 2020-2025 Marien Fressinaud
# SPDX-License-Identifier: AGPL-3.0-or-later

.DEFAULT_GOAL := help

.PHONY: install
install: ## Install the dependencies
	npm install

.PHONY: run
run: BROWSER ?= firefox
run: ## Run the extension in a browser (can take a BROWSER argument)
ifeq ($(BROWSER),chromium)
	npm run start -- --target chromium
else
	npm run start -- --target firefox-desktop
endif

.PHONY: lint
lint: LINTER ?= all
lint: ## Execute the linters (can take a LINTER argument)
ifeq ($(LINTER), $(filter $(LINTER), all webext))
	npm run lint
endif

.PHONY: release
release: ## Release a new version (take a VERSION argument)
ifndef VERSION
	$(error You need to provide a "VERSION" argument)
endif
	sed -i 's/"version": ".*"/"version": "$(VERSION)"/' manifest.json
	$(EDITOR) CHANGELOG.md
	git add .
	git commit -m "release: Publish version v$(VERSION)"
	git tag -a v$(VERSION) -m "Release version v$(VERSION)"

.PHONY: help
help:
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
