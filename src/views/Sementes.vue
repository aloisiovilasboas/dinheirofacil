<template>
  <div class="flex flex-column ">
    <TabView>

      <TabPanel header="Estoque Sementes">

        <Toolbar class="mb-4">
          <template #start>
            <Button label="Semente" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewSemente" />
            <MultiSelect id="multiselectSemente" :modelValue="selectedColunasSementes" :options="colunasSementes"
              optionLabel="header" @update:modelValue="onToggleSemente" display="chip"
              placeholder="Colunas Selecionadas" />

          </template>
        </Toolbar>

        <!-- div abaixo no centro da tela com width 100%-->
        <div class="flex justify-content-center  w-full">
          <!-- tabela no centro da tela e com a largura apenas necessária para o conteudo -->
          <DataTable lazy: true sortField="microverde" :sortOrder="1" :size=small :value="sementesStore.sementes"
            dataKey="id" @sort="triggerSort($event)" style="width: fit-content;"
            class="flex flex-column justify-center items-center">
            <template #header>

              <div style="text-align: left;">

              </div>
            </template>
            <Column :exportable="false" style="min-width:5rem">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                  @click="editSemente(slotProps.data)" />
                <Button icon="pi pi-trash" rounded severity="secondary" @click="confirmDeleteSemente(slotProps.data)" />
              </template>
            </Column>
            <!-- width fit-content nas colunas abaixo -->
            <Column v-for="col of selectedColunasSementes" :key="col.field" :field="col.field" sortable
              :header="col.header" style="min-width: 5rem; text-align: center; width: fit-content;
               ">
              <template #body="{ data, field }" v-if="col.field == 'especSemente'">
                {{ achaEspec(data[field]) }}
              </template>
              <template #body="{ data, field }" v-else-if="col.field == 'created'">
                <!-- Se for a coluna created apresente o Timestamp em formato de data -->
                {{ converteTimestamp(data[field]) }}
              </template>
              <template v-else-if="col.field == 'disponivel'" #body="{ data, field }">
                <template v-if="data[field]">
                  <span class="p-tag p-tag-success">Disponível</span>
                </template>
                <template v-else>
                  <span class="p-tag p-tag-danger">Indisponível</span>
                </template>
              </template>
              <template v-else-if="col.field == 'percentualICMS'" #body="{ data, field }">
                {{ data[field] }} %
              </template>
              <template v-else-if="col.field == 'valorBruto'" #body="{ data, field }">
                {{ toBRL(data[field]) }}
              </template>

              <template v-else-if="col.field == 'valorFinal'" #body="{ data, field }">

                {{ toBRL((data.valorBruto * (1 + data.percentualICMS / 100)).toFixed(2)) }}
              </template>

              <template v-else #body="{ data, field }">
                {{ data[field] }}
              </template>
            </Column>
            <!-- coluna com o valor final calculado pelo percentual de ICMS -->



          </DataTable>


        </div>
      </TabPanel>


      <TabPanel header="Especificações" :disabled="false">

        <Toolbar class="mb-4">
          <template #start>
            <Button label="Especificação" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewEspec" />
            <MultiSelect id="multiselectEspec" :modelValue="selectedEspecColumns" :options="colunasEspecSementes"
              optionLabel="header" @update:modelValue="onToggleEspec" display="chip"
              placeholder="Colunas Selecionadas" />
          </template>
        </Toolbar>
        <div class="flex justify-content-center  w-full">
          <DataTable sortField="microverde" :sortOrder="1" :size=small :value="sementesStore.especSementes" dataKey="id"
            style="width: fit-content;" class="flex flex-column justify-center items-center">
            <template #header>

              <div style="text-align: left;">

              </div>
            </template>
            <Column :exportable="false" style="min-width:5rem">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                  @click="editEspec(slotProps.data)" />
                <Button icon="pi pi-trash" rounded severity="secondary" @click="confirmDeleteEspec(slotProps.data)" />
              </template>
            </Column>
            <Column v-for=" col of selectedEspecColumns " :key="col.field" :field="col.field" sortable
              :header="col.header" style="min-width: 5rem; text-align: center;">

            </Column>

            <!--  <Column :rowEditor="true" style="width: 10%; min-width: 5rem" bodyStyle="text-align:center"></Column> -->

          </DataTable>
        </div>
      </TabPanel>
    </TabView>
  </div>

  <div>
    <Dialog v-model:visible="sementeDialog" :style="{ width: '450px' }" header="Nova semente" :modal="true"
      class="p-fluid">
      <div class="field">
        <label for="created">Data de Inclusão</label>
        <Calendar id="created" v-model="sementedodialog.created" required="true" autofocus dateFormat="dd/mm/yy"
          :invalid="submitted && !sementedodialog.created" />
        <small class="p-error" v-if="submitted && !sementedodialog.created">Esse campo não pode ficar em
          branco</small>
      </div>

      <div class="field">
        <label for="microverde">Microverde</label>
        <InputText id="microverde" v-model.trim="sementedodialog.microverde" required="true" autofocus
          :invalid="submitted && !sementedodialog.microverde" />
        <small class="p-error" v-if="submitted && !sementedodialog.microverde">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="especSemente"> Especificação </label>
        <Dropdown id="especSemente" v-model="sementedodialog.especSemente" filter :options="sementesStore.especSementes"
          optionLabel="microverde" placeholder="Selecione uma especificação"
          :invalid="submitted && !sementedodialog.especSemente" />

        <small class="p-error" v-if="submitted && !sementedodialog.especSemente">Esse campo não pode ficar em
          branco</small>

      </div>
      <div class="field">
        <label for="fornecedor">Fornecedor</label>
        <InputText id="fornecedor" v-model.trim="sementedodialog.fornecedor" required="true" autofocus
          :invalid="submitted && !sementedodialog.fornecedor" />
        <small class="p-error" v-if="submitted && !sementedodialog.fornecedor">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field" v-if="ehEdit">
        <label for="disponivel"> Disponível </label>
        <Dropdown id="disponivel" v-model="sementedodialog.disponivel" :options="disponivelList" optionLabel="label"
          optionValue="value" :invalid="submitted && !sementedodialog.disponivel" />
        <small class="p-error" v-if="submitted && !sementedodialog.disponivel">Esse campo não pode ficar em
          branco</small>
      </div>

      <div class="field">
        <label for="valorBruto">Preço</label>
        <InputNumber id="valorBruto" v-model="sementedodialog.valorBruto" required="true" autofocus
          :invalid="submitted && !sementedodialog.valorBruto" inputId="minmaxfraction" :minFractionDigits="2"
          :maxFractionDigits="2" />
        <small class="p-error" v-if="submitted && !sementedodialog.valorBruto">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="percentualICMS">Percentual ICMS</label>
        <InputNumber id="percentualICMS" v-model="sementedodialog.percentualICMS" required="true" autofocus
          :invalid="submitted && !sementedodialog.percentualICMS" suffix="%" />
        <small class="p-error" v-if="submitted && !sementedodialog.percentualICMS">Esse campo não pode ficar em
          branco</small>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogSemente" />
        <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaSemente" />
      </template>


    </Dialog>

  </div>

  <div>
    <Dialog v-model:visible="especDialog" :style="{ width: '450px' }" header="Nova especificação" :modal="true"
      class="p-fluid">



      <div class="field">
        <label for="microverde">Microverde</label>
        <InputText id="microverde" v-model.trim="especdodialog.microverde" required="true" autofocus
          :invalid="submitted && !especdodialog.microverde" />
        <small class="p-error" v-if="submitted && !especdodialog.microverde">Esse campo não pode ficar em
          branco</small>
      </div>

      <div class="field">
        <label for="diasEmPilha">Dias em Pilha</label>
        <InputNumber id="diasEmPilha" v-model="especdodialog.diasEmPilha" required="true" autofocus
          :invalid="submitted && !especdodialog.diasEmPilha" />
        <small class="p-error" v-if="submitted && !especdodialog.diasEmPilha">Esse campo não pode ficar em
          branco</small>
      </div>

      <div class="field">
        <label for="blackout">Blackout</label>
        <InputNumber id="blackout" v-model="especdodialog.blackout" required="true" autofocus
          :invalid="submitted && !especdodialog.blackout" />
        <small class="p-error" v-if="submitted && !especdodialog.blackout">Esse campo não pode ficar em branco</small>
      </div>

      <div class="field">
        <label for="diasAteAColheita">Dias até a colheita</label>
        <InputNumber id="diasAteAColheita" v-model="especdodialog.diasAteAColheita" required="true" autofocus
          :invalid="submitted && !especdodialog.diasAteAColheita" />
        <small class="p-error" v-if="submitted && !especdodialog.diasAteAColheita">Esse campo não pode ficar em
          branco</small>
      </div>

      <div class="field">
        <label for="gramasBandejaPlantio">Gramas para plantio</label>
        <InputNumber id="gramasBandejaPlantio" v-model="especdodialog.gramasBandejaPlantio" required="true" autofocus
          :invalid="submitted && !especdodialog.gramasBandejaPlantio" />
        <small class="p-error" v-if="submitted && !especdodialog.gramasBandejaPlantio">Esse campo não pode ficar em
          branco</small>
      </div>

      <div class="field">
        <label for="gramasBandejaPlantio">Produção estimada por bandeja</label>
        <InputNumber id="gramasBandejaPlantio" v-model="especdodialog.gramasBandejaProducao" required="true" autofocus
          :invalid="submitted && !especdodialog.gramasBandejaProducao" />
        <small class="p-error" v-if="submitted && !especdodialog.gramasBandejaProducao">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="hidratacao"> Hidratação </label>
        <Dropdown id="hidratacao" v-model="especdodialog.hidratacao" filter :options="hidratacaoList"
          optionLabel="label" optionValue="value" placeholder="Hidratação"
          :invalid="submitted && !especdodialog.hidratacao" />
        <small class="p-error" v-if="submitted && !especdodialog.hidratacao">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="peso"> Peso </label>
        <Dropdown id="peso" v-model="especdodialog.peso" filter :options="pesoList" optionLabel="label"
          optionValue="value" placeholder="Peso" :invalid="submitted && !especdodialog.peso" />
        <small class="p-error" v-if="submitted && !especdodialog.peso">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="cobertura"> Cobertura com Substrato </label>
        <Dropdown id="cobertura" v-model="especdodialog.cobertura" filter :options="simOuNaoList" optionLabel="label"
          optionValue="value" placeholder="Cobertura" :invalid="submitted && !especdodialog.cobertura" />
        <small class="p-error" v-if="submitted && !especdodialog.cobertura">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="distincao"> Distinção </label>
        <Dropdown id="distincao" v-model="especdodialog.distincao" filter :options="distincaoList" optionLabel="label"
          optionValue="value" placeholder="Distinção" :invalid="submitted && !especdodialog.distincao" />
        <small class="p-error" v-if="submitted && !especdodialog.distincao">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="mix"> Mix </label>
        <InputText id="mix" v-model.trim="especdodialog.mix" required="true" autofocus
          :invalid="submitted && !especdodialog.mix" />
        <small class="p-error" v-if="submitted && !especdodialog.mix">Esse campo não pode ficar em branco</small>
      </div>










      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogEspec" />
        <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaEspec" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteSementeDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="sementedodialog">Tem certeza que deseja deletar <b>{{ sementedodialog.microverde }}</b>?</span>
      </div>
      <template #footer>
        <Button label="Não" icon="pi pi-times" text @click="deleteSementeDialog = false" />
        <Button label="Sim" icon="pi pi-check" text @click="deleteSemente" />
      </template>
    </Dialog>


    <Dialog v-model:visible="deleteEspecDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="especdodialog">Tem certeza que deseja deletar <b>{{ especdodialog.microverde }}</b>?</span>
      </div>
      <template #footer>
        <Button label="Não" icon="pi pi-times" text @click="deleteEspecDialog = false" />
        <Button label="Sim" icon="pi pi-check" text @click="deleteEspec" />
      </template>
    </Dialog>




  </div>


