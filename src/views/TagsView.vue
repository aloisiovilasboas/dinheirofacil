<template>
  <MenuItem>
    <template #heading>Tags de Classificação</template>
    <template #icon>
      <DocumentationIcon />
    </template>
  </MenuItem>
  <div class="about">
    
    <!-- <p>{{ tagsStore.tags }}</p>
    <p>{{ tableData }}</p>

    <p>{{ nomeNovaTag }}</p>
    <p>{{ nomesTagsFontes }}</p>
    <p>{{ tipoFiltro }}</p>
    <p>{{ filtroDescricao }}</p>
    <p>{{ valorMaiorque }}</p> -->



    <Button label="Criar Tag" text icon="pi pi-plus" @click="visible = true" />
    <Dialog v-model:visible="visible" modal :style="{ width: '50vw' }">
      <h4>Nome</h4>
      <span class="p-float-label">
        <InputText id="nomeNovaTag" v-model="nomeNovaTag" />

      </span>



      <!--  <div class="card p-fluid">
          <AutoComplete v-model="value" dropdown multiple :suggestions="items" @complete="search1" />
        </div> -->

      <div class="card flex flex-column md:flex-row gap-3">
        <h4>Tags Fonte</h4>

        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <Checkbox v-model="checked1" :binary="true" />
          </span>
          <AutoComplete :disabled=!checked1 v-model="nomesTagsFontes" dropdown multiple :suggestions="items"
            @complete="search1" />
        </div>
      </div>
      <div style="min-height: 10pt;"></div>


      <div class="card flex flex-column md:flex-row gap-3">
        <h4>Filtros</h4>

        <Button v-for="filter of filtrosNovaTag" :key="filter.filtro" :severity="getSeverity(filter)"
          :label="filter.filtro" rounded icon="pi pi-times-circle" iconPos="right" size="small"
          @click="deleteFiltro(filter.filtro)" />

      </div>


      <div class="card flex justify-content-center">
        <Button label="Filtro" icon="pi pi-plus" @click="visible1 = true" />
        <Dialog v-model:visible="visible1" modal :style="{ width: '50vw' }">


          <div class="flex flex-row gap-3">
            <h4>Tipo do filtro</h4>
            <div class="flex align-items-center">
              <RadioButton v-model="tipoFiltro" inputId="descricaoradio" name="descricaoradio" value="Descrição" />
              <label for="descricaoradio" class="ml-2">Descrição</label>
            </div>
            <div class="flex align-items-center">
              <RadioButton v-model="tipoFiltro" inputId="valorradio" name="valorradio" value="Valor" />
              <label for="valorradio" class="ml-2">Valor</label>
            </div>
            <div class="flex align-items-center">
              <RadioButton v-model="tipoFiltro" inputId="dataradio" name="dataradio" value="Data" />
              <label for="dataradio" class="ml-2">Data</label>
            </div>
          </div>

          <div v-if="tipoFiltro == 'Descrição'" class="flex flex-row gap-3">
            <h4>Sequencia a ser buscada na descrição das transações:</h4>
            <span class="p-float-label">
              <InputText id="nomeNovoFiltro" v-model="filtroDescricao" />
              <label for="nomeNovoFiltro">Ex: POSTO BRASIL</label>
            </span>
          </div>
          <div v-if="tipoFiltro == 'Valor'" class="flex flex-row gap-3">
            <h4>Selecione o intervalo do valor a ser identificado nas transações</h4>

            <div class="p-inputgroup flex-1">
              <span class="p-inputgroup-addon">
                {{ 'menor que' }}
              </span>
              <InputText id="valorMenorq" v-model="valorMenorque" />
            </div>

            <div class="p-inputgroup flex-1">
              <span class="p-inputgroup-addon">
                {{ 'maior que' }}
              </span>
              <InputText id="valorMaiorque" v-model="valorMaiorque" />
            </div>


          </div>
          <div v-if="tipoFiltro == 'Data'" class="flex flex-row gap-3">
            <h4>Selecione o intervalo de datas a ser identificado nas transações</h4>

            <div class="p-inputgroup flex-1">
              <span class="p-inputgroup-addon">
                {{ 'menor que' }}
              </span>
              <InputText id="diaMenorQ" v-model="diaMenorQue" />
            </div>

            <div class="p-inputgroup flex-1">
              <span class="p-inputgroup-addon">
                {{ 'maior que' }}
              </span>
              <InputText id="diaMaiorQ" v-model="diaMaiorQue" />
            </div>
          </div>


          <Button label="Salvar" icon="pi pi-save" @click=addFiltro() />
        </Dialog>
      </div>
      {{ }}
      <Button label="Salvar" icon="pi pi-save" @click=addTag() :disabled=!nomeNovaTag.length />


    </Dialog>


    <div class="">

      <DataTable v-if="tagsStore.tags.length" :value="tagsStore.tags" tableStyle="min-width: 50rem">

        <Column field="nomeTag" header="Nome"></Column>
        <Column field="tagsFontes" header="Tags Fontes">
          <template #body="slotProps">
            <div>
              <!-- {{ slotProps.data.tagsFontes }} -->
              <Badge v-for="tag of slotProps.data.tagsFontes" :key="tag.nomeTag" :value="tag.nomeTag">
              </Badge>

            </div>
          </template>
        </Column>

        <!--  <Column field="parcela" header="Parcela"></Column>
  <Column field="cidade" header="Cidade"></Column>
  <Column field="pais" header="País"></Column>
  <Column field="valorusd" header="Valor usd"></Column>
  -->
        <Column field="filtros" class="valor" header="Filtros">

          <template #body="slotProps">
            <div>
              <!-- {{ slotProps.data.filtros }} -->
              <Badge v-for="filter of slotProps.data.filtros" :key="filter.filtro" :severity="getSeverity(filter)"
                :value="filter.filtro">
              </Badge>

            </div>
          </template>
        </Column>
        <Column header="Delete">
          <template #body="slotProps">
            <div>
              <!-- {{ slotProps.data.nomeTag }} -->
              <Button label="" icon="pi pi-trash" @click="delTag(slotProps.data.nomeTag)" />

            </div>
          </template>
        </Column>

      </DataTable>

    </div>
  </div>
  
