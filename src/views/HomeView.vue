<script setup lang="ts">
import CardComponent from '@/components/CardComponent.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faNoteSticky, faMap, faUser, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { RouterLink } from 'vue-router'

import { useLanguageContext } from '@/context/language/useLanguageContext'

const { getLanguage } = useLanguageContext()
import { ref } from 'vue'

const showBanner = ref(true)
</script>

<template>
  <div class="flex flex-col">
    <div
      v-if="showBanner"
      class="br-message info mb-4"
      style="padding-top: 0.15rem; padding-bottom: 0.15rem"
    >
      <div class="icon">
        <i class="fas fa-info-circle fa-lg" aria-hidden="true"></i>
      </div>
      <div class="content" role="alert">
        <span class="message-title">{{ getLanguage('homepage.demoBannerTitle') }}</span>
        <span class="message-body">{{ getLanguage('homepage.demoBanner') }}</span>
      </div>
      <div class="close">
        <button class="br-button circle small" type="button" @click="showBanner = false">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <div class="flex-grow max-w-7xl mx-auto w-full flex flex-col justify-center">
      <div class="grid grid-cols-1 md:grid-cols-[30%_70%] items-center gap-8 w-full mt-10">
        <div class="hidden md:flex justify-center">
          <img src="/images/Logo-RER.png" width="500" height="500" alt="image of Logo RER" />
        </div>

        <div class="flex flex-col justify-center w-full">
          <h1 class="text-lg md:text-xl pl-2 mb-3">
            {{ getLanguage('homepage.title') }}
          </h1>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 mr-5">
            <CardComponent>
              <RouterLink to="/register/property_map">
                <div>
                  <FontAwesomeIcon
                    :icon="faNoteSticky"
                    style="color: #1351b4"
                    class="cursor-pointer !w-[48px] !h-[48px]"
                  />
                </div>
                <div>
                  <h2 class="text-lg">{{ getLanguage('homepage.registerProperty') }}</h2>
                </div>
              </RouterLink>
            </CardComponent>
            <CardComponent>
              <RouterLink to="/properties">
                <div>
                  <FontAwesomeIcon
                    :icon="faMap"
                    style="color: #1351b4"
                    class="cursor-pointer !w-[48px] !h-[48px]"
                  />
                </div>
                <div>
                  <h2 class="text-lg">{{ getLanguage('homepage.properties') }}</h2>
                </div>
              </RouterLink>
            </CardComponent>
            <CardComponent>
              <RouterLink to="/profile">
                <div>
                  <FontAwesomeIcon
                    :icon="faUser"
                    style="color: #1351b4"
                    class="cursor-pointer !w-[48px] !h-[48px]"
                  />
                </div>
                <div>
                  <h2 class="text-lg">{{ getLanguage('homepage.profile') }}</h2>
                </div>
              </RouterLink>
            </CardComponent>
          </div>

          <div class="flex items-center">
            <FontAwesomeIcon
              :icon="faCircleQuestion"
              style="color: #1351b4"
              class="cursor-pointer w-[16px] h-[16px] pb-4 pl-3"
            />
            <a
              href="https://github.com/Rural-Environmental-Registry/core"
              target="_blank"
              class="text-[#1351b4] text-lg font-bold pl-2 cursor-pointer hover:underline"
            >
              {{ getLanguage('homepage.learnMore') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