</template>

<script setup>


import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Toolbar from 'primevue/toolbar';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';


import { Timestamp } from 'firebase/firestore';

import { useSementesStore } from '../stores/sementes';




import { onBeforeMount, onUpdated, ref, watch } from 'vue';



const triggerSort = (event) => {
  /* console.log(
    event
  ); */
  /* const header = event.target.closest(".p-sortable-column");
  header.click(); */
};

const ehEdit = ref(false);
const selectedEspec = ref();

const especdodialog = ref({});
const sementedodialog = ref({ microverde: '' });

const especDialog = ref(false);
const sementeDialog = ref(false);

const submitted = ref(false);

const deleteEspecDialog = ref(false);
const deleteSementeDialog = ref(false);

const hidratacaoList = ref([
  { label: 'Irrigação ', value: 'Irrigação' },
  { label: 'Aspersão ', value: 'Aspersão' }
]);

const simOuNaoList = ref([
  { label: 'Sim ', value: 'Sim' },
  { label: 'Não', value: 'Não' },


]);

const pesoList = ref([
  { label: 'Com', value: 'Com' },
  { label: 'Sem', value: 'Sem' }
]);

const distincaoList = ref([
  { label: 'Gourmet ', value: 'Gourmet ' },
  { label: 'Premium', value: 'Premium' }
]);




