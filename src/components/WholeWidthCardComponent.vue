<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  bgColor: String,
  customClass: String,
})

const classList = computed(() => {
  return props.customClass ? props.customClass : 'max-w-screen m-3 p-3'
})

const color = computed(() => {
  return props.bgColor ? { backgroundColor: props.bgColor } : {}
})
</script>

<template>
  <div :class="classList" :style="color">
    <slot></slot>
  </div>
</template>
