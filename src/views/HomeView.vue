<template>
  <main>
    <TheHome />
  </main>
  <input type="file" @change="handleFileUpload">
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

<script >
import TheHome from '../components/TheHome.vue'
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
/* import { useFilesStore } from '../stores/files.js'; */

export default {
  name: 'HomeView',
  components: {
    TheHome, DataTable, Column
  },
  setup() {
    const tableData = ref([]);
    /* const store = useFilesStore(); */


    const handleFileUpload = (event) => {
      console.log('opaa')
      const file = event.target.files[0];
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

    return {
      tableData,
      handleFileUpload,
    };
  },
};
</script>




