<template>
  <div class="flex top-50">
    <TabView>
      <TabPanel header="Usuários">
        <div>
          <DataTable :value="usuariosStore.usuarios" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]">
            <Column field="email" header="email"></Column>
            <Column field="nome" header="nome"></Column>
            <Column field="telefone" header="telefone"></Column>


            <Column header="admin" :exportable="false" style="min-width:8rem">
              <template #body="slotProps">
                <Button v-if="slotProps.data.admin != true" icon="pi pi-circle"
                  class="p-button-rounded p-button-warning" @click="toggleAdmin(slotProps.data)" />
                <Button v-if="slotProps.data.admin == true" icon="pi pi-circle-fill"
                  class="p-button-rounded p-button-warning" @click="toggleAdmin(slotProps.data)" />
              </template>
            </Column>

            <Column header="apto" :exportable="false" style="min-width:8rem">
              <template #body="slotProps">
                <Button v-if="slotProps.data.apto != true" icon="pi pi-circle" class="p-button-rounded p-button-warning"
                  @click="toggleApto(slotProps.data)" />
                <Button v-if="slotProps.data.apto == true" icon="pi pi-circle-fill"
                  class="p-button-rounded p-button-warning" @click="toggleApto(slotProps.data)" />
              </template>
            </Column>



          </DataTable>
        </div>
      </TabPanel>

    </TabView>
  </div>
</template>

<script setup>


import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

import { useSementesStore } from '../stores/sementes';
import { useUsuariosStore } from '../stores/usuarios';



import { onBeforeMount, onUpdated } from 'vue';

import Checkbox from 'primevue/checkbox';


const sementesStore = useSementesStore();
const usuariosStore = useUsuariosStore();

onBeforeMount(() => {
  sementesStore.fetchSementes();
  usuariosStore.fetchUsuarios();
});

onUpdated(() => {
  sementesStore.fetchSementes();
  usuariosStore.fetchUsuarios();
});

const toggleApto = (usuario) => {


  const novoApto = !usuario.apto;
  try {
    usuariosStore.setaUsuarioApto(usuario, novoApto);
  } catch (error) {
    alert(error);
  }
  usuariosStore.setaUsuarioApto(usuario, novoApto);
  ;
}

const toggleAdmin = (usuario) => {


  const novoAdmin = !usuario.admin;
  usuariosStore.setaUsuarioAdmin(usuario, novoAdmin);
  ;
}
</script>

<style>
@media (min-width: 1024px) {
  .admin {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
