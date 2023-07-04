<template>
  <div class="about">
    <h1>Tags</h1>
    {{ value }}

    <div class="card flex justify-content-center">
      <Button label="Criar Tag" icon="pi pi-plus" @click="visible = true" />
      <Dialog v-model:visible="visible" modal :style="{ width: '50vw' }">


        <h4>Tags Fonte</h4>

        <!--  <div class="card p-fluid">
          <AutoComplete v-model="value" dropdown multiple :suggestions="items" @complete="search1" />
        </div> -->

        <div class="card flex flex-column md:flex-row gap-3">

          <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon">
              <Checkbox v-model="checked1" :binary="true" />
            </span>
            <AutoComplete :disabled=!checked1 v-model="value" dropdown multiple :suggestions="items"
              @complete="search1" />
          </div>



        </div>

      </Dialog>
    </div>

    <div class="">

      <DataTable v-if="tableData.length" :value="tableData" tableStyle="min-width: 50rem">

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

      </DataTable>

    </div>
  </div>
</template>

<script setup>

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Badge from 'primevue/badge';
import AutoComplete from 'primevue/autocomplete';

import Checkbox from 'primevue/checkbox';


import { ref, } from "vue";


const checked1 = ref(false);




const filteredTags = ref();




const visible = ref(false);
const tableData =
  ref([
    { nomeTag: 'Geral', tagsFontes: [], filtros: [] },
    { nomeTag: 'Celular', tagsFontes: [{ nomeTag: 'Geral' }], filtros: [{ tipoFiltro: 'Descricao', filtro: 'TIM' }] },

    { nomeTag: 'Deso', tagsFontes: [{ nomeTag: 'Geral' }], filtros: [{ tipoFiltro: 'Descricao', filtro: 'Deso S.A.' }] },
    { nomeTag: 'Fixas', tagsFontes: [{ nomeTag: 'Deso' }, { nomeTag: 'Celular' }], filtros: [] },
    { nomeTag: 'PostosPiranema', tagsFontes: [{ nomeTag: 'Geral' }], filtros: [{ tipoFiltro: 'Descricao', filtro: 'PostosPiranema' }] },
    { nomeTag: 'Forneria', tagsFontes: [{ nomeTag: 'PostosPiranema' }], filtros: [{ tipoFiltro: 'Valor', filtro: 'valor>200' }] },
    { nomeTag: 'Gasolina', tagsFontes: [{ nomeTag: 'Geral' }], filtros: [{ tipoFiltro: 'Valor', filtro: 'valor<200' }, { tipoFiltro: 'Descricao', filtro: 'PostosPiranema' }] },
    { nomeTag: 'Final do Mes', tagsFontes: [{ nomeTag: 'Geral' }], filtros: [{ tipoFiltro: 'Data', filtro: 'data>25' }] }
  ]);

const getSeverity = (filtro) => {
  switch (filtro.tipoFiltro) {
    case 'Valor':
      return 'success';

    case 'Descricao':
      return 'warning';

    case 'Data':
      return 'danger';

    default:
      return null;
  }
};


const value = ref("");
const items = ref([]);

const search1 = () => {
  items.value = tableData.value.map((item) => item.nomeTag);
}
const search = (event) => {
  if (!event.query.trim().length) {
    filteredTags.value = tableData.value.map((item) => item.nomeTag);
  } else {
    filteredTags.value = tableData.value.filter((tag) => {
      return tag.nomeTag.startsWith(event.query);
    });
  }

}





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
