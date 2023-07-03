<template>
  <div class="about">
    <h1>Categorias</h1>

    <div class="card flex justify-content-center">
      <Button label="Show" icon="pi pi-external-link" @click="visible = true" />
      <Dialog v-model:visible="visible" modal header="Header" :style="{ width: '50vw' }">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
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

import { ref } from "vue";

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
