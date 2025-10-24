<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { computed, ref, watch } from 'vue'

import { useLanguageContext } from '@/context/language/useLanguageContext'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

interface props {
  label?: string
  id?: string
  modelValue?: string
  errors?: any
}

const props = defineProps<props>()
const emits = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const date = ref<Date | null>(null)
const datePickerRef = ref<InstanceType<typeof VueDatePicker> | null>(null)

const { getLanguage } = useLanguageContext()

const requiredText = computed(() =>
  (props.label || '').indexOf(getLanguage('register.registrarDetails.form.required')),
)
const labelToError = computed(() =>
  requiredText.value === -1
    ? props.label || ''
    : (props.label || '').substring(0, requiredText.value),
)

const parseDate = (dateStr: string | undefined): Date | null => {
  if (!dateStr) return null

  const [year, month, day] = dateStr.split('-').map(Number)
  const parsedDate = new Date(year, month - 1, day)

  parsedDate.setHours(0, 0, 0, 0)

  return parsedDate
}

const formatDate = (date: Date | null): string => {
  return date ? date.toISOString().split('T')[0] : '' // YYYY-MM-DD
}

watch(
  () => props.modelValue,
  (newVal) => {
    date.value = parseDate(newVal)
  },
  { immediate: true },
)

const openDatePicker = () => {
  datePickerRef?.value?.openMenu()
}

const hasRequiredError = computed(() =>
  props.errors?.some((error: any) => error.$validator === 'required'),
)

const dateUpperLimitError = computed(() =>
  props.errors?.some((error: any) => error.$validator === 'max'),
)

const shouldShowError = ref(hasRequiredError.value)

watch(date, (newDate) => {
  if (newDate) {
    shouldShowError.value = false
    emits('update:modelValue', formatDate(newDate))
  } else {
    shouldShowError.value = hasRequiredError.value
  }
})

watch(hasRequiredError, (newValue) => {
  if (newValue) {
    shouldShowError.value = true
  }
})
</script>

<template>
  <div class="flex flex-col items-start w-full">
    <label class="text-sm text-gray-500 mb-1" :htmlFor="id" @click="openDatePicker">{{
      label
    }}</label>
    <VueDatePicker
      ref="datePickerRef"
      v-model="date"
      :id="props.id"
      :enable-time-picker="false"
      input-class="custom-datepicker"
      :format="formatDate"
      :locale="'en'"
      :max-date="new Date()"
    >
      <template #input-icon>
        <div class="ml-2">
          <FontAwesomeIcon :icon="faCalendarAlt" :style="{ color: '#42916e' }" />
        </div>
      </template>
    </VueDatePicker>

    <span v-if="shouldShowError" class="text-red-600" id="date-required-error">
      {{ labelToError }}{{ getLanguage('register.errors.isRequired') }}!
    </span>
    <span v-if="dateUpperLimitError" class="text-red-600" id="date-upper-limit-error">
      {{ labelToError }}{{ getLanguage('register.errors.dateUpperLimit') }}!
    </span>
  </div>
</template>

<style>
.dp__input {
  border: 1px solid #888 !important;
  height: 40px;
}
</style>
