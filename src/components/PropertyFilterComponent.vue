<template>
  <div class="relative">
    <div class="flex items-center gap-4">
      <!-- Filter Chips -->
      <div v-if="Object.keys(appliedFilters).length > 0" class="flex flex-wrap gap-2">
        <div
          v-for="(value, key) in appliedFilters"
          :key="key"
          class="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
        >
          <span class="capitalize">{{ getLanguage(`properties.filter.${key}`) }}:</span>
          <span class="ml-1 font-medium">{{ value }}</span>
          <button
            @click="removeFilter(key as string)"
            class="ml-2 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
      </div>

      <button @click="isModalOpen = true" class="px-3 py-2 mr-3 gap-2 br-button primary">
        <FontAwesomeIcon :icon="faFilter" />
        {{ getLanguage('properties.filter.filter') }}
      </button>
    </div>

    <!-- Modal Backdrop -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="isModalOpen = false"
    ></div>

    <!-- Modal Content -->
    <div
      v-if="isModalOpen"
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg px-2 py-3 z-50 w-96 max-h-[90vh] flex flex-col"
    >
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-semibold p-0">{{ getLanguage('properties.filter.filter') }}</h2>
        <button @click="isModalOpen = false" class="text-gray-500 hover:text-gray-700">
          <!-- &times; -->
          <FontAwesomeIcon :icon="faClose" />
        </button>
      </div>

      <hr />

      <form @submit.prevent="applyFilters" class="space-y-1 mt-2 overflow-y-auto flex-1">
        <div class="p-2">
          <!-- Location Section -->
          <div>
            <div class="flex items-center mb-2">
              <FontAwesomeIcon :icon="faLocationDot" style="color: #42916e" />
              <p class="text-xl text-center">{{ getLanguage('properties.filter.filter') }}</p>
            </div>
            <div class="space-y-4">
              <div>
                <SelectInputComponent
                  id="state"
                  :placeholder="getLanguage('properties.filter.selectState')"
                  :label="getLanguage('properties.filter.stateDistrict')"
                  :items="states"
                  v-model="form.stateDistrict"
                >
                  <template v-slot:icon>
                    <FontAwesomeIcon :icon="faRoute" />
                  </template>
                </SelectInputComponent>
              </div>
              <div>
                <SelectInputComponent
                  id="city"
                  :placeholder="getLanguage('properties.filter.selectCity')"
                  :label="getLanguage('properties.filter.municipality')"
                  :items="cities"
                  v-model="form.municipality"
                >
                  <template v-slot:icon>
                    <FontAwesomeIcon :icon="faCity" />
                  </template>
                </SelectInputComponent>
              </div>
            </div>
          </div>

          <div class="my-2 w-full">
            <hr />
          </div>

          <!-- Details Section -->
          <div>
            <div class="flex items-center mb-2">
              <FontAwesomeIcon :icon="faHomeUser" style="color: #42916e" />
              <p class="text-xl text-center">{{ getLanguage('properties.filter.details') }}</p>
            </div>
            <div class="space-y-4">
              <div>
                <TextInputComponent
                  :label="'Property Name'"
                  id="property-name"
                  v-model="form.propertyName"
                  :placeholder="getLanguage('properties.filter.propertyName')"
                >
                  <template v-slot:icon>
                    <FontAwesomeIcon :icon="faFileLines" />
                  </template>
                </TextInputComponent>
              </div>
              <div>
                <!-- <label class="block text-sm text-gray-700 mb-1">Property Registration Number</label> -->
                <div class="flex gap-2 items-end">
                  <TextInputComponent
                    :label="getLanguage('properties.filter.code')"
                    id="property-number"
                    v-model="currentCode"
                    placeholder="0000000000"
                  >
                    <template v-slot:icon>
                      <FontAwesomeIcon :icon="faHouseChimney" />
                    </template>
                  </TextInputComponent>
                  <button @click="addPropertyNumber" type="button" class="px-4 br-button primary">
                    {{ getLanguage('properties.filter.add') }}
                  </button>
                </div>
                <div v-if="code.length > 0" class="mt-2 space-y-1">
                  <div
                    v-for="(num, index) in code"
                    :key="index"
                    class="flex items-center justify-between bg-gray-50 px-3 py-1 rounded"
                  >
                    <span class="overflow-auto">{{ num }}</span>
                    <button
                      @click="removePropertyNumber(index)"
                      class="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="cleanForm" class="px-4 py-2 br-button secondary">
              {{ getLanguage('properties.filter.clean') }}
            </button>
            <button type="submit" class="px-4 py-2 br-button primary">
              {{ getLanguage('properties.filter.apply') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguageContext } from '@/context/language/useLanguageContext'
import {
  faCity,
  faClose,
  faFileLines,
  faFilter,
  faHomeUser,
  faHouseChimney,
  faLocationDot,
  faRoute,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed, reactive, ref, watch } from 'vue'
import States from '../config/states_municipalities.json'
import SelectInputComponent from './SelectInputComponent.vue'
import TextInputComponent from './TextInputComponent.vue'

const { getLanguage } = useLanguageContext()

interface FilterForm {
  stateDistrict: string
  municipality: string
  propertyName: string
  ownersName: string
  ownersIdentifier: string
}

interface AppliedFilters {
  [key: string]: string | string[]
}

const emit = defineEmits<{
  updateFilters: [queryParams: any]
}>()

const isModalOpen = ref(false)
const currentCode = ref('')
const code = ref<string[]>([])
const appliedFilters = ref<AppliedFilters>({})

const form = reactive<FilterForm>({
  stateDistrict: '',
  municipality: '',
  propertyName: '',
  ownersName: '',
  ownersIdentifier: '',
})

const states = ref(States)
const selectedState = computed(() => form.stateDistrict)
const cities = computed(() => {
  for (const state of states.value) {
    if (state.value == selectedState.value) {
      return state.cities
    }
  }
  return []
})
watch(
  selectedState,
  () => {
    form.municipality = ''
  },
  { deep: true },
)

const addPropertyNumber = () => {
  if (currentCode.value.trim()) {
    code.value.push(currentCode.value)
    currentCode.value = ''
  }
}

const removePropertyNumber = (index: number) => {
  code.value.splice(index, 1)
}

const cleanForm = () => {
  form.stateDistrict = ''
  form.municipality = ''
  form.propertyName = ''
  form.ownersName = ''
  form.ownersIdentifier = ''
  code.value = []
  currentCode.value = ''
}

const applyFilters = () => {
  const payload = {
    searchParams: {
      stateDistrict: form.stateDistrict,
      municipality: form.municipality,
      propertyName: form.propertyName,
      ownersName: form.ownersName,
      ownersIdentifier: form.ownersIdentifier,
      code: code.value.join(','),
    },
  }

  emit('updateFilters', payload.searchParams)

  appliedFilters.value = {
    // state: form.state,
    ...(form.stateDistrict && { stateDistrict: form.stateDistrict }),
    ...(form.municipality && { municipality: form.municipality }),
    ...(form.propertyName && { propertyName: form.propertyName }),
    ...(code.value.length > 0 && { code: code.value }),
    ...(form.ownersName && { ownersName: form.ownersName }),
    ...(form.ownersIdentifier && { ownersIdentifier: form.ownersIdentifier }),
  }

  isModalOpen.value = false
}

const removeFilter = (key: string) => {
  switch (key) {
    case 'stateDistrict':
      form.stateDistrict = ''
      break
    case 'municipality':
      form.municipality = ''
      break
    case 'propertyName':
      form.propertyName = ''
      break
    case 'code':
      code.value = []
      break
    case 'ownersName':
      form.ownersName = ''
      break
    case 'ownersIdentifier':
      form.ownersIdentifier = ''
      break
  }

  applyFilters()
}
</script>
