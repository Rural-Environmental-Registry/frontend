<script setup lang="ts">
import { useLanguageContext } from '@/context/language/useLanguageContext'

interface ModalProps {
  isOpen: boolean
  hideButtons?: boolean
  onClose: () => void
  onConfirm?: () => void
  title?: string
}

const { getLanguage } = useLanguageContext()
const { isOpen, hideButtons = false, onClose, onConfirm, title } = defineProps<ModalProps>()
</script>

<template>
  <div :class="`br-scrim-util foco ${isOpen && 'active'}`" :data-scrim="false">
    <div class="br-modal bg-white border rounded" aria-labelledby="modalTitle">
      <div v-if="title" class="br-modal-header" :id="title">{{ title }}</div>
      <div class="br-modal-body">
        <slot></slot>
      </div>
      <div v-if="!hideButtons" class="br-modal-footer justify-content-end">
        <button
          :class="`br-button ${onConfirm ? 'secondary' : 'primary'} mt-3 mt-sm-0 ml-sm-3`"
          @click="onClose"
        >
          {{ getLanguage('register.closeButton') }}
        </button>
        <button
          v-if="onConfirm"
          class="br-button primary ml-2"
          data-dismiss="true"
          @click="onConfirm"
        >
          {{ getLanguage('register.confirmButton') }}
        </button>
      </div>
    </div>
  </div>
</template>
