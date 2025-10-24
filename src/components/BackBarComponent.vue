<script setup lang="ts">
import { useLanguageContext } from '@/context/language/useLanguageContext'
import { useFormContext } from '@/context/useFormContext'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const { getLanguage } = useLanguageContext()
const { resetFormData } = useFormContext()
const propertyEditing = computed(() => {
  if (localStorage.getItem('EditingRegistry')) {
    return JSON.parse(localStorage.getItem('EditingRegistry')!)
  } else {
    return {}
  }
})
const isEditingProperty = computed(() => Object.keys(propertyEditing.value).length > 0)
const propertyEditingName = computed(() => {
  return String(propertyEditing.value['name']).toUpperCase() || ''
})

const handleCancelEditing = () => {
  localStorage.removeItem('EditingRegistry')
  resetFormData()
  sessionStorage.removeItem('mapCaptured')
  sessionStorage.removeItem('mapState')
  window.location.href = router.resolve({ name: 'properties' }).href
}

const getBackBarText = computed(() => {
  if (route.path.includes('/register')) {
    return isEditingProperty.value
      ? getLanguage('register.route-editing')
      : getLanguage('register.route')
  }
  if (route.path.includes('properties/details/')) {
    return getLanguage('details.route')
  }

  switch (route.path) {
    case '/properties':
      return getLanguage('properties.route')
    case '/profile':
      return 'Profile'
    default:
      return ''
  }
})

const goBack = () => {
  if (route.path.includes('/properties/details/')) {
    router.push({ name: 'properties' })
  } else {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <div v-if="getBackBarText" class="ml-4 mr-3 mt-5">
    <div class="flex w-full">
      <div class="flex-1">
        <button @click="goBack">
          <FontAwesomeIcon :icon="faArrowLeft" class="primary-color" />
        </button>
        <span class="ml-4 text-3xl justify-self-start">{{ getBackBarText }}</span>
        <span
          v-if="isEditingProperty && getBackBarText.includes(getLanguage('register.route-editing'))"
          class="text-2xl justify-self-start"
          >: {{ propertyEditingName }}</span
        >
      </div>
      <div
        v-if="isEditingProperty && getBackBarText.includes(getLanguage('register.route-editing'))"
      >
        <button class="br-button secondary" @click.prevent="handleCancelEditing">
          {{ getLanguage('register.route-editing-cancel-button') }}
        </button>
      </div>
    </div>
    <hr class="mt-3 mb-2 border" />
  </div>
</template>
