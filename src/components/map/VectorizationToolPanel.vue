<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLanguageContext } from '@/context/language/useLanguageContext'

const { getLanguage } = useLanguageContext()

const emit = defineEmits(['vectorizationLayerSelected'])

const props = defineProps({
  config: Array,
  displayedAreas: Array,
})

const groupState = ref({})
const selectionState = ref({
  group: {
    key: '',
    open: false,
  },
  layer: {
    key: '',
  },
})

onMounted(() => {
  initGroupState()
})

const initGroupState = () => {
  props.config.forEach((group) => {
    groupState.value[group.groupKey] = {
      description: group.description,
      groupName: group.groupName,
      groupNameKey: group.groupNameKey,
      descriptionKey: group.descriptionKey,
      groupKey: group.groupKey,
      layersToVectorize: group.layersToVectorize,
    }
  })
}

const getClasses = (groupKey) => {
  const { key, open } = selectionState.value.group
  const isGroupSelected = key === groupKey && open

  return {
    btn: isGroupSelected
      ? 'bg-gray-200 ring-1 ring-gray-400 shadow-md'
      : 'bg-white hover:bg-gray-100 border-gray-300 shadow-sm',
    chevron: isGroupSelected ? 'rotate-90' : '',
  }
}

const getLanguageText = (keyOrText, fallbackText) => {
  const textToUse = keyOrText || fallbackText
  if (!textToUse) return ''

  if (textToUse.includes('.')) {
    const translated = getLanguage(textToUse)
    return translated === textToUse ? fallbackText || textToUse : translated
  }
  return textToUse
}

const toggleGroup = (groupKeyToToggle) => {
  const { key, open } = selectionState.value.group

  if (key === groupKeyToToggle) {
    selectionState.value.group.open = !open
    return
  }

  selectionState.value.group.key = groupKeyToToggle
  selectionState.value.group.open = true
  selectionState.value.layer.key = ''
}

const selectLayer = (layer) => {
  const { layerCode } = layer
  const { key } = selectionState.value.layer

  if (key === layerCode) {
    selectionState.value.layer.key = ''
    emit('vectorizationLayerSelected', { layer: null })
  } else {
    selectionState.value.layer.key = layerCode
    emit('vectorizationLayerSelected', { layer })
  }
}

const getLayerStates = (layer) => {
  const count = props.displayedAreas?.filter((area) => area.layerCode === layer.layerCode).length
  const isDisabled = !layer.rules.maxInstances ? false : count >= layer.rules.maxInstances
  const isSelected = selectionState.value.layer.key === layer.layerCode

  const disabledTitle = getLanguage('mapComponents.vectorizationToolPanel.limitReached')
    .replace('{current}', count.toString())
    .replace('{max}', layer.maxInstances?.toString() || '0')
    .replace('{layerName}', getLanguageText(layer.displayNameKey, layer.displayName))

  const title = isDisabled
    ? disabledTitle
    : getLanguageText(layer.displayNameKey, layer.displayName)

  return {
    disabled: isDisabled,
    selected: isSelected,
    title,
  }
}

const getLayerClasses = (layer) => {
  const { disabled, selected } = getLayerStates(layer)
  const classes = {
    row: '',
    checkbox: '',
  }

  if (disabled) {
    classes.row = 'bg-gray-50 text-gray-800 cursor-not-allowed'
    classes.checkbox = 'bg-gray-300 border-gray-400'
  }

  if (selected) {
    classes.row = 'bg-blue-900 text-white font-medium hover:bg-blue-800'
    classes.checkbox = 'bg-blue-500 border-blue-600'
  }

  if (!disabled && !selected) {
    classes.row = 'hover:bg-gray-200 focus:bg-blue-50 text-gray-700'
  }

  return classes
}

defineExpose({
  toggleStep: (key) => {
    if (!key) key = props.config[0].groupKey
    toggleGroup(key)
  },
  resetLayerSelection: () => {
    selectionState.value.layer.key = ''
  },
  currentStep: computed(() => selectionState.value),
})
</script>

