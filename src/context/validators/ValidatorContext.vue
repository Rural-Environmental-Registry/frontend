<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { useFormContext } from '@/context/useFormContext'
import useVuelidate, { type Validation } from '@vuelidate/core'
import { helpers, required, requiredIf } from '@vuelidate/validators'
import { onBeforeMount, provide, reactive, ref, type Ref } from 'vue'
import type { LandHoldersData } from '../LandHoldersInformation'
import type { PropertyRightsData } from '../PropertyRights'

export type ValidatorContextType = {
  validation: Ref<Validation>
  isRepresentativeRegistrarRequired: Ref<boolean>
  newLandHoldersInformation: Ref<LandHoldersData>
  newPropertyRightsInformation: Ref<PropertyRightsData>
}

const { formData } = useFormContext()

const initialLandHoldersData: LandHoldersData = {
  legalPersonality: 'natural_person',
  wayToAddLandholdersInformation: 'fill',
  id: '',
  dateOfBirth: '',
  name: '',
  mothersName: '',
}

const initialPropertyRightsData: PropertyRightsData = {
  propertyLandholding: 'property',
  registeredPropertyName: '',
  area: '',
  documentType: '',
  titleDeedLandDocument: '',
  documentDate: '',
  book: '',
  page: '',
  stateOfTheNotaryOffice: '',
  cityOfTheNotaryOffice: '',
  // nationalRuralLandRegistrySystemCode: "",
  propertyCertification: '',
  nationalRuralPropertyRegistrationNumber: '',
  // legalReserve: false,
}

const isRepresentativeRegistrarRequired = ref<boolean>(false)
const newLandHoldersInformation = ref<LandHoldersData>({} as LandHoldersData)
const newPropertyRightsInformation = ref<PropertyRightsData>({} as PropertyRightsData)

const dateValidator = helpers.regex(
  /^(19|20)\d\d[-](0[1-9]|1[0-2])[-](0[1-9]|1[0-9]|2[0-9]|3[01])$/i,
)
const checkDateLessThanToday = (valueToBeValidated: string) =>
  !valueToBeValidated || new Date(valueToBeValidated) <= new Date()

const registrarDetailsValidationSchema = {
  id: { required, $autoDirty: true },
  dateOfBirth: { required, $autoDirty: true, date: dateValidator, max: checkDateLessThanToday },
  name: { required, $autoDirty: true },
  mothersName: { required, $autoDirty: true },
  representative: {
    id: { required: requiredIf(() => isRepresentativeRegistrarRequired.value) },
    dateOfBirth: {
      required: requiredIf(() => isRepresentativeRegistrarRequired.value),
      date: dateValidator,
      max: checkDateLessThanToday,
    },
    name: { required: requiredIf(() => isRepresentativeRegistrarRequired.value) },
    mothersName: { required: requiredIf(() => isRepresentativeRegistrarRequired.value) },
  },
}

const landHoldersInformationValidationSchema = {
  legalPersonality: { required, $autoDirty: true },
  wayToAddLandholdersInformation: { required, $autoDirty: true },
  id: {},
  dateOfBirth: { required, $autoDirty: true, date: dateValidator, max: checkDateLessThanToday },
  name: { required, $autoDirty: true },
  mothersName: { required, $autoDirty: true },
}

const ruralPropertiesValidationSchema = {
  propertyName: { required, $autoDirty: true },
  state: { required, $autoDirty: true },
  city: { required, $autoDirty: true },
  zipCode: { required, $autoDirty: true },
  locationZonenv: {},
  propertyAccessDescription: {},
  mailingAddress: {
    recipientName: { required, $autoDirty: true },
    addressStreet: { required, $autoDirty: true },
    number: { required, $autoDirty: true },
    additionalInformation: {},
    neighborhood: { required, $autoDirty: true },
    zipCode: { required, $autoDirty: true },
    state: { required, $autoDirty: true },
    city: { required, $autoDirty: true },
    email: {},
    telephone: {},
  },
}

const propertyRightsValidationSchema = {
  propertyLandholding: { required, $autoDirty: true },
  registeredPropertyName: { required,$autoDirty: true },
  area: { required, $autoDirty: true },
  documentType: { $autoDirty: true },
  titleDeedLandDocument: { $autoDirty: true },
  documentDate: { $autoDirty: true, date: dateValidator, max: checkDateLessThanToday },
  book: { $autoDirty: true },
  page: { $autoDirty: true },
  stateOfTheNotaryOffice: { $autoDirty: true },
  cityOfTheNotaryOffice: { $autoDirty: true },
  // nationalRuralLandRegistrySystemCode: { required, $autoDirty: true, },
  propertyCertification: { $autoDirty: true },
  nationalRuralPropertyRegistrationNumber: { $autoDirty: true },
  // legalReserve: { required, $autoDirty: true, },
}

const validationSchema = reactive({
  registrarDetails: registrarDetailsValidationSchema,
  landHoldersInformation: landHoldersInformationValidationSchema,
  ruralProperties: ruralPropertiesValidationSchema,
  propertyRights: propertyRightsValidationSchema,
})

const validation = useVuelidate(validationSchema, {
  registrarDetails: formData.registrarDetails,
  landHoldersInformation: newLandHoldersInformation,
  ruralProperties: formData.ruralProperties,
  propertyRights: newPropertyRightsInformation,
})

provide<ValidatorContextType>('validatorContext', {
  validation,
  isRepresentativeRegistrarRequired: isRepresentativeRegistrarRequired,
  newLandHoldersInformation: newLandHoldersInformation,
  newPropertyRightsInformation: newPropertyRightsInformation,
})

onBeforeMount(() => {
  newLandHoldersInformation.value = initialLandHoldersData
  newPropertyRightsInformation.value = initialPropertyRightsData
})
</script>
