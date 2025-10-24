<script setup lang="ts">
import RadioButtonGroupComponent from '@/components/RadioButtonGroupComponent.vue'
import SelectInputComponent from '@/components/SelectInputComponent.vue'
import TextInputComponent from '@/components/TextInputComponent.vue'
import WholeWidthCardComponent from '@/components/WholeWidthCardComponent.vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import States from '../../config/states_municipalities.json'

import CalendarComponent from '@/components/CalendarComponent.vue'
import LandDocumentsTableComponent from '@/components/LandDocumentsTableComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import { useLanguageContext } from '@/context/language/useLanguageContext'
import type { PropertyRightsData } from '@/context/PropertyRights'
import { useFormContext } from '@/context/useFormContext'
import { useValidatorContext } from '@/context/validators/useValidatorContext'
import router from '@/router'
import axios from '@/services/axios'
import { buildFormData } from '@/services/propertiesService'
import { fetchReceipt } from '@/services/propertiesService'

import DiffAreaConfig from '@/config/diff_area.json'
import type { AxiosResponse } from 'axios'
import { ValidationHelper } from '@/utils/validationHelper'

const { validation, newPropertyRightsInformation } = useValidatorContext()
const { formData, validateRegistrationForm, resetFormData } = useFormContext()

const { getLanguage } = useLanguageContext()

const warningOptions = {
  invalidForm: getLanguage('register.propertyRights.invalidForm'),
  requestError: getLanguage('register.propertyRights.requestError'),
  previousStepsBlankFields: getLanguage('register.propertyRights.previousStepsBlankFields'),
  noMapData: getLanguage('register.propertyRights.noMapData'),
  serverError: getLanguage('register.propertyRights.serverError'),
  connectionError: getLanguage('register.propertyRights.connectionError'),
}
const warningText = ref('')

const isConfirmModalOpen = ref(false)
const isWarningModalOpen = ref(false)
const isWarningEditModalOpen = ref(false)
const isDiffAreaOverLimitModalOpen = ref(false)
const isSuccessModalOpen = ref(false)
const isDeletePropertyInformationModalOpen = ref(false)
const isSavingDataModalOpen = ref(false)

const propertyInformationToRemove = ref<number | null>(null)
const selectedIndex = ref<number | null>(null)
const scrollSection = ref<HTMLElement | null>(null)
const landDocumentsTableRef = ref<InstanceType<typeof LandDocumentsTableComponent> | null>(null)

const propertyLandholding = computed(() => [
  {
    label: getLanguage('register.propertyRights.form.propertyOrLandholdingOption.property'),
    value: 'property',
  },
  /*{
    label: getLanguage('register.propertyRights.form.propertyOrLandholdingOption.landholding'),
    value: 'landholding',
  },*/
])

const documentTypes = computed(() => [
  { value: 'deed', label: getLanguage('register.propertyRights.form.documentTypeOptions.deed') },
  {
    value: 'titleDeed',
    label: getLanguage('register.propertyRights.form.documentTypeOptions.titledeed'),
  },
  {
    value: 'purchaseAndSaleAgreement',
    label: getLanguage('register.propertyRights.form.documentTypeOptions.purchaseandsaleagreement'),
  },
])

// const legalReserveOptions = computed(() => [
//   { label: getLanguage('register.propertyRights.form.legalReserve.legalReserveOptions.yes'), value: true },
//   { label: getLanguage('register.propertyRights.form.legalReserve.legalReserveOptions.no'), value: false }
// ]);

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

const states = ref(States)
const selectedState = computed(() => newPropertyRightsInformation.value.stateOfTheNotaryOffice)
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
    newPropertyRightsInformation.value.cityOfTheNotaryOffice = ''
  },
  { deep: true },
)

onMounted(async () => {
  Object.assign(newPropertyRightsInformation.value, initialPropertyRightsData)
  validation.value.$reset()
})

const propertyAreaFromDocs = computed(() => {
  if (formData.propertyRights && formData.propertyRights.propertyRightsData) {
    const propertyRightsData = formData.propertyRights.propertyRightsData
    if (propertyRightsData.length > 0) {
      return propertyRightsData.reduce(
        (total: number, doc: any) => total + parseFloat(doc.area || '0'),
        0,
      )
    }
  }
  return 0
})

