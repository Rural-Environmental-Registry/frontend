<script setup lang="ts">
import { useLanguageContext } from '@/context/language/useLanguageContext'
import type { PropertyRightsData } from '@/context/PropertyRights'
import { faMap, faPenToSquare, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'
import { ref } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const editingIndex = ref<number | null>(null)

const { getLanguage } = useLanguageContext()

const { propertyRightsData } = defineProps({
  propertyRightsData: {
    type: Array as PropType<PropertyRightsData[]>,
    required: true,
  },
})

const emit = defineEmits<{
  removePropertyInformation: [index: number]
  editPropertyInformation: [data: PropertyRightsData, index: number]
  clearEditing: []
}>()

const editProperty = (data: PropertyRightsData, index: number) => {
  if (editingIndex.value === index) {
    editingIndex.value = null
    emit('clearEditing')
  } else {
    editingIndex.value = index
    emit('editPropertyInformation', data, index)
  }
}

const clearEditing = () => {
  editingIndex.value = null
}

defineExpose({
  clearEditing,
})

const cityState = (el: any) => {
  const city = el?.cityOfTheNotaryOffice
    ? el.cityOfTheNotaryOffice
        .split('_')
        .map((word) => (word ? word[0].toUpperCase() + word.substring(1) : ''))
        .join(' ')
    : ''

  const state = el?.stateOfTheNotaryOffice || ''

  return [city, state].filter(Boolean).join('-')
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th class="font-bold">{{ getLanguage('register.propertyRights.list.type.title') }}</th>
        <th class="font-bold">{{ getLanguage('register.propertyRights.form.documentType') }}</th>
        <th class="font-bold">
          {{ getLanguage('register.propertyRights.list.titleDeedOrLandDocument') }}
        </th>
        <th class="font-bold">{{ getLanguage('register.propertyRights.list.propertyName') }}</th>
        <th class="font-bold">
          {{ getLanguage('register.propertyRights.list.stateAndCityOfTheNotaryOffice') }}
        </th>
        <th class="font-bold">{{ getLanguage('register.propertyRights.form.area') + '(ha)' }}</th>
        <th class="font-bold">{{ getLanguage('register.propertyRights.list.actions') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        :class="editingIndex === ix ? 'bg-[#EEF6FD]' : ''"
        v-for="(el, ix) in propertyRightsData"
        :key="ix"
      >
        <td>{{ getLanguage(`register.propertyRights.list.type.${el.propertyLandholding}`) }}</td>
        <td>
          {{
            el.documentType
              ? getLanguage(
                  `register.propertyRights.form.documentTypeOptions.${String(el.documentType).toLowerCase()}`,
                )
              : ''
          }}
        </td>
        <td>{{ el.titleDeedLandDocument }}</td>
        <td>{{ el.registeredPropertyName }}</td>
        <td>{{ cityState(el) }}</td>
        <td>{{ el.area + ' ha' }}</td>
        <td>
          <div class="space-x-2">
            <FontAwesomeIcon
              :icon="faMap"
              :style="{ color: '#42916e' }"
              @click="router.push('/register/property_map')"
              class="cursor-pointer"
            />
            <button @click="editProperty(el, ix)">
              <FontAwesomeIcon
                :icon="editingIndex === ix ? faTimes : faPenToSquare"
                :style="{ color: '#42916e' }"
                class="cursor-pointer"
              />
            </button>
            <button @click="emit('removePropertyInformation', ix)">
              <FontAwesomeIcon
                :icon="faTrash"
                :style="{ color: '#42916e' }"
                class="cursor-pointer"
              />
            </button>
          </div>
        </td>
      </tr>

      <tr v-if="propertyRightsData.length == 0">
        <td colspan="7">{{ getLanguage('register.propertyRights.list.noDataToShow') }}</td>
      </tr>
    </tbody>
  </table>
</template>
