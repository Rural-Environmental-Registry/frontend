<script setup lang="ts">
import CalendarComponent from '@/components/CalendarComponent.vue'
import LandHoldersTableComponent from '@/components/LandHoldersTableComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import RadioButtonGroupComponent from '@/components/RadioButtonGroupComponent.vue'
import TextInputComponent from '@/components/TextInputComponent.vue'
import WholeWidthCardComponent from '@/components/WholeWidthCardComponent.vue'
import { type LandHoldersData } from '@/context/LandHoldersInformation'
import { useFormContext } from '@/context/useFormContext'
import { useValidatorContext } from '@/context/validators/useValidatorContext'
import { useLanguageContext } from '@/context/language/useLanguageContext'
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const { validation, newLandHoldersInformation } = useValidatorContext()
const { formData, validateRegistrationForm } = useFormContext()
const { getLanguage } = useLanguageContext()

const selectedIndex = ref<number | null>(null)
const scrollSection = ref<HTMLElement | null>(null)
const landHoldersTableRef = ref<InstanceType<typeof LandHoldersTableComponent> | null>(null)

const legalPersinalityOfLandholderOptions = computed(() => [
  {
    label: getLanguage(
      'register.landholdersInformation.form.landholderLegalPersonality.options.one',
    ),
    value: 'natural_person',
  } /*
  {
    label: getLanguage(
      'register.landholdersInformation.form.landholderLegalPersonality.options.two',
    ),
    value: 'legal_entity',
  }, */
])

// const wayToAddLandholdersInformationOptions = computed(() => [
//   { label: getLanguage('register.landholdersInformation.form.chooseLandholderInfoMethod.options.one'), value: "fill" },
//   { label: getLanguage('register.landholdersInformation.form.chooseLandholderInfoMethod.options.two'), value: "import" },
// ]);

const initialLandHoldersData: LandHoldersData = {
  legalPersonality: 'natural_person',
  wayToAddLandholdersInformation: 'fill',
  id: '',
  dateOfBirth: '',
  name: '',
  mothersName: '',
}

onMounted(() => {
  Object.assign(newLandHoldersInformation.value, initialLandHoldersData)
})