const editSemente = (semente) => {
  ehEdit.value = true;
  sementedodialog.value = { ...semente };
  if (sementedodialog.value.created) { sementedodialog.value.created = sementedodialog.value.created.toDate(); }
  else { sementedodialog.value.created = new Date(); }

  sementeDialog.value = true;
};

const editEspec = (espec) => {
  ehEdit.value = true;
  especdodialog.value = { ...espec };
  especDialog.value = true;
};

const small = ref('small');

const openNewSemente = () => {
  ehEdit.value = false;
  sementedodialog.value = {};
  submitted.value = false;
  sementeDialog.value = true;
};

const openNewEspec = () => {
  ehEdit.value = false;
  especdodialog.value = {};
  submitted.value = false;
  especDialog.value = true;
};

const sementevalido = () => {
  return sementedodialog.value.microverde !== '' &&
    sementedodialog.value.microverde !== null &&
    sementedodialog.value.fornecedor !== '' &&
    sementedodialog.value.fornecedor !== null &&
    sementedodialog.value.valorBruto !== '' &&
    sementedodialog.value.valorBruto !== null &&
    sementedodialog.value.percentualICMS !== '' &&
    sementedodialog.value.percentualICMS !== null;
};

const especvalido = () => {
  return especdodialog.value.microverde !== '' &&
    especdodialog.value.microverde !== null &&
    especdodialog.value.diasEmPilha !== '' &&
    especdodialog.value.diasEmPilha !== null &&
    especdodialog.value.blackout !== '' &&
    especdodialog.value.blackout !== null &&
    especdodialog.value.diasAteAColheita !== '' &&
    especdodialog.value.diasAteAColheita !== null &&
    especdodialog.value.gramasBandejaPlantio !== ''
    && especdodialog.value.gramasBandejaPlantio !== null;
};


