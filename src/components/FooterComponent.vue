<template>
  <div class="flex justify-center items-center mt-4 p-2 w-100">
    <p class="text-white text-center">{{ getLanguage('footer') }} - v{{ version }}</p>
  </div>
</template>

<script setup lang="ts">
import { useLanguageContext } from '@/context/language/useLanguageContext'
import { ref } from 'vue'
const { getLanguage } = useLanguageContext()

const version = ref<string>(__APP_VERSION__)
</script>

<style scoped>
div {
  background-color: #04132a;
}
</style>