const handleEditOwnerHolder = (data: LandHoldersData, index: number) => {
  if (scrollSection.value) {
    scrollSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  selectedIndex.value = index
  Object.assign(newLandHoldersInformation.value, data)
}

const handleSaveChanges = () => {
  const requiredFields: (keyof LandHoldersData)[] = ['dateOfBirth', 'name', 'mothersName']

  const isValid = requiredFields.every((field) => {
    return (
      newLandHoldersInformation.value[field] &&
      (newLandHoldersInformation.value[field] as string).trim() !== ''
    )
  })

  if (isValid) {
    if (selectedIndex.value !== null) {
      if (formData.landHoldersInformation.landHoldersData) {
        formData.landHoldersInformation.landHoldersData[selectedIndex.value] = {
          ...newLandHoldersInformation.value,
        }
        handleClear()
      }
    }
  } else {
    isWarningEditModalOpen.value = true
  }
}

const handleAddOwnerHolder = async () => {
  const result = await validation.value.landHoldersInformation.$validate()
  if (result) {
    const temp = { ...newLandHoldersInformation.value }
    formData.landHoldersInformation.landHoldersData = formData.landHoldersInformation
      .landHoldersData
      ? [...formData.landHoldersInformation.landHoldersData, temp]
      : [temp]
    validateRegistrationForm.isLandHoldersInformationValid = true
    handleClear()
    validation.value.$reset()
  }
}

const handleRemoveOwnerHolder = (index: number) => {
  ownerHolderToRemove.value = index
  isConfirmModalOpen.value = true
}

const handleDeleteOwner = () => {
  if (ownerHolderToRemove.value !== null && formData.landHoldersInformation.landHoldersData) {
    formData.landHoldersInformation.landHoldersData.splice(ownerHolderToRemove.value, 1)
    if (!formData.landHoldersInformation.landHoldersData?.length) {
      validateRegistrationForm.isLandHoldersInformationValid = false
    }
    isConfirmModalOpen.value = false
    ownerHolderToRemove.value = null
    selectedIndex.value = null
    landHoldersTableRef.value?.clearEditing()
  }
}

const cancelRemoveOwnerHolder = () => {
  isConfirmModalOpen.value = false
  ownerHolderToRemove.value = null
}

const handleClear = () => {
  selectedIndex.value = null
  landHoldersTableRef.value?.clearEditing()
  Object.assign(newLandHoldersInformation.value, initialLandHoldersData)
  validation.value.$reset()
}

const handleNextButton = async () => {
  if (formData.landHoldersInformation.landHoldersData) {
    const result = formData.landHoldersInformation.landHoldersData.length > 0
    if (result) {
      validateRegistrationForm.isLandHoldersInformationValid = true
      router.push('/register/rural_property')
    } else {
      isWarningModalOpen.value = true
      validateRegistrationForm.isLandHoldersInformationValid = false
    }
  }
}

defineExpose({ handleNextButton })

const isWarningModalOpen = ref(false)
const isWarningEditModalOpen = ref(false)
const isConfirmModalOpen = ref(false)

const ownerHolderToRemove = ref<number | null>(null)
</script>

<template>
  <WholeWidthCardComponent bg-color="#f0fcf7">
    <h1 class="text-lg font-bold">{{ getLanguage('register.landholdersInformation.card') }}</h1>
    <p>
      {{ getLanguage('register.landholdersInformation.cardSubtitle') }}
    </p>
  </WholeWidthCardComponent>

  <WholeWidthCardComponent :bg-color="selectedIndex !== null ? '#EEF6FD' : '#F8FAF9'">
    <h2 class="text-lg font-bold text-center text-gray-700">
      {{
        selectedIndex !== null
          ? getLanguage('register.landholdersInformation.editingLandholder')
          : getLanguage('register.landholdersInformation.addNewLandholder')
      }}
    </h2>
    <div class="h-10 mb-5">
      <RadioButtonGroupComponent
        :options="legalPersinalityOfLandholderOptions"
        name="legalPersonality"
        v-model="newLandHoldersInformation.legalPersonality"
        :group-label="
          getLanguage('register.landholdersInformation.form.landholderLegalPersonality.label')
        "
        :vertical-alignment="false"
        :show-divider="false"
      />
    </div>
    <!-- <div class="flex items-center space-x-2">
      <RadioButtonGroupComponent name="wayToAddLandholdersInformation"
        :group-label="getLanguage('register.landholdersInformation.form.chooseLandholderInfoMethod.label')"
        :options="wayToAddLandholdersInformationOptions"
        :tooltip-text="getLanguage('register.landholdersInformation.form.chooseLandholderInfoMethod.tooltip')"
        v-model="newLandHoldersInformation.wayToAddLandholdersInformation" :vertical-alignment="false" />
    </div> -->
    <!-- <br /> -->

    <div class="flex flex-col">
      <div class="flex flex-row space-x-4">
        <div class="flex flex-col">
          <TextInputComponent
            :label="getLanguage('register.landholdersInformation.form.id')"
            id="id"
            v-model="newLandHoldersInformation.id"
          />
        </div>
        <CalendarComponent
          :label="getLanguage('register.landholdersInformation.form.dateOfBirth')"
          id="dateOfBirth"
          v-model="newLandHoldersInformation.dateOfBirth"
          :errors="validation.landHoldersInformation.dateOfBirth.$errors"
        />
      </div>
      <div class="flex flex-row space-x-4 w-full py-2">
        <div class="w-1/2">
          <TextInputComponent
            :label="getLanguage('register.landholdersInformation.form.name')"
            id="name"
            v-model="newLandHoldersInformation.name"
            :errors="validation.landHoldersInformation.name.$errors"
          />
        </div>
        <div class="w-1/2">
          <TextInputComponent
            :label="getLanguage('register.landholdersInformation.form.mothersName')"
            id="mothersName"
            v-model="newLandHoldersInformation.mothersName"
            :errors="validation.landHoldersInformation.mothersName.$errors"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-row space-x-4 mt-4">
      <button class="br-button secondary" @click="handleClear">
        {{
          selectedIndex !== null
            ? getLanguage('register.landholdersInformation.cancel')
            : getLanguage('register.landholdersInformation.clear')
        }}
      </button>
      <button
        class="br-button primary"
        @click="selectedIndex !== null ? handleSaveChanges() : handleAddOwnerHolder()"
      >
        {{
          selectedIndex !== null
            ? getLanguage('register.landholdersInformation.saveChanges')
            : getLanguage('register.landholdersInformation.addOwnerHolder')
        }}
      </button>
    </div>
  </WholeWidthCardComponent>

  <h1 class="text-lg font-bold pl-4 primary-color">
    {{ getLanguage('register.landholdersInformation.ListOfOwnersHolders') }}
  </h1>

  <ModalComponent
    :is-open="isWarningEditModalOpen"
    @close="() => (isWarningEditModalOpen = false)"
    :title="getLanguage('register.landholdersInformation.warningModalTitle')"
  >
    <p>{{ getLanguage('register.landholdersInformation.warningModalRequired') }}</p>
  </ModalComponent>

  <ModalComponent
    :is-open="isConfirmModalOpen"
    @close="cancelRemoveOwnerHolder"
    @confirm="handleDeleteOwner"
    :title="getLanguage('register.landholdersInformation.warningModalTitle')"
  >
    <p>{{ getLanguage('register.landholdersInformation.warningModalDelete') }}</p>
  </ModalComponent>

  <ModalComponent
    :is-open="isWarningModalOpen"
    @close="() => (isWarningModalOpen = false)"
    :title="getLanguage('register.landholdersInformation.warningModalTitle')"
  >
    <p>{{ getLanguage('register.landholdersInformation.warningModal') }}</p>
  </ModalComponent>

  <WholeWidthCardComponent>
    <LandHoldersTableComponent
      :landHoldersData="formData.landHoldersInformation.landHoldersData || []"
      ref="landHoldersTableRef"
      @remove-owner-holder="handleRemoveOwnerHolder"
      @edit-owner-holder="handleEditOwnerHolder"
      @clearEditing="handleClear"
    />
  </WholeWidthCardComponent>

  <div class="flex justify-between space-x-4 mt-4 mb-10 mx-3">
    <RouterLink class="br-button secondary" to="/register/registrars_details">
      {{ getLanguage('register.previousButton') }}
    </RouterLink>
    <button class="br-button primary mr-3" @click="handleNextButton">
      {{ getLanguage('register.nextButton') }}
    </button>
  </div>
</template>
