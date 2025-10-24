<script setup lang="ts">
import { onBeforeMount } from 'vue'
onBeforeMount(() => {
  window.location.href = `${import.meta.env.VITE_AUTH_MODULE_URL}/profile`
})
</script>
