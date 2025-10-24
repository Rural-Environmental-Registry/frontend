<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WholeWidthCardComponent from './WholeWidthCardComponent.vue'
import { useFormContext } from '@/context/useFormContext'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useLanguageContext } from '@/context/language/useLanguageContext'

const { validateRegistrationForm } = useFormContext()

const route = useRoute()
const router = useRouter()
const pathName = computed(() => route.path)

const { getLanguage } = useLanguageContext()

const steps = computed(() => [
  { key: 'property_map', Title: getLanguage('register.steps.propertyMap') },
  { key: 'registrars_details', Title: getLanguage('register.steps.registrarDetails') },
  { key: 'landholders_information', Title: getLanguage('register.steps.landholdersInformation') },
  { key: 'rural_property', Title: getLanguage('register.steps.ruralProperties') },
  { key: 'property_rights', Title: getLanguage('register.steps.propertyRights') },
])

const pathArray = computed(() => pathName.value.split('/'))
const lastPath = computed(() => pathArray.value[pathArray.value.length - 1])
const currentStep = computed(() =>
  steps.value.findIndex((step: { key: string; Title: string }) => step.key === lastPath.value),
)

const activeColor = (index: number): string => {
  return currentStep.value >= index ? '#42916e' : '#ffffff'
}

const isStepValid = computed(() => [
  validateRegistrationForm.isMapValid,
  validateRegistrationForm.isRegistrarDetailsValid,
  validateRegistrationForm.isLandHoldersInformationValid,
  validateRegistrationForm.isRuralPropertiesValid,
  validateRegistrationForm.isPropertyRightsValid,
])

import { inject } from 'vue'
const routeComponent = inject('routeComponent')

const handleStepClick = (stepRoute: string) => {
  steps.value.map((step, index) => {
    if (step.key === stepRoute) {
      if (index > currentStep.value) {
        if (routeComponent?.value?.handleNextAndSave) {
          routeComponent.value.handleNextAndSave()
        } else if (routeComponent?.value?.handleNextButton) {
          routeComponent.value.handleNextButton()
        }
      } else {
        router.push(stepRoute)
      }
    }
  })
}
</script>

<template>
  <WholeWidthCardComponent bg-color="#fdfaef">
    <div class="flex flex-col space-y-4 w-full h-24">
      <h1 class="text-2xl font-semibold text-green-600">{{ getLanguage('register.step') }}</h1>
      <div class="flex flex-col items-center space-y-2 min-w-[70%]">
        <div class="flex items-center justify-center px-6 relative w-full">
          <div
            v-for="(step, index) in steps"
            :key="step.key"
            class="flex items-center justify-around w-full"
          >
            <div class="flex flex-col items-center gap-2 absolute -top-2">
              <!-- Clicable -->
              <a
                @click.prevent="handleStepClick(steps[index].key)"
                style="cursor: pointer"
                :class="`relative z-50 ${index <= currentStep + 1 ? 'cursor-pointer' : 'pointer-events-none'}`"
              >
                <!-- Cicle -->
                <div v-if="isStepValid[index]">
                  <div
                    class="w-4 h-4 rounded-full border-[2px] border-[#42916e]"
                    :style="{ backgroundColor: activeColor(index) }"
                  />
                </div>
                <div
                  v-else
                  class="w-4 h-4 rounded-full border-[2px] border-[#42916e]"
                  :style="{ backgroundColor: index === currentStep ? '#42916e' : '#ffffff' }"
                >
                  <TooltipProvider v-if="index < currentStep">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <FontAwesomeIcon
                          :icon="faCircleExclamation"
                          style="
                            color: #fbcb40;
                            position: absolute;
                            margin-top: -2px;
                            margin-left: -5.5px;
                          "
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>There are fields to be filled in</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </a>
              <span
                :class="`${currentStep === index && 'text-[#42916e] font-bold'} max-w-[150px] text-center break-words`"
              >
                {{ step.Title }}
              </span>
            </div>
          </div>
          <!-- Line -->
          <div :class="`h-[1px] w-[75%] bg-[#42916e] absolute`"></div>
        </div>
      </div>
    </div>
  </WholeWidthCardComponent>
</template>
