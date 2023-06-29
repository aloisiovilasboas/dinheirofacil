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
      @uploader="handleOFXUpload" />
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

      <Column field="date" header="Data"></Column>
      <Column field="descricao" header="Descrição"></Column>
      <!--  <Column field="parcela" header="Parcela"></Column>
      <Column field="cidade" header="Cidade"></Column>
      <Column field="pais" header="País"></Column>
      <Column field="valorusd" header="Valor usd"></Column>
      -->
      <Column field="valor" class="valor" style="text-align: right;" header="Valor">
<!--         <template  #header>
          <div >Valor</div>
        </template> -->
      </Column>

    </DataTable>

  </div>
</template>

<script setup>
import TheHome from '../components/TheHome.vue'
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FileUpload from 'primevue/fileupload';

import * as txml from 'txml';


import 'primeicons/primeicons.css'
import 'primevue/resources/primevue.min.css'
import "primevue/resources/themes/lara-light-indigo/theme.css";




/* import { useFilesStore } from '../stores/files.js'; */

const tableData = ref([]);
/* const store = useFilesStore(); */

/* const onUpload = () => {
  console.log('teste33')
} */


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





const handleOFXUpload = (event) => {
  // console.log(event.files[0])
  const file = event.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const ofxString = e.target.result;
    const objtree = txml.parse(ofxString)
    const transacoes = objtree[1].children[1].children[0].children[2].children[2].children
    console.log(transacoes)

    /* todo */
    //const headers = ['descricao', 'parcela', 'cidade', 'pais', 'valorusd', 'valorbrl']
    const headers = ['date', 'descricao', 'valorbrl']
    console.log(headers)
    const data = [];
    for (let i = 1; i < transacoes.length; i++) {

      if (transacoes[i].tagName == 'STMTTRN') {
        console.log(transacoes[i])
        const rowData = {}
        
        const date = transacoes[i].children[1].children[0]
        rowData['ano'] = date.substring(0, 4)
        rowData['mes'] = date.substring(4, 6)
        rowData['dia'] = date.substring(6, 8)
        rowData['date'] = rowData['dia']+'/'+rowData['mes']+'/'+rowData['ano']
        rowData['valor'] = transacoes[i].children[2].children[0]
        rowData['valor'].replace('.', ',');
        rowData['valor'] = 'R$ '+rowData['valor']
        rowData['id'] = transacoes[i].children[3].children[0]
        rowData['descricao'] = transacoes[i].children[4].children[0]
        rowData['tipo'] = transacoes[i].children[0].children[0]
        data.push(rowData)
      }
    }
    tableData.value = data;
  };
  reader.readAsText(file);
};

</script>




