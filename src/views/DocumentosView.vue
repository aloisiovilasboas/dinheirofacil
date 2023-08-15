<template>
  <MenuItem>
  <template #heading>Importar Documentos</template>
  <template #icon>
    <DocumentationIcon />
  </template>
  </MenuItem>




  <div class="card">
    <h3>Cartões</h3>
    <DataView paginator :rows="5" :value="contasStore.contas.cartoes">
      <template #list="slotProps">
        <div class="col-12">
          <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
            <div>{{ slotProps.data.nome }}</div>
            <div class="text-2xl font-bold text-900">{{ slotProps.data.name }}</div>
          </div>
        </div>
      </template>
    </DataView>
  </div>




  <nav>
    <Calendar showIcon v-model="date" view="month" dateFormat="mm/yy" />
    <FileUpload mode="basic" chooseLabel="Subir CSV" accept=".csv" :auto="true" :customUpload="true"
      @uploader="handleCSVUpload" />
    <FileUpload mode="basic" chooseLabel="Subir OFX" accept=".ofx" :auto="true" :customUpload="true"
      @uploader="handleOFXUpload" />
  </nav>






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
import 'primeflex/primeflex.css';

import { useContasStore } from "../stores/contasStore"
const contasStore = useContasStore();
/* console.log(contasStore.contas.cartoes); */


import DataView from 'primevue/dataview';
/* import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions' */

import DocumentationIcon from '../components/icons/IconDocumentation.vue'
import Calendar from 'primevue/calendar';
const date = ref();

/* import TheHome from '../components/TheHome.vue' */
import MenuItem from '../components/MenuItem.vue'
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
        if (headers[j] == 'valorbrl') {
          rowData['valor'] = cell.replace('.', ',');
        } else {
          rowData[headers[j]] = cell;
        }

      }
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
        rowData['date'] = rowData['dia'] + '/' + rowData['mes'] + '/' + rowData['ano']
        rowData['valor'] = transacoes[i].children[2].children[0]
        rowData['valor'] = rowData['valor'].replace('.', ',');
        // rowData['valor'] = 'R$ ' + rowData['valor']
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






