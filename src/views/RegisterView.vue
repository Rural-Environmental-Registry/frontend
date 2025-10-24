<script setup lang="ts">
import StepperComponent from '@/components/StepperComponent.vue'
import { useFormContext } from '@/context/useFormContext'
import { provide, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { getPropertyRegisterData } from '@/services/propertiesService'

const routeComponent = ref()
provide('routeComponent', routeComponent)

const router = useRouter()
const route = useRoute()
const { formData } = useFormContext()

watch(
  route,
  async () => {
    if (router.currentRoute.value.name !== 'register') return

    if (route.query.id) {
      const {
        geoData,
        formData: structuredData,
        editingRegistry,
      } = await getPropertyRegisterData(route.query.id as string)

      // Salva dados de geometrias
      sessionStorage.setItem('mapState', JSON.stringify(geoData))

      // Atualiza formData com segurança
      if (structuredData) {
        formData.landHoldersInformation = structuredData.landHoldersInformation
        formData.propertyRights = structuredData.propertyRights
        formData.registrarDetails = structuredData.registrarDetails
        formData.ruralProperties = structuredData.ruralProperties
      }

      // Salva informações de edição
      localStorage.setItem('EditingRegistry', JSON.stringify(editingRegistry))
    }

    window.location.href = router.resolve({ path: '/register/property_map' }).href
  },
  { immediate: true },
)
</script>

<template>
  <StepperComponent />
  <RouterView v-slot="{ Component }">
    <component :is="Component" ref="routeComponent" />
  </RouterView>
</template>
