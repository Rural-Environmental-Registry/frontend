<script setup lang="ts">
import { faDownload, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { useLanguageContext } from '@/context/language/useLanguageContext'
import type { Property } from '@/interfaces/Property'

import { useRouter } from 'vue-router'

import axios from '@/services/axios'
import { onMounted, ref } from 'vue'
import { fetchReceipt } from '@/services/propertiesService'

const { getLanguage } = useLanguageContext()
const router = useRouter()

const { code, id, imageUrl, municipality, propertyName, stateDistrict } = defineProps<Property>()

const isDownloading = ref(false)

const placeholderImage = `${import.meta.env.VITE_BASE_URL}/images/map_property_example.png`

const image = ref()

const handleRegistrationButton = async (event: Event) => {
  event.preventDefault()
  isDownloading.value = true
  try {
    await fetchReceipt(id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  } catch (error) {
    throw error
  } finally {
    isDownloading.value = false
  }
}

onMounted(async () => {
  const urlCreator = window.URL || window.webkitURL
  const blob = await axios.fetchImage(imageUrl!)
  image.value = urlCreator.createObjectURL(blob)
})
</script>

<template>
  <div class="br-card rounded max-w-[380px] h-[400px]">
    <div class="ml-0 mt-0 w-full bg-[#BAF2DD]">
      <h1 class="text-lg font-bold p-3 truncate">{{ propertyName }}</h1>
    </div>
    <div class="mx-3 mt-2">
      <strong class="text-[17px]">{{ getLanguage('properties.propertyCard.code') }}:</strong>
      <p class="break-all">{{ code }}</p>
      <!-- <img src="/images/map_property_example.png" alt="Map example" width="380" height="230" /> -->
      <div class="h-[140px] flex">
        <img
          :src="image || placeholderImage"
          alt="Property Map"
          loading="lazy"
          class="pt-2 w-full object-contain"
        />
      </div>
      <p class="">
        <strong>{{ getLanguage('properties.propertyCard.state') }}: </strong>{{ stateDistrict }}
      </p>
      <p>
        <strong>{{ getLanguage('properties.propertyCard.city') }}: </strong>{{ municipality }}
      </p>
      <hr class="mt-2 border-t-2 border-gray-300" />
      <div class="flex items-center justify-center pt-3">
        <button
          @click="router.push(`/properties/details/${id}`)"
          class="flex items-center primary-color"
        >
          <FontAwesomeIcon :icon="faEye" :style="{ marginRight: '0.5rem' }" />
          <p class="font-bold primary-color">
            {{ getLanguage('properties.propertyCard.details') }}
          </p>
        </button>
        <div class="w-0.5 h-6 mx-5 bg-gray-300"></div>
        <button class="flex items-center primary-color" @click="handleRegistrationButton">
          <template v-if="isDownloading">
            <svg
              class="animate-spin h-5 w-5 text-green-600 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </template>
          <template v-else>
            <FontAwesomeIcon
              :icon="faDownload"
              :style="{ color: '#42916e', marginRight: '0.5rem' }"
            />
          </template>
          <p class="font-bold primary-color">
            {{ getLanguage('properties.propertyCard.registration') }}
          </p>
        </button>
      </div>
    </div>
  </div>
</template>
