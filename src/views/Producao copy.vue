<template>
  <div class="flex flex-column ">
    <Button label="Novo Bloco" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewBloco" />

    <div v-for="bloco in blocosStore.blocos">
      <Divider type="dashed" />
      <Card>
        <template #title class="flex flex-column">{{ bloco.nome }}
          <div class="flex flex-row-reverse">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-plain"
              @click="editBloco(bloco)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-plain"
              @click="confirmDeleteBloco(bloco)" />
          </div>
        </template>

        <template #content>
          <!-- CRUD Lotes -->
          <DataTable>
            <DataTable sortField="microverde" :sortOrder="1" :size=small :value="sementesStore.sementes" dataKey="id">
              <Column v-for="col of colunasSementes" :key="col.field" :field="col.field" sortable :header="col.header"
                style="min-width: 5rem; text-align: center;">
              </Column>
              <Column :exportable="false" style="min-width:5rem">
                <template #body="slotProps">
                  <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                    @click="editSemente(slotProps.data)" />
                  <Button icon="pi pi-trash" rounded severity="secondary"
                    @click="confirmDeleteSemente(slotProps.data)" />
                </template>
              </Column>
            </DataTable>


          </DataTable>

        </template>
        <template #footer>
          <Toolbar class="mb-4">
            <template #start>
              <Button label="Novo Lote" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewLote" />

            </template>
          </Toolbar>
        </template>
      </Card>

    </div>



    <!--  <Toolbar class="mb-4">
      <template #start>

      </template>
    </Toolbar>
 -->
  </div>

  <div>

    <Dialog v-model:visible="blocoDialog" :style="{ width: '450px' }" header="Novo Bloco" :modal="true" class="p-fluid">

      <div class="field">
        <label for="icondisplay" class="font-bold block mb-2"> Insira o nome do bloco </label>


        <InputText id="bloco" v-model.trim="blocododialog.nome" required="true" autofocus
          :invalid="submitted && !blocododialog.nome" />
        <small class="p-error" v-if="submitted && !blocododialog.nome">Esse campo não pode ficar em
          branco</small>


      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogBloco" />
        <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaBloco" />
      </template>


    </Dialog>

    <Dialog v-model:visible="deleteBlocoDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="blocododialog">Tem certeza que deseja deletar o bloco <b>{{ blocododialog.nome }}</b>?</span>
      </div>
      <template #footer>
        <Button label="Não" icon="pi pi-times" text @click="deleteBlocoDialog = false" />
        <Button label="Sim" icon="pi pi-check" text @click="deleteBloco" />
      </template>
    </Dialog>

  </div>

  <div>

    <Dialog v-model:visible="loteDialog" :style="{ width: '450px' }" header="Novo Lote" :modal="true" class="p-fluid">


      <div class="field">
        <label for="nome">Nome do lote</label>
        <InputText id="nome" v-model.trim="lotedodialog.nome" required="true" autofocus
          :invalid="submitted && !lotedodialog.nome" />
        <small class="p-error" v-if="submitted && !lotedodialog.nome">Esse campo não pode ficar em branco</small>
      </div>

      <div class="center">
        <Button icon="pi pi-plus" rounded outlined aria-label="Filter" @click="addplantio" />
      </div>
      <Card v-for="plantio in plantiosdoDialog" class="cardPlantio">
        <!-- <template #title>Plantios

        </template> -->
        <template #content>
          #seleciona Semente
          <div class="field">
            <label for="microverde">Semente</label>
            <Dropdown v-model="plantio.semente" :options="sementesStore.sementes" optionLabel="microverde"
              placeholder="Selecione o tipo de lote" checkmark :highlightOnSelect="false" />
            <small class="p-error" v-if="submitted && !lotedodialog.tipo">Esse campo não pode ficar em
              branco</small>
          </div>
          <div class="field">
            <label for="data">Data da colheita</label>
            <Calendar id="data" v-model="lotedodialog.data" required="true"
              :invalid="submitted && !lotedodialog.data" />
            <small class="p-error" v-if="submitted && !lotedodialog.data">Esse campo não pode ficar em branco</small>
          </div>

          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae
            numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse,
            cupiditate neque
            quas!
          </p>
        </template>
      </Card>

      <!-- <div class="field">
        <label for="microverde">Semente</label>
        <Dropdown v-model="selectedTipoLote" :options="optionsLote" optionLabel="tipo"
          placeholder="Selecione o tipo de lote" checkmark :highlightOnSelect="false" />
        <small class="p-error" v-if="submitted && !lotedodialog.tipo">Esse campo não pode ficar em
          branco</small>
      </div> -->


      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogSemente" />
        <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaSemente" />
      </template>


    </Dialog>

  </div>




</template>

<script setup>


import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Toolbar from 'primevue/toolbar';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Divider from 'primevue/divider';




import { useSementesStore } from '../stores/sementes';
import { useBlocosStore } from '../stores/blocos';




import { onBeforeMount, onUpdated, ref, watch } from 'vue';




const selectedTipoLote = ref();
const selectedEspec = ref();
const databloco = ref();

const optionsLote = ref([{ tipo: 'Mix' }, { tipo: 'Microverde' },])



const ehEdit = ref(false);
const ehEditBloco = ref(false);
const ehEditLote = ref(false);

const blocododialog = ref({});
const lotedodialog = ref({});

const blocoDialog = ref(false);
const loteDialog = ref(false);

const submitted = ref(false);

const deleteEspecDialog = ref(false);
const deleteBlocoDialog = ref(false);
const plantiosdoDialog = ref([]);



const small = ref('small');



const openNewBloco = () => {
  ehEditBloco.value = false;
  blocododialog.value = {};
  submitted.value = false;
  blocoDialog.value = true;
};

const openNewLote = () => {
  ehEditLote.value = false;
  lotedodialog.value = {};
  submitted.value = false;
  loteDialog.value = true;
};


const blocovalido = () => {
  return blocododialog.value.nome !== '' &&
    blocododialog.value.nome !== null;
};




const salvarNovaBloco = () => {
  submitted.value = true;
  if (blocovalido()) {
    ehEditBloco.value ? blocosStore.setaBloco(blocododialog.value) : blocosStore.addBloco(blocododialog.value);
    blocoDialog.value = false;
    blocododialog.value = {};
    submitted.value = false;
  }
  // salva novabloco no banco e fecha o dialog
};

const editBloco = (b) => {
  ehEditBloco.value = true;
  blocododialog.value = { ...b };
  blocoDialog.value = true;
};

const confirmDeleteBloco = (b) => {
  blocododialog.value = b;
  deleteBlocoDialog.value = true;
};

const deleteBloco = () => {

  deleteBlocoDialog.value = false;
  blocosStore.deletaBloco(blocododialog.value)
  blocododialog.value = {};
};

const hideDialogBloco = () => {
  blocoDialog.value = false;
  blocododialog.value = {};
};

const addplantio = () => {
  plantiosdoDialog.value.push({ semente: { microverde: '' }, espec: { microverde: '' }, dataColheita: '', numBandejas: '' });
};


const sementesStore = useSementesStore();
const blocosStore = useBlocosStore();


onBeforeMount(() => {
  sementesStore.fetchSementes();
  blocosStore.fetchBlocos();
  sementesStore.fetchEspecSementes();

});

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
