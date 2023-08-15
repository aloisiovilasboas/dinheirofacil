<template>
  <main>
    <TheHome />
  </main>
  
  <p></p>
  <div class="">

    <DataTable v-if="tableData.length" :value="tableData" tableStyle="min-width: 50rem">

      <Column field="date" header="Data"></Column>
      <Column field="descricao" header="Descrição"></Column>
      <!--  <Column field="parcela" header="Parcela"></Column>
      <Column field="cidade" header="Cidade"></Column>
      <Column field="pais" header="País"></Column>
      <Column field="valorusd" header="Valor usd"></Column>
      -->
      <Column field="valor" class="valor" style="text-align: right;">
        <template #header>
          <div style="min-width: 100%">Valor (R$)</div>
        </template>
      </Column>

    </DataTable>

  </div>
</template>

<script setup>
import TheHome from '../components/TheHome.vue'
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';





import 'primeicons/primeicons.css'
import 'primevue/resources/primevue.min.css'
import "primevue/resources/themes/lara-light-indigo/theme.css";




/* import { useFilesStore } from '../stores/files.js'; */

const tableData = ref([]);
/* const store = useFilesStore(); */

/* const onUpload = () => {
  console.log('teste33')
} */



</script>




