<template>
  <div class="flex flex-col">
    <div class="flex flex-row items-center">
      <h3 class="text-sm text-gray-700 font-bold">{{ groupLabel }}</h3>
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
    </div>
    <div :class="`flex flex-${verticalAlignment ? 'col' : 'row'} mt-3`">
      <div
        v-for="(option, index) in options"
        :key="String(option.value)"
        class="flex flex-row items-center"
      >
        <div class="br-radio">
          <input
            type="radio"
            :name="name"
            :id="`${name}-${option.value}`"
            :value="option.value"
            v-model="selectedValue"
          />
          <label :for="`${name}-${option.value}`">
            {{ option.label }}
          </label>
        </div>
        <div
          v-if="!verticalAlignment && index % 2 === 0 && showDivider"
            class="w-0.5 h-full mx-5 my-0 bg-gray-600 rounded-lg">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  options: Array<{ label: string; value: string | boolean }>
  modelValue: string | boolean
  name: string
  verticalAlignment: boolean
  groupLabel?: string
  tooltipText?: string
  showDivider: boolean
}>()

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['update:modelValue'])

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>