<template>
  <div class="vectorization-tool-panel p-3 rounded-lg shadow-md bg-[#f7f7fa]">
    <div v-if="config?.length" class="group-boxes-container flex flex-wrap justify-center gap-3">
      <button
        v-for="group in groupState"
        :key="group.groupKey"
        class="flex flex-column items-center min-h-[60px] w-[170px] group-box flex-none p-3 border rounded-md transition-all duration-150 ease-in-out cursor-pointer disabled:cursor-not-allowed"
        :class="getClasses(group.groupKey).btn"
        @click="toggleGroup(group.groupKey)"
        :title="
          getLanguageText(group.descriptionKey, group.description) ||
          getLanguageText(group.groupNameKey, group.groupName)
        "
      >
        <span class="flex items-center justify-center text-center">
          <i
            class="fas fa-chevron-right text-green-600 text-xs transition-transform duration-200"
            :class="getClasses(group.groupKey).chevron"
          />
          <span
            class="text-black text-sm truncate"
            :title="getLanguageText(group.groupNameKey, group.groupName)"
          >
            {{ getLanguageText(group.groupNameKey, group.groupName) }}
          </span>
        </span>
      </button>
    </div>
    <p v-else class="text-sm text-gray-600 text-center my-4">
      {{ getLanguage('mapComponents.vectorizationToolPanel.noLayerGroupsConfigured') }}
    </p>
    <div
      v-if="selectionState.group.open"
      class="expanded-group-content p-3 border-t border-gray-200 mt-3 bg-white rounded-md shadow"
    >
      <h4 class="text-md font-semibold mb-1 text-gray-800">
        {{
          getLanguageText(
            groupState[selectionState.group.key].groupNameKey,
            groupState[selectionState.group.key].groupName,
          )
        }}
      </h4>
      <p
        v-if="
          groupState[selectionState.group.key].description ||
          groupState[selectionState.group.key].descriptionKey
        "
        class="text-xs text-gray-600 mb-3"
      >
        {{
          getLanguageText(
            groupState[selectionState.group.key].descriptionKey,
            groupState[selectionState.group.key].description,
          )
        }}
      </p>
      <ul v-if="groupState[selectionState.group.key].layersToVectorize.length" class="space-y-1.5">
        <li
          v-for="layer in groupState[selectionState.group.key].layersToVectorize"
          :key="layer.layerCode"
        >
          <button
            @click="selectLayer(layer)"
            class="w-full text-left p-2.5 rounded-md text-sm flex items-center justify-between transition-colors duration-150"
            :class="getLayerClasses(layer).row"
            :disabled="getLayerStates(layer).disabled"
            :title="getLayerStates(layer).title"
            v-if="!layer.rules?.hidden"
          >
            <span class="flex items-center flex-grow min-w-0">
              <span
                class="w-4 h-4 border border-gray-400 rounded-sm mr-2 flex items-center justify-center shrink-0"
                :class="getLayerClasses(layer).checkbox"
              >
                <i
                  style="font-size: 8px"
                  v-if="getLayerStates(layer).selected && !getLayerStates(layer).disabled"
                  class="fas fa-check text-white"
                />
                <i
                  style="font-size: 8px"
                  v-if="getLayerStates(layer).disabled"
                  class="fas fa-lock text-white"
                />
              </span>
              <span
                v-if="layer.rules?.style && layer.rules.style.color"
                class="color-swatch h-3.5 w-3.5 rounded-sm inline-block mr-2 border border-gray-300 shrink-0"
                :style="{ backgroundColor: layer.rules.style.color }"
              ></span>
              <span class="truncate">{{
                getLanguageText(layer.displayNameKey, layer.displayName)
              }}</span>
              <span
                v-if="layer.rules.required"
                class="ml-2 text-red-600 font-bold text-xs"
                title="Camada obrigatória"
                >*</span
              >
            </span>
          </button>
        </li>
      </ul>
      <p v-else class="text-sm text-gray-500">
        {{ getLanguage('mapComponents.vectorizationToolPanel.noLayersInGroup') }}
      </p>
    </div>
    <p v-if="selectionState.group.open" class="mt-3 text-sm text-gray-600 text-center">
      {{ getLanguage('mapComponents.vectorizationToolPanel.selectLayerFromGroup') }}
    </p>
  </div>
</template>
