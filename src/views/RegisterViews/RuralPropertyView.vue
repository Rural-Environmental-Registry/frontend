<script setup lang="ts">
import RadioButtonGroupComponent from '@/components/RadioButtonGroupComponent.vue'
import SelectInputComponent from '@/components/SelectInputComponent.vue'
import TextAreaComponent from '@/components/TextAreaComponent.vue'
import TextInputComponent from '@/components/TextInputComponent.vue'
import WholeWidthCardComponent from '@/components/WholeWidthCardComponent.vue'
import { useLanguageContext } from '@/context/language/useLanguageContext'
import { useFormContext } from '@/context/useFormContext'
import { useValidatorContext } from '@/context/validators/useValidatorContext'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import States from '../../config/states_municipalities.json'

const { formData, validateRegistrationForm } = useFormContext()
const { validation } = useValidatorContext()
const { getLanguage } = useLanguageContext()

const router = useRouter()

const locationZonevOptions = computed(() => [
  { label: getLanguage('register.ruralProperty.form.locationZonevOption.urban'), value: 'urban' },
  { label: getLanguage('register.ruralProperty.form.locationZonevOption.rural'), value: 'rural' },
])

const handleNextButton = async () => {
  const result = await validation.value.ruralProperties.$validate()
  if (result) {
    validateRegistrationForm.isRuralPropertiesValid = true
    router.push('/register/property_rights')
  } else {
    validateRegistrationForm.isRuralPropertiesValid = false
  }
}
defineExpose({ handleNextButton })

const states = ref(States)
const selectedRuralPropertyState = computed(() => formData.ruralProperties.state)
const selectedMailingRuralPropertyState = computed(
  () => formData.ruralProperties.mailingAddress.state,
)
const ruralPropertiesCities = computed(() => {
  for (const state of states.value) {
    if (state.value == formData.ruralProperties.state) {
      return state.cities
    }
  }
  return []
})
const ruralPropertiesMailingCities = computed(() => {
  for (const state of states.value) {
    if (state.value == formData.ruralProperties.mailingAddress.state) {
      return state.cities
    }
  }
  return []
})

watch(
  selectedRuralPropertyState,
  () => {
    formData.ruralProperties.city = ''
  },
  { deep: true },
)
watch(
  selectedMailingRuralPropertyState,
  () => {
    formData.ruralProperties.mailingAddress.city = ''
  },
  { deep: true },
)
</script>

