<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RouterLink } from 'vue-router'
import { faGlobe, faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, watch } from 'vue'
import { useLanguageContext } from '@/context/language/useLanguageContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const { language, setLanguage, getLanguage } = useLanguageContext()

const selectedLanguage = ref(language)

watch(selectedLanguage, (newLang) => {
  setLanguage(newLang)
})
</script>

<template>
  <div class="bg-white">
    <nav class="w-full shadow-md">
      <div class="flex justify-between p-3">
        <RouterLink to="/">
          <div class="pr-2 pl-2">
            <img
              class="h-10 object-cover"
              src="/images/govbr_logo_high_quality.svg"
              alt="gov.br logo"
            />
          </div>
        </RouterLink>
        <div class="flex gap-3 pr-4">
          <div>
            <Select v-model="selectedLanguage" @update:modelValue="setLanguage">
              <SelectTrigger class="w-[200px] rounded border-gray-600/80">
                <FontAwesomeIcon :icon="faGlobe" style="color: #a9a9a9" class="cursor-pointer" />
                <SelectValue
                  :placeholder="
                    {
                      'en-us': 'English (USA)',
                      'pt-br': 'Portuguese (Brazil)',
                      'es-es': 'Spanish (Spain)',
                    }[selectedLanguage]
                  "
                />
              </SelectTrigger>
              <SelectContent class="bg-white rounded">
                <SelectItem class="p-1 hover:cursor-pointer" value="en-us"
                  >English (USA)</SelectItem
                >
                <SelectItem class="p-1 hover:cursor-pointer" value="pt-br"
                  >Portuguese (Brazil)</SelectItem
                >
                <SelectItem class="p-1 hover:cursor-pointer" value="es-es"
                  >Spanish (Spain)</SelectItem
                >
              </SelectContent>
            </Select>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div class="flex gap-2 items-center">
                <Avatar class="bg-[#fdfaef]">
                  <AvatarImage src="" alt="@unovue" />
                  <AvatarFallback>
                    <FontAwesomeIcon :icon="faUser" style="color: #baf2dd" size="3x" />
                  </AvatarFallback>
                </Avatar>
                <FontAwesomeIcon :icon="faChevronDown" style="color: #baf2dd" size="sm" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{{ getLanguage('homepage.avatar.title') }}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <RouterLink to="/profile">
                <DropdownMenuItem>
                  {{ getLanguage('homepage.avatar.profile') }}
                </DropdownMenuItem>
              </RouterLink>
              <RouterLink to="/logout">
                <DropdownMenuItem>
                  {{ getLanguage('homepage.avatar.logout') }}
                </DropdownMenuItem>
              </RouterLink>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  </div>
</template>