const salvarNovaSemente = () => {
  submitted.value = true;
  if (sementevalido()) {
    sementedodialog.value.created = Timestamp.fromDate(sementedodialog.value.created);
    ehEdit.value ? sementesStore.setaSemente(sementedodialog.value) : sementesStore.addSemente(sementedodialog.value);
    sementeDialog.value = false;
    sementedodialog.value = {};
    submitted.value = false;
  }
  // salva novasemente no banco e fecha o dialog
};

const salvarNovaEspec = () => {
  submitted.value = true;
  if (especvalido()) {

    ehEdit.value ? sementesStore.setaEspecSemente(especdodialog.value) : sementesStore.addEspecSemente(especdodialog.value);
    especDialog.value = false;
    especdodialog.value = {};
    submitted.value = false;
  }
  // salva novaespec no banco e fecha o dialog


};

const hideDialogSemente = () => {
  sementeDialog.value = false;
  sementedodialog.value = {};
};

const hideDialogEspec = () => {
  especDialog.value = false;
  especdodialog.value = {};
};

const confirmDeleteSemente = (semente) => {
  sementedodialog.value = semente;
  deleteSementeDialog.value = true;
};

const confirmDeleteEspec = (es) => {
  especdodialog.value = es;
  deleteEspecDialog.value = true;
};

