<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps(['label', 'id', 'placeholder', 'modelValue', 'tooltipText'])

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const input = event.target as HTMLTextAreaElement
  emit('update:modelValue', input.value)
}
</script>
<template>
  <div class="br-textarea w-full">
    <label class="text-sm text-gray-500" :htmlFor="props.id">
      {{ props.label }}
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
    <textarea
      :id="props.id"
      :placeholder="props.placeholder"
      :value="modelValue"
      @input="updateValue"
    />
  </div>
</template>
