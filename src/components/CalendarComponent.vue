<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'

import { useLanguageContext } from '@/context/language/useLanguageContext'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

interface Props {
  label?: string
  id?: string
  modelValue?: string
  errors?: any
}

const props = defineProps<Props>()
const emits = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const inputRef = ref<HTMLInputElement | null>(null)
const flatpickrInstance = ref<flatpickr.Instance | null>(null)

const { getLanguage } = useLanguageContext()

const requiredText = computed(() =>
  (props.label || '').indexOf(getLanguage('register.registrarDetails.form.required')),
)
const labelToError = computed(() =>
  requiredText.value === -1
    ? props.label || ''
    : (props.label || '').substring(0, requiredText.value),
)

const hasRequiredError = computed(() =>
  props.errors?.some((error: any) => error.$validator === 'required'),
)

const dateUpperLimitError = computed(() =>
  props.errors?.some((error: any) => error.$validator === 'max'),
)

const shouldShowError = ref(hasRequiredError.value)

const addDateMask = (input: HTMLInputElement) => {
  input.setAttribute('maxlength', '10')
  input.addEventListener('keypress', (e) => {
    if (e.keyCode < 47 || e.keyCode > 57) {
      e.preventDefault()
    }

    const len = input.value.length

    if (len !== 1 || len !== 3) {
      if (e.keyCode === 45) {
        e.preventDefault()
      }
    }

    if (len === 4) {
      input.value += '-'
    }

    if (len === 7) {
      input.value += '-'
    }
  })
}

const validateAndEmitDate = (value: string) => {
  if (!value) {
    shouldShowError.value = hasRequiredError.value
    emits('update:modelValue', '')
    return
  }

  const parts = value.split('-')
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number)
    const date = new Date(year, month - 1, day)

    if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
      shouldShowError.value = false
      emits('update:modelValue', value)
      return
    }
  }

  shouldShowError.value = true
}

onMounted(() => {
  if (inputRef.value) {
    addDateMask(inputRef.value)

    flatpickrInstance.value = flatpickr(inputRef.value, {
      dateFormat: 'Y-m-d',
      allowInput: true,
      maxDate: new Date(),
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          const date = selectedDates[0]
          const formatted = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
          inputRef.value!.value = formatted
          validateAndEmitDate(formatted)
        }
      }
    })

    inputRef.value.addEventListener('blur', () => {
      validateAndEmitDate(inputRef.value!.value)
    })

    if (props.modelValue) {
      inputRef.value.value = props.modelValue
    }
  }
})

onUnmounted(() => {
  if (flatpickrInstance.value) {
    flatpickrInstance.value.destroy()
  }
})

watch(() => props.modelValue, (newVal) => {
  if (inputRef.value && newVal) {
    inputRef.value.value = newVal
  }
})

watch(hasRequiredError, (newValue) => {
  if (newValue) {
    shouldShowError.value = true
  }
})

const openCalendar = () => {
  flatpickrInstance.value?.open()
}
</script>

<template>
  <div class="flex flex-col items-start w-full">
    <label class="text-sm text-gray-500 mb-1" :for="id" @click="openCalendar">
      {{ label }}
    </label>

    <div class="relative w-full">
      <input
        ref="inputRef"
        :id="id"
        type="text"
        class="w-full h-10 px-3 pr-10 border border-gray-400 rounded focus:outline-none focus:border-green-600"
      />
      <button
        type="button"
        @click="openCalendar"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600"
      >
        <FontAwesomeIcon :icon="faCalendarAlt" />
      </button>
    </div>

    <span v-if="shouldShowError" class="text-red-600" id="date-required-error">
      {{ labelToError }}{{ getLanguage('register.errors.isRequired') }}!
    </span>
    <span v-if="dateUpperLimitError" class="text-red-600" id="date-upper-limit-error">
      {{ labelToError }}{{ getLanguage('register.errors.dateUpperLimit') }}!
    </span>
  </div>
</template>

<style>
.flatpickr-calendar {
  font-family: inherit;
}

.flatpickr-day.today {
  background: #42916e !important;
  border-color: #42916e !important;
  color: white !important;
}

.flatpickr-day.selected {
  background: #42916e !important;
  border-color: #42916e !important;
  color: white !important;
}

.flatpickr-day:hover {
  background: #42916e !important;
  border-color: #42916e !important;
  color: white !important;
}

.flatpickr-months .flatpickr-month {
  color: #42916e !important;
}

.flatpickr-current-month .flatpickr-monthDropdown-months {
  color: #42916e !important;
}

.flatpickr-current-month input.cur-year {
  color: #42916e !important;
}
</style>
