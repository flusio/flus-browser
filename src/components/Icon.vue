<!-- This file is part of Flus Browser
  -- SPDX-License-Identifier: AGPL-3.0-or-later
  -->

<template>
    <svg :class="['icon', 'icon--' + name]" aria-hidden="true" width="36" height="36">
        <use :xlink:href="iconHref"></use>
    </svg>
</template>

<script setup>
import icons from "url:npm:@flus/design/dist/icons.svg";

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});

const iconHref = `${icons}#${props.name}`;
</script>
