<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { provide, onMounted, watch, type Ref, ref } from 'vue'
import languages from '@/config/languages.json'
import { DEFAULT_LANGUAGE, normalizeLanguage } from '@/utils/language'

type LanguagesType = {
  defaultlanguage: string
  [key: string]: any
}
const typedLanguages: LanguagesType = languages

export type LanguageContextType = {
  language: Ref<string>
  setLanguage: (newLang: string) => void
  getLanguage: (key: string) => string
}

const language = ref(normalizeLanguage(localStorage.getItem('language')))

const setLanguage = (newLang: string) => {
  language.value = normalizeLanguage(newLang)
}

const getLanguage = (key: string): string => {
  const keys = key.split('.')
  let result: unknown = typedLanguages[normalizeLanguage(language.value)]

  for (const k of keys) {
    if (result == null || typeof result !== 'object' || !(k in result)) {
      return key
    }
    result = (result as Record<string, unknown>)[k]
  }

  return typeof result === 'string' ? result : key
}

provide<LanguageContextType>('languageContext', {
  language,
  setLanguage,
  getLanguage,
})

watch(
  () => language.value,
  (newLang) => {
    localStorage.setItem('language', newLang)
  },
)

onMounted(() => {
  const normalized = normalizeLanguage(language.value)
  if (normalized !== language.value) {
    language.value = normalized
  }
  localStorage.setItem('language', language.value)
})
</script>
