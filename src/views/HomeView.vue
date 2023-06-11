<template>
  <main>
    <TheHome />
  </main>
  <div>
    <!-- <Button @click="handleCSVUpload" label="Importar CSV" icon="pi pi-upload" iconPos="right" /> -->

    <!-- <FileUpload mode="basic" name="demo[]" accept=".csv" @select="handleCSVUpload" @upload="onUpload" /> -->
    <FileUpload mode="basic" chooseLabel="Subir CSV" accept=".csv" :auto="true" :customUpload="true"
      @uploader="handleCSVUpload" />
  </div>
  <p>--</p>
  <div>
    <FileUpload mode="basic" chooseLabel="Subir OFX" accept=".ofx" :auto="true" :customUpload="true"
      @uploader="handleCSVUpload" />
  </div>
  <div>

    <div>
      <label for="csvFile">Importar CSV:</label>
      <input type="file" accept=".csv" @change="handleCSVUpload" id="csvFile" name="csvFile">
    </div>
    <div>
      <input type="file" @change="handleCSVUpload">
    </div>
  </div>


  <p></p>
  <div class="">

    <DataTable v-if="tableData.length" :value="tableData" tableStyle="min-width: 50rem">

      <Column field="date" header="Date"></Column>
      <Column field="descricao" header="Descrição"></Column>
      <Column field="parcela" header="Parcela"></Column>
      <Column field="cidade" header="Cidade"></Column>
      <Column field="pais" header="País"></Column>
      <Column field="valorusd" header="Valor usd"></Column>
      <Column field="valorbrl" header="Valor brl"></Column>

    </DataTable>

  </div>
</template>

<script setup>
import TheHome from '../components/TheHome.vue'
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FileUpload from 'primevue/fileupload';

import 'primeicons/primeicons.css'
import 'primevue/resources/primevue.min.css'
import "primevue/resources/themes/lara-light-indigo/theme.css";




/* import { useFilesStore } from '../stores/files.js'; */

const tableData = ref([]);
/* const store = useFilesStore(); */

const onUpload = () => {
  console.log('teste33')
}


const handleCSVUpload = (event) => {



  console.log(event.files[0])
  const file = event.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const contents = e.target.result;
    const rows = contents.split('\r\n');
    const headers = rows[0].split(',');

    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');
      const rowData = {};
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        rowData[headers[j]] = cell;
      }
      console.log(rowData);
      data.push(rowData);
    }
    tableData.value = data;
  };
  reader.readAsText(file);
};

</script>




