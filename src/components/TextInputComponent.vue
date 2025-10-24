<script setup lang="ts">
import { computed, useSlots } from 'vue'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useLanguageContext } from '@/context/language/useLanguageContext'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

interface props {
  label?: string
  id?: string
  type?: string
  placeholder?: string
  modelValue?: string
  errors?: any
  classes?: string
  tooltipText?: string
  maxLength?: number
}

const props = defineProps<props>()
const emits = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const slots = useSlots()
const hasSlot = (name: string) => {
  return !!slots[name]
}

const requiredText = computed(() =>
  (props.label || '').indexOf(getLanguage('register.registrarDetails.form.required')),
)
const labelToError = computed(() =>
  requiredText.value === -1
    ? props.label || ''
    : (props.label || '').substring(0, requiredText.value),
)

const updateValue = (event: Event) => {
  const input = event.target as HTMLInputElement
  emits('update:modelValue', input.value)
}

const { getLanguage } = useLanguageContext()
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="br-input w-full">
      <label class="text-sm text-gray-500" :htmlFor="id">
        {{ label }}
      </label>
      <TooltipProvider v-if="tooltipText">
        <Tooltip>
          <TooltipTrigger as-child>
            <FontAwesomeIcon :icon="faInfoCircle" style="color: #1351b4; margin-left: 0.5rem" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ tooltipText }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <slot name="tooltip"></slot>
      <div class="relative items-center">
        <input
          :id="props.id"
          :type="props.type ? props.type : 'text'"
          :placeholder="props.placeholder"
          :value="props.modelValue"
          @input="updateValue"
          :class="classes"
          :maxlength="maxLength || 255"
          :style="hasSlot('icon') ? 'padding-left: 35px;' : ''"
        />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <slot name="icon"></slot>
        </span>
      </div>
    </div>
    <div v-for="error in props.errors" :key="error.$uid" class="text-red-600">
      <span v-if="error.$validator == 'required'"
        >{{ labelToError }} {{ getLanguage('register.errors.isRequired') }}!</span
      >
      <span v-else-if="error.$validator == 'date'"
        >{{ labelToError }} {{ getLanguage('register.errors.dateFormat') }}!</span
      >
      <span v-else>{{ getLanguage('register.errors.checkValue') }}!</span>
    </div>
  </div>
</template>
