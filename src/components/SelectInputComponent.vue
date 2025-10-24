<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguageContext } from '@/context/language/useLanguageContext'
import { computed, ref } from 'vue'

const props = defineProps([
  'placeholder',
  'label',
  'id',
  'width',
  'items',
  'onChange',
  'errors',
  'onChange',
  'items',
  'modelValue',
  'disabled',
])

const emit = defineEmits(['update:modelValue'])

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const { getLanguage } = useLanguageContext()

const stringLabel = ref(props.label as string)
const requiredText = computed(() => stringLabel.value.indexOf(' (Required)'))
const labelToError = computed(() =>
  requiredText.value === -1
    ? `${stringLabel.value}`
    : stringLabel.value.substring(0, requiredText.value),
)

const isDisabled = computed(() => props.disabled || false)
</script>

<template>
  <div>
    <div class="mb-1">
      <label class="text-sm text-gray-500">{{ props.label }}</label>
    </div>
    <Select v-model="selectedValue" :disabled="isDisabled">
      <SelectTrigger
        :style="{ width: width || '100%' }"
        class="h-[40px] rounded border-gray-600/80 bg-white flex justify-start"
      >
        <slot name="icon"></slot>
        <!-- <SelectValue placeholder={ <div class="flex items-center gap-2">{placeholder}</div>}/> -->
        <SelectValue :placeholder="placeholder" class="flex-1 ml-1" />
      </SelectTrigger>
      <SelectContent class="bg-white rounded">
        <SelectItem
          v-for="item in items"
          :key="item.sigla || item.nome || item.value"
          class="p-1 hover:cursor-pointer"
          :value="item.value"
          :id="id"
        >
          {{ item.label }}
        </SelectItem>
      </SelectContent>
      <div v-for="error in props.errors" :key="error.$uid" class="text-red-600">
        <span v-if="error.$validator == 'required'"
          >{{ labelToError }} {{ getLanguage('register.errors.isRequired') }}!</span
        >
      </div>
    </Select>
  </div>
</template>