const propertyAreaFromMap = computed(() => {
  const sessionStorage = window.sessionStorage.getItem('formData')
  if (sessionStorage) {
    const parsedData = JSON.parse(sessionStorage)
    if (parsedData.mapData && parsedData.mapData.mainArea) {
      return parsedData.mapData.mainArea.area
    }
  }
  return 0
})

const calculateAreaDifference = (areaFromMap: number, areaFromDocuments: number): number => {
  if (areaFromMap && areaFromDocuments) {
    const diff = Math.abs(areaFromMap - areaFromDocuments)
    return (diff / areaFromMap) * 100
  }
  return 0
}

const isAreaOverDiffLimit = computed(() => {
  const diffPercentage = calculateAreaDifference(
    propertyAreaFromMap.value,
    propertyAreaFromDocs.value,
  )
  const diffMax = DiffAreaConfig.percentual_limit * 100
  return diffPercentage > diffMax
})

const isDiffLimitProhibitive = computed(() => {
  return DiffAreaConfig.is_prohibitive
})

watch(
  newPropertyRightsInformation,
  () => {
    if (newPropertyRightsInformation.value.documentType) {
      const docTypeIndex = documentTypes.value.findIndex(
        (item) =>
          String(item.value).toLowerCase() ===
          String(newPropertyRightsInformation.value.documentType).toLowerCase(),
      )
      newPropertyRightsInformation.value.documentType =
        documentTypes.value[docTypeIndex]?.value || ''
    }
  },
  { deep: true, immediate: true },
)