const deleteSemente = () => {

  deleteSementeDialog.value = false;
  sementesStore.deletaSemente(sementedodialog.value)
  sementedodialog.value = {};
};

const deleteEspec = () => {

  deleteEspecDialog.value = false;
  sementesStore.deletaEspecSemente(especdodialog.value)
  especdodialog.value = {};
};

const disponivelList = ref([
  { label: 'Disponível', value: true },
  { label: 'Indisponível', value: false }
]);

const sementesStore = useSementesStore();

const colunasSementes = ref([
  { field: 'created', header: 'Data de Inclusão' },
  { field: 'microverde', header: 'Microverde' },
  { field: 'fornecedor', header: 'Fornecedor' },
  { field: 'disponivel', header: 'Disponível' },
  { field: 'valorFinal', header: 'Valor Total' },
  { field: 'valorBruto', header: 'Valor' },
  { field: 'percentualICMS', header: '% ICMS' },
  { field: 'especSemente', header: 'Especificação' },


]);

// selectedColunasSementes com as mesmas colunas de colunasSementes retirando as colunas: porcentualICMS, especSemente e valorBruto
const selectedColunasSementes = ref(colunasSementes.value.slice(0, 5));

const colunasEspecSementes = ref([
  { field: 'microverde', header: 'Microverde' },
  { field: 'diasEmPilha', header: 'Dias em Pilha' },
  { field: 'blackout', header: 'Blackout' },
  { field: 'diasAteAColheita', header: 'Dias até a colheita' },
  { field: 'gramasBandejaPlantio', header: 'Gramas para plantio' },
  { field: 'hidratacao', header: 'Hidratação' },
  { field: 'peso', header: 'Peso' },
  { field: 'cobertura', header: 'Cobertura com Substrato' },
  { field: 'distincao', header: 'Distinção' },
  { field: 'mix', header: 'Mix' }
]);

// selectedEspecColumns com as mesmas colunas de colunasEspecSementes retirando as ultimas 6 colunas
const selectedEspecColumns = ref(colunasEspecSementes.value.slice(0, 4));

const onToggleEspec = (val) => {
  selectedEspecColumns.value = colunasEspecSementes.value.filter(col => val.includes(col));
};

const onToggleSemente = (val) => {
  selectedColunasSementes.value = colunasSementes.value.filter(col => val.includes(col));
};
/* const editingRows = ref([]); */

/* function onRowEditSave(event) {
  let { newData } = event;
  sementesStore.setaEspecSemente(newData);
} */

const achaEspec = (espec) => {
  if (espec.microverde) {

    return espec.microverde;
  }
  else {
    return '';
  }
};

const converteTimestamp = (timestamp) => {
  if (!timestamp) return '';
  else {
    let date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  }

};

const toBRL = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};



onBeforeMount(() => {
  sementesStore.fetchSementes();
  sementesStore.fetchEspecSementes();

});

/* onUpdated(() => {
//  sementesStore.fetchSementes();
//  sementesStore.fetchEspecSementes();
});
 */
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
