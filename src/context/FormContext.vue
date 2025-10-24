<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, watch, type Ref } from 'vue'
import type { LandHoldersInformation } from './LandHoldersInformation'
import type { RegistrarDetails } from './RegistrarDetails'
import type { RuralPropertiesData } from './RuralProperties'
import type { PropertyRights } from './PropertyRights'
import type { FormMapData as MapData } from '@/types/mapSharedTypes'

export type FormData = {
  mapData: MapData
  registrarDetails: RegistrarDetails
  landHoldersInformation: LandHoldersInformation
  ruralProperties: RuralPropertiesData
  propertyRights: PropertyRights
}

export type ValidateRegistrationForm = {
  isMapValid: boolean
  isRegistrarDetailsValid: boolean
  isLandHoldersInformationValid: boolean
  isRuralPropertiesValid: boolean
  isPropertyRightsValid: boolean
}

export type FormContextType = {
  formData: FormData
  representativeStatus: Ref<string>
  validateRegistrationForm: ValidateRegistrationForm
  resetFormData: () => void
}

const initialFormData: FormData = {
  registrarDetails: {
    id: '',
    dateOfBirth: '',
    name: '',
    mothersName: '',
  },
  landHoldersInformation: {
    landHoldersData: [],
  },
  ruralProperties: {
    propertyName: '',
    state: '',
    city: '',
    zipCode: '',
    locationZonenv: 'rural',
    propertyAccessDescription: '',
    mailingAddress: {
      recipientName: '',
      addressStreet: '',
      number: '',
      additionalInformation: '',
      neighborhood: '',
      zipCode: '',
      state: '',
      city: '',
      email: '',
      telephone: '',
    },
  },
  propertyRights: {
    propertyRightsData: [],
  },
  mapData: {} as MapData,
}

const getInitialState = (): FormData => {
  const formData = sessionStorage.getItem('formData')
  return formData
    ? (JSON.parse(formData) as FormData)
    : {
        registrarDetails: {
          id: '',
          dateOfBirth: '',
          name: '',
          mothersName: '',
        },
        landHoldersInformation: {
          landHoldersData: [],
        },
        ruralProperties: {
          propertyName: '',
          state: '',
          city: '',
          zipCode: '',
          locationZonenv: 'rural',
          propertyAccessDescription: '',
          mailingAddress: {
            recipientName: '',
            addressStreet: '',
            number: '',
            additionalInformation: '',
            neighborhood: '',
            zipCode: '',
            state: '',
            city: '',
            email: '',
            telephone: '',
          },
        },
        propertyRights: {
          propertyRightsData: [],
        },
        mapData: {} as MapData,
      }
}

const getInitialFormState = (): ValidateRegistrationForm | null => {
  if (typeof window !== 'undefined') {
    const validateRegistrationForm = sessionStorage.getItem('validateRegistrationForm')
    return validateRegistrationForm ? JSON.parse(validateRegistrationForm) : null
  }
  return null
}

const formData = ref<FormData>(getInitialState())
const representativeStatus = ref<string>('noRep')

const initialValidateRegistrationForm: ValidateRegistrationForm = {
  isMapValid: false,
  isRegistrarDetailsValid: false,
  isLandHoldersInformationValid: false,
  isRuralPropertiesValid: false,
  isPropertyRightsValid: false,
}

const validateRegistrationForm = ref<ValidateRegistrationForm>(
  getInitialFormState() || {
    isMapValid: false,
    isRegistrarDetailsValid: false,
    isLandHoldersInformationValid: false,
    isRuralPropertiesValid: false,
    isPropertyRightsValid: false,
  },
)

const resetFormData = () => {
  Object.assign(formData.value, initialFormData)
  Object.assign(validateRegistrationForm.value, initialValidateRegistrationForm)
}

provide<FormContextType>('formContext', {
  formData: formData.value,
  representativeStatus: representativeStatus,
  validateRegistrationForm: validateRegistrationForm.value,
  resetFormData: resetFormData,
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('formData', JSON.stringify(formData.value))
    sessionStorage.setItem(
      'validateRegistrationForm',
      JSON.stringify(validateRegistrationForm.value),
    )
  }

  window.addEventListener('mapDataSaved', () => {
    const savedFormData = sessionStorage.getItem('formData')
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData)
      if (parsedData.mapData) {
        formData.value.mapData = parsedData.mapData
      }
    }
  })
})

watch(
  [formData, validateRegistrationForm, representativeStatus],
  () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('formData', JSON.stringify(formData.value))
      sessionStorage.setItem(
        'validateRegistrationForm',
        JSON.stringify(validateRegistrationForm.value),
      )
    }
  },
  { deep: true },
)
</script>