</template>

<script setup>

import DocumentationIcon from '../components/icons/IconDocumentation.vue'

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Badge from 'primevue/badge';
import AutoComplete from 'primevue/autocomplete';

import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import InputText from 'primevue/inputtext';
/* import Chips from 'primevue/chips'; */

import { ref, } from "vue";
import MenuItem from '../components/MenuItem.vue'

import { useTagsStore } from "../stores/tagsStore"
const tagsStore = useTagsStore();


const checked1 = ref(false);




/* const filteredTags = ref(); */
const tipoFiltro = ref();
const filtroDescricao = ref('');

const valorMenorque = ref('');
const valorMaiorque = ref('');

const diaMenorQue = ref('')

const diaMaiorQue = ref('')
const filtrosNovaTag = ref([])


const visible = ref(false);
const visible1 = ref(false);
/* const tableData = ref(tagsStore.tags); */

/* ref([
  { nomeTag: 'Geral', tagsFontes: [], filtros: [] },
  { nomeTag: 'Celular', tagsFontes: [{ nomeTag: 'Geral' }], filtros: [{ tipoFiltro: 'Descricao', filtro: 'TIM' }] },

  { nomeTag: 'Deso', tagsFontes: [{ nomeTag: 'Geral' }], filtros: [{ tipoFiltro: 'Descricao', filtro: 'Deso S.A.' }] },
  { nomeTag: 'Fixas', tagsFontes: [{ nomeTag: 'Deso' }, { nomeTag: 'Celular' }], filtros: [] },
  { nomeTag: 'PostosPiranema', tagsFontes: [{ nomeTag: 'Geral' }], filtros: [{ tipoFiltro: 'Descricao', filtro: 'PostosPiranema' }] },
  { nomeTag: 'Forneria', tagsFontes: [{ nomeTag: 'PostosPiranema' }], filtros: [{ tipoFiltro: 'Valor', filtro: 'valor>200' }] },
  { nomeTag: 'Gasolina', tagsFontes: [{ nomeTag: 'Geral' }], filtros: [{ tipoFiltro: 'Valor', filtro: 'valor<200' }, { tipoFiltro: 'Descricao', filtro: 'PostosPiranema' }] },
  { nomeTag: 'Final do Mes', tagsFontes: [{ nomeTag: 'Geral' }], filtros: [{ tipoFiltro: 'Data', filtro: 'data>25' }] }
]); */

