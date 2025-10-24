<script setup lang="ts">
import PropertyCardComponent from '@/components/PropertyCardComponent.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import { useLanguageContext } from '@/context/language/useLanguageContext'
import { fetchProperties, fetchReceipt } from '@/services/propertiesService'
import type { Property } from '@/interfaces/Property'
import PropertyFilterComponent from '@/components/PropertyFilterComponent.vue'

import { useGlobalLoading } from '@/states/useGlobalLoading'
import GlobalLoading from '@/components/GlobalLoading.vue'

const { isLoading, showLoading, hideLoading } = useGlobalLoading()

const { getLanguage } = useLanguageContext()

const currentPage = ref(1)
const itemsPerPage = 7
const totalPages = ref(1)
const filterParams = ref({})

const handleFilterChange = (queryParams: any) => {
  filterParams.value = queryParams
}

const propertiesData = ref<Property[]>([])

const loadProperties = async () => {
  showLoading()
  try {
    const pagedResult = await fetchProperties(
      currentPage.value - 1,
      itemsPerPage,
      filterParams.value,
    )

    propertiesData.value = pagedResult.properties.map((property: any) => ({
      id: property.id,
      imageUrl: property.imageUrl,
      code: property.code,
      propertyName: property.propertyName,
      stateDistrict: property.state,
      municipality: property.city,
    }))

    totalPages.value = pagedResult.totalPages
  } catch (error) {
    propertiesData.value = []
    throw error
  } finally {
    hideLoading()
  }
}

onMounted(async () => {
  loadProperties()
  const receiptId = sessionStorage.getItem('downloadReceiptId')
  if (receiptId) {
    await fetchReceipt(receiptId, true)
    sessionStorage.removeItem('downloadReceiptId')
  }
})

watch(currentPage, loadProperties)

watch(filterParams, () => {
  currentPage.value = 1
  loadProperties()
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (current > 4) pages.push('...')

    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 3) pages.push('...')

    pages.push(total)
  }

  return pages
})
</script>

<template>
  <div class="flex justify-between">
    <p class="ml-5 text-sm text-red-500 italic">
      {{ getLanguage('properties.propertyInfo') }}
    </p>
    <PropertyFilterComponent @update-filters="(queryParams) => handleFilterChange(queryParams)" />
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-5">
    <div class="br-card rounded max-w-[380px] h-[400px] bg-[#F8FAF9]">
      <div class="mb-2 mt-3 mr-2 ml-3">
        <img
          src="/images/property_owner.png"
          alt="Property owner"
          width="250"
          height="230"
          class="mt-5 mx-auto"
        />
        <h4 class="text-lg font-bold text-center">
          {{ getLanguage('properties.propertyCardTitle') }}
        </h4>
        <div class="flex justify-center">
          <RouterLink to="/register/property_map" class="br-button secondary mt-3">{{
            getLanguage('properties.registerProperty')
          }}</RouterLink>
        </div>
      </div>
    </div>

    <GlobalLoading v-if="isLoading" />

    <PropertyCardComponent
      v-for="(property, index) in propertiesData"
      :key="property.code + '-' + index"
      :id="property.id"
      :code="property.code"
      :image-url="property.imageUrl"
      :propertyName="property.propertyName"
      :stateDistrict="property.stateDistrict"
      :municipality="property.municipality"
    />
  </div>

  <div class="flex justify-center items-center mt-4 flex-wrap" v-if="propertiesData.length > 0">
    <button
      class="px-3 h-10 rounded-l border border-gray-300 text-gray-700 hover:bg-gray-200 transition-all duration-150"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    >
      {{ getLanguage('properties.pagination.previous') }}
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      class="w-10 h-10 text-sm flex items-center justify-center transition-all duration-150 border-y"
      :class="{
        'bg-[#42916e] text-white border-y border-[#2f6d53]': page === currentPage,
        'hover:bg-gray-100 text-gray-700 border-y border-gray-300':
          page !== currentPage && page !== '...',
        'bg-white text-gray-900 border-y border-gray-300 cursor-default': page === '...',
      }"
      @click="typeof page === 'number' && goToPage(page)"
    >
      {{ page }}
    </button>

    <button
      class="px-3 h-10 rounded-r border border-gray-300 text-gray-700 hover:bg-gray-200 transition-all duration-150"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    >
      {{ getLanguage('properties.pagination.next') }}
    </button>
  </div>
</template>
