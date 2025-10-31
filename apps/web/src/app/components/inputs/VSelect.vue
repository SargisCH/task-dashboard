<template>
    <q-select
        :name="props.name"
        v-model="value"
        :error-message="!!fieldError ? fieldError : props.errorMessage"
        :error="!!fieldError || props.error"
        hide-bottom-space
    >
        <template v-slot:prepend v-if="$slots.prepend">
            <slot name="prepend"></slot>
        </template>
        <template v-slot:append v-if="$slots.append">
            <slot name="append"></slot>
        </template>
        <template v-slot:option="scope" v-if="$slots.option">
            <slot name="option" v-bind="scope"></slot>
        </template>
    </q-select>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

interface Props {
    name: string;
    errorMessage?: string;
    error?: boolean;
    untranslatable?: boolean;
}

const props = defineProps<Props>();

const { errorMessage, value } = useField<string>(props.name);

const fieldError = computed<string | undefined>(() => {
    const error: any = errorMessage.value;

    return error;
});
</script>