<template>
  <WholeWidthCardComponent bg-color="#f0fcf7">
    <h1 class="text-lg font-bold">{{ getLanguage('register.ruralProperty.card') }}</h1>
    <p>{{ getLanguage('register.ruralProperty.cardSubtitle') }}</p>
  </WholeWidthCardComponent>

  <WholeWidthCardComponent bg-color="#F8FAF9">
    <div class="flex flex-col space-y-4">
      <TextInputComponent
        :label="getLanguage('register.ruralProperty.form.propertyName')"
        id="property-name"
        v-model="formData.ruralProperties.propertyName"
        :errors="validation.ruralProperties.propertyName.$errors"
      />

      <div class="flex flex-row space-x-4">
        <SelectInputComponent
          id="state"
          :placeholder="getLanguage('register.ruralProperty.form.statePlaceHolder')"
          :label="getLanguage('register.ruralProperty.form.state')"
          :items="states"
          width="250px"
          v-model="formData.ruralProperties.state"
          :errors="validation.ruralProperties.state.$errors"
        />
        <SelectInputComponent
          id="city"
          :placeholder="getLanguage('register.ruralProperty.form.cityPlaceHolder')"
          :label="getLanguage('register.ruralProperty.form.city')"
          :items="ruralPropertiesCities"
          :disabled="!selectedRuralPropertyState"
          width="250px"
          v-model="formData.ruralProperties.city"
          :errors="validation.ruralProperties.city.$errors"
        />
        <TextInputComponent
          :label="getLanguage('register.ruralProperty.form.zipCode')"
          id="zip-code"
          v-model="formData.ruralProperties.zipCode"
          :errors="validation.ruralProperties.zipCode.$errors"
        />
        <RadioButtonGroupComponent
          name="locationZonev"
          :groupLabel="getLanguage('register.ruralProperty.form.locationZonev')"
          :options="locationZonevOptions"
          :vertical-alignment="false"
          :show-divider="true"
          v-model="formData.ruralProperties.locationZonenv"
        />
      </div>

      <div class="flex flex-row w-full">
        <TextAreaComponent
          :label="getLanguage('register.ruralProperty.form.descriptionOfPropertyAcess')"
          id="propertyAccessDescription"
          :tooltip-text="
            getLanguage('register.ruralProperty.form.descriptionOfPropertyAcessTooltip')
          "
          v-model="formData.ruralProperties.propertyAccessDescription"
        />
      </div>
    </div>
  </WholeWidthCardComponent>

  <WholeWidthCardComponent bg-color="#F8FAF9">
    <div class="flex flex-col space-y-4">
      <h1 class="text-lg font-bold">
        {{ getLanguage('register.ruralProperty.cardMailingAddress') }}
      </h1>
      <div class="flex flex-row space-x-4 flex-grow">
        <TextInputComponent
          :label="getLanguage('register.ruralProperty.formMailingAddress.recipientName')"
          id="recipient-name"
          v-model="formData.ruralProperties.mailingAddress.recipientName"
          :errors="validation.ruralProperties.mailingAddress.recipientName.$errors"
        />
      </div>
      <div class="flex flex-row space-x-4">
        <div class="flex flex-grow">
          <TextInputComponent
            :label="getLanguage('register.ruralProperty.formMailingAddress.addressStreet')"
            id="mailing-address-street"
            :tooltip-text="
              getLanguage('register.ruralProperty.formMailingAddress.addressStreetTooltip')
            "
            v-model="formData.ruralProperties.mailingAddress.addressStreet"
            classes="w-full"
            :errors="validation.ruralProperties.mailingAddress.addressStreet.$errors"
          />
        </div>
        <div class="flex flex-grow-0">
          <TextInputComponent
            :label="getLanguage('register.ruralProperty.formMailingAddress.number')"
            id="number"
            v-model="formData.ruralProperties.mailingAddress.number"
            :errors="validation.ruralProperties.mailingAddress.number.$errors"
          />
        </div>

        <div class="flex flex-grow">
          <TextInputComponent
            :label="getLanguage('register.ruralProperty.formMailingAddress.additionalInformation')"
            id="mailing-additional-information"
            v-model="formData.ruralProperties.mailingAddress.additionalInformation"
            classes="w-full"
          />
        </div>
      </div>
      <div class="flex flex-row space-x-4 w-full">
        <TextInputComponent
          :label="getLanguage('register.ruralProperty.formMailingAddress.neighborhood')"
          id="mailing-neighborhood"
          v-model="formData.ruralProperties.mailingAddress.neighborhood"
          :errors="validation.ruralProperties.mailingAddress.neighborhood.$errors"
        />
        <TextInputComponent
          :label="getLanguage('register.ruralProperty.formMailingAddress.zipCode')"
          id="mailing-zip-code"
          v-model="formData.ruralProperties.mailingAddress.zipCode"
          :errors="validation.ruralProperties.mailingAddress.zipCode.$errors"
        />
        <SelectInputComponent
          id="mailing-state"
          :placeholder="getLanguage('register.ruralProperty.formMailingAddress.statePlaceHolder')"
          :label="getLanguage('register.ruralProperty.formMailingAddress.state')"
          width="250px"
          v-model="formData.ruralProperties.mailingAddress.state"
          :items="states"
          :errors="validation.ruralProperties.mailingAddress.state.$errors"
        />
        <SelectInputComponent
          id="mailing-city"
          :placeholder="getLanguage('register.ruralProperty.formMailingAddress.cityPlaceHolder')"
          :label="getLanguage('register.ruralProperty.formMailingAddress.city')"
          width="250px"
          :items="ruralPropertiesMailingCities"
          v-model="formData.ruralProperties.mailingAddress.city"
          :errors="validation.ruralProperties.mailingAddress.city.$errors"
          :disabled="!selectedMailingRuralPropertyState"
        />
      </div>
      <div class="flex flex-row space-x-4">
        <TextInputComponent
          :label="getLanguage('register.ruralProperty.formMailingAddress.email')"
          id="mailing-email"
          v-model="formData.ruralProperties.mailingAddress.email"
        />
        <TextInputComponent
          :label="getLanguage('register.ruralProperty.formMailingAddress.contactNumber')"
          id="mailing-telephone"
          type="tel"
          v-model="formData.ruralProperties.mailingAddress.telephone"
        />
      </div>
    </div>
  </WholeWidthCardComponent>

  <div class="flex justify-between space-x-4 mt-4 mb-10 mx-3">
    <RouterLink class="br-button secondary" to="/register/landholders_information">
      {{ getLanguage('register.previousButton') }}
    </RouterLink>
    <button class="br-button primary" @click="handleNextButton">
      {{ getLanguage('register.nextButton') }}
    </button>
  </div>
</template>
