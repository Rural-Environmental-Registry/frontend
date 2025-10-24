<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { provide, onMounted, watch, type Ref, ref } from 'vue'
import languages from '@/config/languages.json'

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

const defaultLanguage = languages.defaultlanguage

const language = ref(localStorage.getItem('language') || defaultLanguage)

const setLanguage = (newLang: string) => {
  language.value = newLang
}

const getLanguage = (key: string): string => {
  const keys = key.split('.')
  let result: any = typedLanguages[language.value]

  keys.forEach((k) => {
    if (result && result[k]) {
      result = result[k]
    } else {
      result = key
    }
  })

  return result
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
  localStorage.setItem('language', language.value)
})
</script>