const deleteFiltro = (filtro) => {
  const index = filtrosNovaTag.value.findIndex(obj => obj.filtro === filtro);
  if (index > -1) {
    filtrosNovaTag.value.splice(index, 1);
  }
}



const delTag = (nomedatag) => {
  console.log(typeof (nomedatag));
  /* console.log( tagsStore.tags[1].nomeTag);  */
  const index = tagsStore.tags.findIndex(obj => obj.nomeTag === nomedatag);
  console.log(index);
  if (index > -1) {
    tagsStore.tags.splice(index, 1);
  }
}

const addTag = () => {

  var tfs = []
  if (checked1.value & nomesTagsFontes.value.length > 0) {
    nomesTagsFontes.value.forEach(element => {
      tfs.push({ nomeTag: element })
    });
  } else {
    tfs.push({ nomeTag: 'Geral' })
  }

  var t = { nomeTag: nomeNovaTag.value, tagsFontes: tfs, filtros: filtrosNovaTag.value }
  filtrosNovaTag.value = []
  nomesTagsFontes.value = []
  checked1.value = false
  nomeNovaTag.value = ''
  visible.value = false
  tagsStore.tags.push(t)
}

const addFiltro = () => {
  var f = { tipoFiltro: tipoFiltro.value, filtro: '' }

  if (tipoFiltro.value == 'Valor') {
    f.filtro = ''
    if (valorMaiorque.value !== '') {
      f.filtro = f.filtro + valorMaiorque.value + '<'
    }
    f.filtro = f.filtro + 'Valor'
    if (valorMenorque.value !== '') {
      f.filtro = f.filtro + '<' + valorMenorque.value
    }


  } else if (tipoFiltro.value == 'Data') {

    f.filtro = ''
    if (diaMaiorQue.value !== '') {
      f.filtro = f.filtro + diaMaiorQue.value + '<'
    }
    f.filtro = f.filtro + 'Data'
    if (diaMenorQue.value !== '') {
      f.filtro = f.filtro + '<' + diaMenorQue.value
    }

  }
  else if (tipoFiltro.value == 'Descrição') {
    f.filtro = filtroDescricao.value
  }
  valorMenorque.value = ''
  valorMaiorque.value = ''
  diaMaiorQue.value = ''
  diaMenorQue.value = ''
  tipoFiltro.value = ''
  filtroDescricao.value = ''
  filtrosNovaTag.value.push(f)
  visible1.value = false
}

const getSeverity = (filtro) => {
  switch (filtro.tipoFiltro) {
    case 'Valor':
      return 'warning';

    case 'Descricao':
      return 'warning';

    case 'Data':
      return 'warning';

    default:
      return null;
  }
};


const nomesTagsFontes = ref("");
const nomeNovaTag = ref("")
const items = ref([]);

const search1 = () => {

  items.value = tagsStore.tags.map((item) => item.nomeTag);
};

/* function salvaTags(exportObj = tagsStore.tags, exportName = 'tesssste') {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
} */

/* import { writeDb } from "../stores/json-db-main/dbFunctions.js"
const salvaTagss = () => {






  const dataObj = {
    james: 'hello'
  }

  writeDb(dataObj)
} */

/* const search = (event) => {
  if (!event.query.trim().length) {
    filteredTags.value = tableData.value.map((item) => item.nomeTag);
  } else {
    filteredTags.value = tableData.value.filter((tag) => {
      return tag.nomeTag.startsWith(event.query);
    });
  }

} */





</script>


<style>
/* @media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
} */
</style>