const handleEditPropertyInformation = async (data: PropertyRightsData, index: number) => {
  if (scrollSection.value) {
    scrollSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const keys = Object.keys(data)
  for (const key of keys) {
    newPropertyRightsInformation.value[key as keyof PropertyRightsData] = data[
      key as keyof PropertyRightsData
    ] as (string & 'property') | 'landholding'
    await nextTick()
  }
  selectedIndex.value = index
}

const handleSaveChanges = () => {
  const requiredFields: (keyof PropertyRightsData)[] = ['area', 'registeredPropertyName']

  let isValid: boolean = true
  for (const field of requiredFields) {
    if (String(newPropertyRightsInformation.value[field]).trim() === '') {
      isValid = false
    }
  }

  if (isValid) {
    if (selectedIndex.value !== null) {
      if (formData.propertyRights.propertyRightsData) {
        formData.propertyRights.propertyRightsData[selectedIndex.value] = {
          ...newPropertyRightsInformation.value,
        }
        handleClear()
      }
    }
  } else {
    isWarningEditModalOpen.value = true
  }
}

const handleClear = () => {
  selectedIndex.value = null
  landDocumentsTableRef.value?.clearEditing()
  Object.assign(newPropertyRightsInformation.value, initialPropertyRightsData)
  validation.value.$reset()
}

const handleAddPropertyInformation = async () => {
  const result = await validation.value.propertyRights.$validate()
  if (result) {
    const temp = {} as PropertyRightsData
    Object.assign(temp, newPropertyRightsInformation.value)
    formData.propertyRights.propertyRightsData = formData.propertyRights.propertyRightsData
      ? [...formData.propertyRights.propertyRightsData, temp]
      : [temp]
    validateRegistrationForm.isPropertyRightsValid = true
    handleClear()
    validation.value.$reset()
  } else {
    // Show specific invalid fields for current property rights form
    const invalidFields = validationHelper.getPropertyRightsInvalidFields()

    if (invalidFields.length > 0) {
      let message = getLanguage('register.propertyRights.hasBlankFields') + '\n\n'
      message += `${getLanguage('register.propertyRights.validationError.fields')}: ${invalidFields.join(', ')}`
      warningText.value = message
      isWarningModalOpen.value = true
    }
  }
}

const cancelRemovePropertyInformation = () => {
  isDeletePropertyInformationModalOpen.value = false
  propertyInformationToRemove.value = null
}

const handleRemovePropertyInformation = (index: number) => {
  propertyInformationToRemove.value = index
  isDeletePropertyInformationModalOpen.value = true
}

const handleDeletePropertyInformation = () => {
  if (propertyInformationToRemove.value !== null && formData.propertyRights.propertyRightsData) {
    formData.propertyRights.propertyRightsData.splice(propertyInformationToRemove.value, 1)
    if (!formData.propertyRights.propertyRightsData?.length) {
      validateRegistrationForm.isPropertyRightsValid = false
    }
    isDeletePropertyInformationModalOpen.value = false
    propertyInformationToRemove.value = null
    selectedIndex.value = null
    landDocumentsTableRef.value?.clearEditing()
  }
}

const validateForm = () => {
  if (formData.propertyRights.propertyRightsData) {
    const result = formData.propertyRights.propertyRightsData.length > 0
    if (result) {
      validateRegistrationForm.isPropertyRightsValid = true
    } else {
      validateRegistrationForm.isPropertyRightsValid = false
    }
  }
}

const validationHelper = new ValidationHelper({
  validation,
  formData,
  getLanguage,
})

const handleRegisterButton = async () => {
  validateForm()

  // Trigger validation on all steps
  await validation.value.$validate()

  const isFormValid = Object.values(validateRegistrationForm).every(Boolean)

  if (isFormValid) {
    if (isAreaOverDiffLimit.value && isDiffLimitProhibitive.value) {
      isDiffAreaOverLimitModalOpen.value = true
      return
    }
    isConfirmModalOpen.value = true
    return
  }

  // Get detailed validation information
  const invalidFieldsDetails = validationHelper.getInvalidFieldsDetails()

  if (invalidFieldsDetails.length > 0) {
    warningText.value = validationHelper.buildValidationMessage(invalidFieldsDetails)
    isWarningModalOpen.value = true
  } else if (!validateRegistrationForm.isPropertyRightsValid) {
    warningText.value = warningOptions.invalidForm
    isWarningModalOpen.value = true
  } else {
    warningText.value = warningOptions.previousStepsBlankFields
    isWarningModalOpen.value = true
  }
}

const propertyEditing = computed(() => {
  if (localStorage.getItem('EditingRegistry')) {
    return JSON.parse(localStorage.getItem('EditingRegistry')!)
  } else {
    return {}
  }
})
const isEditingProperty = computed(() => Object.keys(propertyEditing.value).length > 0)

const lastPropertyId = ref<string | null>(null)
const handleConfirm = async () => {
  isConfirmModalOpen.value = false

  // Check if mapData exists and has content
  if (!formData.mapData || Object.keys(formData.mapData).length === 0) {
    warningText.value = warningOptions.noMapData
    isWarningModalOpen.value = true
    return
  }

  isSavingDataModalOpen.value = true
  const formDataToSend = buildFormData(formData)

  try {
    let response: AxiosResponse<any>
    if (isEditingProperty.value) {
      response = await axios.put(`/properties/${propertyEditing.value['id']}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } else {
      response = await axios.post('/properties', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }

    if (response.status === 200) {
      isSavingDataModalOpen.value = false
      isSuccessModalOpen.value = true
      lastPropertyId.value = response.data?.id
    } else {
      warningText.value = warningOptions.serverError
      isSavingDataModalOpen.value = false
      isWarningModalOpen.value = true
    }
  } catch {
    warningText.value = warningOptions.connectionError
    isSavingDataModalOpen.value = false
    isConfirmModalOpen.value = false
    isWarningModalOpen.value = true
  }
}

const handleSuccessConfirm = async () => {
  if (lastPropertyId.value) {
    sessionStorage.setItem('downloadReceiptId', lastPropertyId.value)
  }
  isSuccessModalOpen.value = false
  resetFormData()
  localStorage.removeItem('EditingRegistry')
  sessionStorage.removeItem('mapCaptured')
  window.sessionStorage.removeItem('mapState')
  validation.value.$reset()
  window.location.href = router.resolve({ path: '/properties' }).href
}
</script>

<template>
  <div ref="scrollSection">
    <WholeWidthCardComponent bg-color="#f0fcf7">
      <h1 class="text-lg font-bold">{{ getLanguage('register.propertyRights.card') }}</h1>
      <p>{{ getLanguage('register.propertyRights.cardSubtitle') }}</p>
    </WholeWidthCardComponent>
  </div>

  <!-- <form onSubmit={handleSubmit(customHandleSubmit)}> -->
  <WholeWidthCardComponent :bg-color="selectedIndex !== null ? '#EEF6FD' : '#F8FAF9'">
    <h2 class="text-lg font-bold text-center text-gray-700">
      {{
        selectedIndex !== null
          ? `${getLanguage('register.propertyRights.form.editingProperty')}`
          : `${getLanguage('register.propertyRights.form.addNewProperty')}`
      }}
    </h2>
    <div class="py-3">
      <RadioButtonGroupComponent
        name="propertyLandholgin"
        :groupLabel="`${getLanguage('register.propertyRights.form.propertyOrLandholding')}`"
        :options="propertyLandholding"
        v-model="newPropertyRightsInformation.propertyLandholding"
        :vertical-alignment="false"
        :show-divider="false"
      />
    </div>
    <div class="grid grid-cols-6 gap-4">
      <div class="col-span-3 col-start-1">
        <TextInputComponent
          :label="`${getLanguage('register.propertyRights.form.registeredPropertyName')} ${getLanguage('register.propertyRights.form.required')}`"
          id="property-name"
          v-model="newPropertyRightsInformation.registeredPropertyName"
          :errors="validation.propertyRights.registeredPropertyName.$errors"
        />
      </div>
      <div class="col-span-1 col-start-4">
        <TextInputComponent
          :label="`${getLanguage('register.propertyRights.form.area')} ${getLanguage('register.propertyRights.form.required')}`"
          type="number"
          id="area"
          v-model="newPropertyRightsInformation.area"
          :errors="validation.propertyRights.area.$errors"
        />
      </div>
      <div class="col-span-2 col-start-5">
        <SelectInputComponent
          id="document-type"
          :placeholder="`${getLanguage('register.propertyRights.form.documentTypePlaceHolder')}`"
          :label="`${getLanguage('register.propertyRights.form.documentType')}`"
          :items="documentTypes"
          v-model="newPropertyRightsInformation.documentType"
          :errors="validation.propertyRights.documentType.$errors"
        />
      </div>
    </div>
    <div class="grid grid-cols-8 gap-4 mt-3">
      <div class="col-span-4 col-start-1">
        <TextInputComponent
          :label="`${getLanguage('register.propertyRights.form.titleDeedOrLandDocument')}`"
          id="title-deed-land-document"
          :tooltip-text="`${getLanguage('register.propertyRights.form.titleDeedOrLandDocumentTooltip')}`"
          v-model="newPropertyRightsInformation.titleDeedLandDocument"
          :errors="validation.propertyRights.titleDeedLandDocument.$errors"
        />
      </div>
      <div class="col-span-2 col-start-5">
        <CalendarComponent
          :label="`${getLanguage('register.propertyRights.form.documentDate')}`"
          id="document-date"
          v-model="newPropertyRightsInformation.documentDate"
          :errors="validation.propertyRights.documentDate.$errors"
        />
      </div>
      <div class="col-span-2 col-start-7">
        <TextInputComponent
          :label="`${getLanguage('register.propertyRights.form.book')}`"
          id="book"
          v-model="newPropertyRightsInformation.book"
          :errors="validation.propertyRights.book.$errors"
        />
      </div>
    </div>
    <div class="grid grid-cols-8 gap-4 mt-3">
      <div class="col-span-2 col-start-1">
        <TextInputComponent
          :label="`${getLanguage('register.propertyRights.form.page')}`"
          id="page"
          v-model="newPropertyRightsInformation.page"
          :errors="validation.propertyRights.page.$errors"
        />
      </div>
      <div class="col-span-2 col-start-3">
        <SelectInputComponent
          :label="`${getLanguage('register.propertyRights.form.stateOfTheNotaryOffice')}`"
          :items="states"
          :placeholder="`${getLanguage('register.propertyRights.form.stateOfTheNotaryOfficePlaceHolder')}`"
          id="state"
          v-model="newPropertyRightsInformation.stateOfTheNotaryOffice"
          :errors="validation.propertyRights.stateOfTheNotaryOffice.$errors"
        />
      </div>
      <div class="col-span-4 col-start-5">
        <SelectInputComponent
          :label="`${getLanguage('register.propertyRights.form.cityOfTheNotaryOffice')}`"
          :items="cities"
          :placeholder="`${getLanguage('register.propertyRights.form.cityOfTheNotaryOfficePlaceHolder')}`"
          id="city"
          v-model="newPropertyRightsInformation.cityOfTheNotaryOffice"
          :errors="validation.propertyRights.cityOfTheNotaryOffice.$errors"
          :disabled="!selectedState"
        />
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4 mt-3">
      <div class="col-span-2 col-start-1">
        <!-- <TextInputComponent
          :label="`${getLanguage('register.propertyRights.form.nationalRuralLandRegistrySystemCode')} ${getLanguage('register.propertyRights.form.required')}`"
          id="national-rural-land-registry-system-code"
          :tooltip-text="`${getLanguage('register.propertyRights.form.nationalRuralLandRegistrySystemCodeTooltip')}`"
          v-model="newPropertyRightsInformation.nationalRuralLandRegistrySystemCode"
          :errors="validation.propertyRights.nationalRuralLandRegistrySystemCode.$errors" /> -->
        <TextInputComponent
          :label="`${getLanguage('register.propertyRights.form.propertyCertification')}`"
          id="property-certification"
          :tooltip-text="`${getLanguage('register.propertyRights.form.propertyCertificationTooltip')}`"
          v-model="newPropertyRightsInformation.propertyCertification"
          :errors="validation.propertyRights.propertyCertification.$errors"
        />
      </div>
      <div class="col-span-2 col-start-3">
        <TextInputComponent
          :label="`${getLanguage('register.propertyRights.form.nationalRuralPropertyRegistrationNumber')}`"
          id="national-rural-property-registration-number"
          :tooltip-text="`${getLanguage('register.propertyRights.form.nationalRuralPropertyRegistrationNumberTooltip')}`"
          v-model="newPropertyRightsInformation.nationalRuralPropertyRegistrationNumber"
          :errors="validation.propertyRights.nationalRuralPropertyRegistrationNumber.$errors"
        />
      </div>
    </div>
    <!-- <div class="grid grid-cols-2 gap-4 mt-3">
      <div class="col-span-1 col-start-1">
      </div>
    </div> -->

    <!-- <div class="py-3">
      <RadioButtonGroupComponent :groupLabel="`${getLanguage('register.propertyRights.form.legalReserve.label')}`"
        name="legal-reserve" :options="legalReserveOptions" v-model="newPropertyRightsInformation.legalReserve"
        :vertical-alignment="false" />
    </div>

    <p v-if="!newPropertyRightsInformation.legalReserve">
      {{ getLanguage('register.propertyRights.form.legalReserve2') }}
    </p> -->
    <div class="flex flex-row space-x-4 mt-4 mb-5">
      <button class="br-button secondary" @click="handleClear">
        {{
          selectedIndex !== null
            ? `${getLanguage('register.propertyRights.form.cancel')}`
            : `${getLanguage('register.propertyRights.form.clear')}`
        }}
      </button>
      <button
        class="br-button primary"
        @click="selectedIndex !== null ? handleSaveChanges() : handleAddPropertyInformation()"
      >
        {{
          selectedIndex !== null
            ? `${getLanguage('register.propertyRights.form.saveChanges')}`
            : `${getLanguage('register.propertyRights.form.add')}`
        }}
      </button>
    </div>
  </WholeWidthCardComponent>
  <!-- </form> -->

  <h1 class="text-lg font-bold pl-4 primary-color">
    {{ getLanguage('register.propertyRights.listOfInformedLandDocuments') }}
  </h1>

  <WholeWidthCardComponent>
    <LandDocumentsTableComponent
      :propertyRightsData="formData.propertyRights.propertyRightsData || []"
      ref="landDocumentsTableRef"
      @remove-property-information="handleRemovePropertyInformation"
      @edit-property-information="handleEditPropertyInformation"
      @clearEditing="handleClear"
    />
    <div class="flex flex-col justify-start">
      <span class="font-bold text-gray-400"
        >Area Total (ha): {{ propertyAreaFromDocs.toFixed(4) }}</span
      >
    </div>
  </WholeWidthCardComponent>

  <ModalComponent
    :is-open="isConfirmModalOpen"
    @close="() => (isConfirmModalOpen = false)"
    @confirm="handleConfirm"
    :title="
      isAreaOverDiffLimit
        ? getLanguage('register.propertyRights.modalOverAreaLimitTitle')
        : getLanguage('register.propertyRights.attentionModalTitle')
    "
  >
    <div v-if="isAreaOverDiffLimit && !isDiffLimitProhibitive">
      <p>
        {{ getLanguage('register.propertyRights.confirmModalOverAreaLimitWarning') }}
      </p>
      <p>
        <b>
          {{ getLanguage('register.propertyRights.confirmModalOverAreaLimitMap') }}
        </b>
        {{ parseFloat(propertyAreaFromMap).toFixed(4) }}(ha)
      </p>
      <p>
        <b>
          {{ getLanguage('register.propertyRights.confirmModalOverAreaLimitDocs') }}
        </b>
        {{ propertyAreaFromDocs.toFixed(4) }}(ha)
      </p>
      <p>
        {{ getLanguage('register.propertyRights.confirmModalOverAreaLimitRule') }}
        <b>{{ DiffAreaConfig.percentual_limit * 100 }}%.</b>
      </p>
      <p>{{ getLanguage('register.propertyRights.confirmModalOverAreaLimitQuestion') }}</p>
    </div>
    <p v-else>{{ getLanguage('register.propertyRights.confirmModal') }}</p>
  </ModalComponent>

  <ModalComponent
    :is-open="isSavingDataModalOpen"
    @close="() => (isSavingDataModalOpen = false)"
    :hide-buttons="true"
    :title="getLanguage('register.propertyRights.savingDataModalTitle')"
  >
    <p>{{ getLanguage('register.propertyRights.savingData') }}</p>
  </ModalComponent>

  <ModalComponent
    :is-open="isDiffAreaOverLimitModalOpen"
    @close="() => (isDiffAreaOverLimitModalOpen = false)"
    :title="getLanguage('register.propertyRights.modalOverAreaLimitTitle')"
  >
    <p>
      {{ getLanguage('register.propertyRights.confirmModalOverAreaLimitWarning') }}
    </p>
    <p>
      <b>
        {{ getLanguage('register.propertyRights.confirmModalOverAreaLimitMap') }}
      </b>
      {{ parseFloat(propertyAreaFromMap).toFixed(4) }}(ha)
    </p>
    <p>
      <b>
        {{ getLanguage('register.propertyRights.confirmModalOverAreaLimitDocs') }}
      </b>
      {{ propertyAreaFromDocs.toFixed(4) }}(ha)
    </p>
    <p>
      {{ getLanguage('register.propertyRights.confirmModalOverAreaLimitRule') }}
      <b>{{ DiffAreaConfig.percentual_limit * 100 }}%.</b>
    </p>
    <p>{{ getLanguage('register.propertyRights.areaDifferenceExceeded') }}</p>
  </ModalComponent>

  <ModalComponent
    :is-open="isDeletePropertyInformationModalOpen"
    @close="cancelRemovePropertyInformation"
    @confirm="handleDeletePropertyInformation"
    :title="getLanguage('register.propertyRights.attentionModalTitle')"
  >
    <p>{{ getLanguage('register.propertyRights.deletePropertyInformationModal') }}</p>
  </ModalComponent>

  <ModalComponent
    :is-open="isWarningModalOpen"
    @close="() => (isWarningModalOpen = false)"
    :title="getLanguage('register.propertyRights.attentionModalTitle')"
  >
    <p>{{ warningText }}</p>
  </ModalComponent>

  <ModalComponent
    :is-open="isWarningEditModalOpen"
    @close="() => (isWarningEditModalOpen = false)"
    :title="getLanguage('register.propertyRights.attentionModalTitle')"
  >
    <p>{{ getLanguage('register.propertyRights.hasBlankFields') }}</p>
  </ModalComponent>

  <ModalComponent
    :is-open="isSuccessModalOpen"
    @close="handleSuccessConfirm"
    :title="getLanguage('register.propertyRights.successModalTitle')"
  >
    <p>{{ getLanguage('register.propertyRights.successModal') }}</p>
  </ModalComponent>

  <div class="flex justify-between space-x-4 mt-4 mb-10 mx-3">
    <RouterLink class="br-button secondary" to="/register/rural_property">
      {{ getLanguage('register.previousButton') }}
    </RouterLink>
    <button class="br-button primary" @click="handleRegisterButton">
      {{ getLanguage('register.register') }}
    </button>
  </div>
</template>
