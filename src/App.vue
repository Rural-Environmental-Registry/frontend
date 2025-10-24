<script setup lang="ts">
import BackBarComponent from './components/BackBarComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
import NavBarComponent from './components/NavBarComponent.vue'

import FormContext from './context/FormContext.vue'
import LanguageContext from './context/language/LanguageContext.vue'
import ValidatorContext from './context/validators/ValidatorContext.vue'
import { useAuthReady } from './states/useAuthReady'

const { authReady } = useAuthReady()
</script>

<template>
  <FormContext>
    <ValidatorContext>
      <LanguageContext>
        <div class="flex flex-col min-h-screen">
          <div v-if="!authReady" class="flex flex-col min-h-screen items-center justify-center">
            <div class="br-loading" role="progressbar" ></div>
          </div>
          <template v-else>
            <NavBarComponent />
            <BackBarComponent />
            <div class="flex-grow w-full">
              <RouterView />
            </div>
            <FooterComponent />
          </template>
        </div>
      </LanguageContext>
    </ValidatorContext>
  </FormContext>
</template>
