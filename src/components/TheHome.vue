<script setup>

import { ref } from "vue";
/* import WelcomeItem from './WelcomeItem.vue' */
import MenuItem from './MenuItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import Calendar from 'primevue/calendar';

/* import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue' */

const date = ref();
</script>

<template>
  <MenuItem>
  <div class="card flex justify-content-center">
    <Calendar v-model="date" view="month" dateFormat="mm/yy" />
  </div>
  <template #heading>Resumo</template>
  <template #icon>
    <DocumentationIcon />
  </template>
  Mês
  </MenuItem>
</template>
