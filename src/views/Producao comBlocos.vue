<template>
  <div class="flex flex-column " style="min-width: 700px;">
    <TabView>
      <TabPanel header="Lotes">
        <div class="grid grid-cols-2">
          <div class="flex flex-column ">
            <Button label="Novo Lote" icon="pi pi-plus" class="mr-2" @click="openNewLote" />
          </div>
          <div class="flex flex-column " v-if="false">
            <Button label="Novo Bloco" icon="pi pi-plus" class="mr-2" @click="insertBloco" />
          </div>
        </div>

        <div>
          <Dialog v-model:visible="insertblocodialog" :style="{ width: '70%' }" header="Inserir Bloco" :modal="true"
            class="p-fluid">

            <div class="field">
              <label for="nome">Nome do bloco</label>
              <Dropdown v-model="insertblocododialog.bloco" :options="blocosStore.blocos" optionLabel="nome" checkmark
                :highlightOnSelect="false" />
              <small class="p-error" v-if="submitted && !insertblocododialog.bloco">Esse campo não pode ficar em
                branco</small>
            </div>

            <div v-if="insertblocododialog.bloco">
              <Card class="cardPlantio">
                <template #content>
                  <div v-for="plantio in insertblocododialog.bloco.plantios" :key="plantio.id" style="padding: 1em;"
                    class="grid">
                    <span style="padding: 0.5em" class="col">{{ plantio.dia }} </span>
                    <span style="padding: 0.5em" class="col">{{ plantio.especSemente.microverde }} </span>

                    <span style="padding: 0.5em; white-space: nowrap;" class="col">{{ plantio.numBandejas +
                      'bandeja(s)' }}
                    </span>
                    <span class="col">
                      <!--  <label for="semente">Semente</label> -->
                      <Dropdown v-model="plantio.semente" :options="sementesStore.sementes" placeholder="Semente"
                        optionLabel=microverde checkmark :highlightOnSelect="false" />
                      <small class="p-error" v-if="submitted && !plantio.semente">Esse campo não pode ficar em
                        branco</small>
                    </span>
                  </div>
                </template>
              </Card>

            </div>

            <div class="field">
              <label for="data">Domingo da Semana de Colheita</label>
              <Calendar id="data" :showWeek="true" v-model="insertblocododialog.dataColheita"
                :disabledDays="[1, 2, 3, 4, 5, 6]" required="true"
                :invalid="submitted && !insertblocododialog.dataColheita">
                <!-- <template #date="slotProps">
                  <span>{{ slotProps }}</span>

                </template> -->

                <!-- <template #day="slotProps">
                  <span v-if="slotProps.day > 0">{{ slotProps.day }}</span>
                  <template v-else> <span>&nbsp;</span> </template>
                </template> -->
                <template #weekheaderlabel>
                  <span>N° Semana</span>
                </template>
              </Calendar>
              <small class="p-error" v-if="submitted && !insertblocododialog.dataColheita">Esse campo não pode ficar em
                branco</small>
            </div>

            <template #footer>
              <Button label="Cancelar" icon="pi pi-times" text @click="hideInsertBlocoDialog" />
              <Button label="Salvar" icon="pi pi-check" text @click="salvarInsertBloco" />
            </template>


          </Dialog>

        </div>



        <!--  <div class="flex flex-column ">
          <Button label="Novo Lote" icon="pi pi-plus" class="mr-2" @click="openNewLote" />
        </div>
        <span style="padding: 1em;"> </span>
        <div class="flex flex-column ">
          <Button label="Incluir Bloco" icon="pi pi-plus" class="mr-2" @click="openNewLote" />
        </div> -->
        <div style="padding-top: 1rem;">
          <label for="mescol">Mês: </label>
          <Calendar v-model="mes" view="month" id="mescol" dateFormat="mm/yy" placeholder="Selecione o Mês" />
        </div>
        <div>
          <div>
            <TabView class="flex flex-column">
              <TabPanel v-for="semana in semanasDoMesSelecionado" :key="semana.domingo" :header="semana.titulo">
                <div class="flex flex-row flex-wrap">
                  <div v-for="(data, index) in semana.dias" class="flex flex-column" style="width: 14.28%">
                    <div>

                      <span class="word-data">
                        {{ new Date(semana.domingo.getTime() + (24 * 60 * 60 * 1000) * index).toLocaleDateString()
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-row flex-wrap">
                  <div v-for="dia in dias" :key="dia.dia" class="flex flex-column" style="width: 14.28%">
                    <div>
                      <span class="word-acao">
                        {{ dia.dia }}
                      </span>
                    </div>
                  </div>
                </div>
                <Divider> </Divider>
                <div class="flex flex-row flex-wrap">
                  <div v-for="(dia, index) in semana.dias" :key="dia" class="flex flex-column" style="width: 14.28%">
                    <div style="padding: 0.2rem">
                      <Button
                        @click="openNewLoteSimples(dia, new Date(semana.domingo.getTime() + (24 * 60 * 60 * 1000) * index))"
                        small icon="pi pi-plus" rounded outlined aria-label="Filter" />
                    </div>
                    <div v-for="acao in semana.dias[index]" :key="acao" style="padding: 0.5rem;">
                      <div @click="clickTarefaCard(acao)" class="cardTarefas"
                        :style="{ 'background-color': achaBG(acao.acao) }">
                        <span class="word-large">{{ acao.plantio }}</span>
                        <span class="word-small">{{ acao.lote }}</span>
                        <span class="word-acao">{{ acao.acao }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

            </TabView>
          </div>
        </div>
        <div>
          <Dialog v-model:visible="loteSimplesDialog" :style="{ width: '70%' }" header="Nova Colheita" :modal="true"
            class="p-fluid">
            <template #header>
              <h3>
                Nova Produção para
                {{ lotesimplesdodialog.data.toLocaleDateString() }}
              </h3>
            </template>

            <div class="field">
              <label for="nome">Nome do Lote</label>
              <InputText id="nome" v-model.trim="lotesimplesdodialog.nome" required="true" autofocus
                :invalid="submitted && !lotesimplesdodialog.nome" />
              <small class="p-error" v-if="submitted && !lotesimplesdodialog.nome">Esse campo não pode ficar em
                branco</small>
            </div>
            <div class="field">
              <label for="microverde">Colheita ou Semeadura</label>
              <Dropdown v-model="lotesimplesdodialog.tipo" :options="tipos" option-label="tipo" option-value="tipo"
                placeholder="Colheita" checkmark :highlightOnSelect="false" />
              <small class="p-error" v-if="submitted && !lotesimplesdodialog.tipo">Esse campo não pode ficar em
                branco</small>
            </div>
            <Card v-for="plantio in plantiosdoDialogsimples" class="cardPlantio">
              <template #header>
                <div class="p-d-flex p-jc-between ">

                  <Button icon="pi pi-times" outlined class="p-button-rounded  p-button-contrast"
                    @click="removeplantiosimples(plantio)" aria-label="Filter" />
                </div>
              </template>
              <template #content>
                <div class="flex flex-row flex-wrap">
                  <!-- duas colulas -->
                  <div class="flex flex-column">
                    <div class="field">
                      <label for="microverde">Microverde</label>
                      <Dropdown v-model="plantio.semente" :options="sementesStore.sementes" optionLabel="microverde"
                        placeholder="Microverde" checkmark :highlightOnSelect="false" />
                      <small class="p-error" v-if="submitted && !plantio.semente">Esse campo não pode ficar em
                        branco</small>
                    </div>
                    <div class="field">
                      <label for="data">Número de bandejas</label>
                      <InputNumber id="bandejas" v-model="plantio.numBandejas" required="true"
                        :invalid="submitted && !plantio.numBandejas" />

                      <small class="p-error" v-if="submitted && !plantio.numBandejas">Esse campo não pode ficar em
                        branco</small>
                    </div>
                  </div>

                </div>
              </template>
            </Card>
            <div class="center">
              <Button icon="pi pi-plus" label="Adicionar Microverde" rounded outlined aria-label="Filter"
                @click="addplantiosimples" />
            </div>


            <template #footer>
              <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogLoteSimples" />
              <Button label="Salvar" icon="pi pi-check" text @click="salvarNovoLoteSimples" />
            </template>


          </Dialog>

        </div>

        <div>
          <Dialog v-model:visible="loteDialog" :style="{ width: '70%' }" header="Novo Lote" :modal="true"
            class="p-fluid">

            <div class="field">
              <label for="nome">Nome do lote</label>
              <InputText id="nome" v-model.trim="lotedodialog.nome" required="true" autofocus
                :invalid="submitted && !lotedodialog.nome" />
              <small class="p-error" v-if="submitted && !lotedodialog.nome">Esse campo não pode ficar em
                branco</small>
            </div>
            <Card v-for="plantio in plantiosdoDialog" class="cardPlantio">
              <template #header>
                <div class="p-d-flex p-jc-between ">

                  <Button icon="pi pi-times" class="p-button-rounded  p-button-contrast" @click="removeplantio(plantio)"
                    aria-label="Filter" />
                </div>
              </template>
              <template #content>
                <div class="flex flex-row flex-wrap">
                  <!-- duas colulas -->
                  <div class="flex flex-column">
                    <div class="field">
                      <label for="microverde">Microverde</label>
                      <Dropdown v-model="plantio.semente" :options="sementesStore.sementes" optionLabel="microverde"
                        placeholder="Microverde" checkmark :highlightOnSelect="false" />
                      <small class="p-error" v-if="submitted && !plantio.semente">Esse campo não pode ficar em
                        branco</small>
                    </div>
                    <div class="field">
                      <label for="data">Data da colheita</label>
                      <Calendar id="data" v-model="plantio.dataColheita" required="true"
                        :invalid="submitted && !plantio.data" />
                      <small class="p-error" v-if="submitted && !plantio.dataColheita">Esse campo não pode ficar em
                        branco</small>
                    </div>
                    <div class="field">
                      <label for="data">Número de bandejas</label>
                      <InputNumber id="bandejas" v-model="plantio.numBandejas" required="true"
                        :invalid="submitted && !plantio.numBandejas" />

                      <small class="p-error" v-if="submitted && !plantio.numBandejas">Esse campo não pode ficar em
                        branco</small>
                    </div>
                  </div>
                  <!-- <div style="margin: 1rem;" class="flex align-items-left flex-column">
                    <div class="field">
                      <label for="data">Custos de Plantio</label>
                      <div v-for="espec in especsStore.especPlantio" :key="espec.id" class="flex align-items-center">
                        <Checkbox v-model="plantio.selectedCustosPlantio" :inputId="espec.id" name="item"
                          :value="espec.item" />
                        <label :for="espec.id">{{ espec.item }}</label>
                      </div>
                    </div>
                  </div> -->
                </div>
              </template>
            </Card>
            <div class="center">
              <Button icon="pi pi-plus" label="Adicionar Microverde" rounded outlined aria-label="Filter"
                @click="addplantio" />
            </div>

            <template #footer>
              <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogLote" />
              <Button label="Salvar" icon="pi pi-check" text @click="salvarNovoLote" />
            </template>


          </Dialog>

        </div>

      </TabPanel>
      <TabPanel header="Blocos" v-if="false">

        <div class="flex flex-column ">
          <Button label="Cadastrar Novo Bloco" icon="pi pi-plus" class="mr-2" @click="openNewBloco" />
        </div>
        <div>
          <!-- DataTable com os blocos -->
          <DataTable :value="blocosStore.blocos" removableSort dataKey="id">
            <Column field="nome" header="Nome" sortable text-align: left;></Column>
            <Column field="plantios" header="Colheitas" text-align: left;>
              <template #body="slotProps">
                <div v-for="plantio in slotProps.data.plantios" :key="plantio.id">
                  <span style="padding: 1em">{{ plantio.dia }} </span>
                  <span style="padding: 1em">{{ plantio.especSemente.microverde }} </span>
                  <span style="padding: 1em">{{ plantio.numBandejas + ' bandejas' }} </span>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
        <div>
          <Dialog v-model:visible="blocoDialog" :style="{ width: '70%' }" header="Novo Bloco" :modal="true"
            class="p-fluid">

            <div class="field">
              <label for="nome">Nome do Bloco</label>
              <InputText id="nome" v-model.trim="blocododialog.nome" required="true" autofocus
                :invalid="submitted && !blocododialog.nome" />
              <small class="p-error" v-if="submitted && !blocododialog.nome">Esse campo não pode ficar em
                branco</small>
            </div>
            <Card v-for="plantio in plantiosdoDialogBloco" class="cardPlantio">
              <template #header>
                <div class="p-d-flex p-jc-between ">
                  <Button icon="pi pi-times" class="p-button-rounded  p-button-contrast"
                    @click="removeplantiobloco(plantio)" aria-label="Filter" />
                </div>
              </template>
              <template #content>
                <div class="flex flex-row flex-wrap">
                  <!-- duas colulas -->
                  <div class="flex flex-column">
                    <div class="field">
                      <label for="microverde">Microverde</label>
                      <Dropdown v-model="plantio.especSemente" :options="sementesStore.especSementes"
                        optionLabel="microverde" placeholder="Microverde" checkmark :highlightOnSelect="false" />
                      <small class="p-error" v-if="submitted && !plantio.especSemente">Esse campo não pode ficar em
                        branco</small>
                    </div>
                    <div class="field">
                      <label for="data">Dia da colheita</label>
                      <Dropdown v-model="plantio.dia" :options="diasSemana" optionLabel="dia" option-value="dia"
                        checkmark :highlightOnSelect="false" />
                      <small class="p-error" v-if="submitted && !plantio.dia">Esse campo não pode ficar em
                        branco</small>
                    </div>
                    <div class="field">
                      <label for="data">Número de bandejas</label>
                      <InputNumber id="bandejas" v-model="plantio.numBandejas" required="true"
                        :invalid="submitted && !plantio.numBandejas" />

                      <small class="p-error" v-if="submitted && !plantio.numBandejas">Esse campo não pode ficar em
                        branco</small>
                    </div>
                  </div>

                </div>
              </template>
            </Card>
            <div class="center">
              <Button icon="pi pi-plus" label="Adicionar Microverde" rounded outlined aria-label="Filter"
                @click="addplantiobloco" />
            </div>

            <template #footer>
              <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogBloco" />
              <Button label="Salvar" icon="pi pi-check" text @click="salvarNovoBloco" />
            </template>


          </Dialog>

        </div>


      </TabPanel>
      <TabPanel header="Custos Plantio">
        <div>
          <DataTable sortField="item" :sortOrder="1" :size=small :value="especsStore.especPlantio" dataKey="id">


            <Column v-for="col of colunasEspecs" :key="col.field" :field="col.field" sortable :header="col.header"
              style="min-width: 5rem; text-align: left;">
            </Column>
            <!--  <Column :rowEditor="true" style="width: 10%; min-width: 5rem" bodyStyle="text-align:center"></Column> -->
            <Column :exportable="false" style="min-width:5rem">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                  @click="editEspecPlantio(slotProps.data)" />
                <Button icon="pi pi-trash" rounded severity="secondary"
                  @click="confirmDeleteEspecPlantio(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
          <Toolbar class="mb-4">
            <template #start>
              <Button label="Nova" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewEspecPlantio" />
            </template>
          </Toolbar>
        </div>
        <div>
          <Dialog id="plantiodialog" v-model:visible="especDialogPlantio" :style="{ width: '450px' }"
            header="Novo custo de plantio" :modal="true" class="p-fluid">
            <div class="field">
              <label for="item">Item</label>
              <InputText id="item" v-model.trim="especdodialog.item" required="true" autofocus
                :invalid="submitted && !especdodialog.item" />
              <small class="p-error" v-if="submitted && !especdodialog.item">Esse campo não pode ficar em
                branco</small>
            </div>
            <div class="field">
              <label for="valor">Valor</label>
              <InputNumber id="valor" v-model="especdodialog.valor" required="true" mode="currency" currency="BRL"
                locale="pt-BR" autofocus :invalid="submitted && !especdodialog.valor" />
              <small class="p-error" v-if="submitted && !especdodialog.valor">Esse campo não pode ficar em
                branco</small>
            </div>

            <template #footer>
              <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogEspecPlantio" />
              <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaEspecPlantio" />
            </template>
          </Dialog>
          <Dialog v-model:visible="deleteEspecDialogPlantio" :style="{ width: '450px' }" header="Confirmar"
            :modal="true">
            <div class="confirmation-content">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              <span v-if="especdodialog">Tem certeza que deseja deletar <b>{{ especdodialog.item }}</b>?</span>
            </div>
            <template #footer>
              <Button label="Não" icon="pi pi-times" text @click="deleteEspecDialogPlantio = false" />
              <Button label="Sim" icon="pi pi-check" text @click="deleteEspecPlantio" />
            </template>
          </Dialog>
        </div>
      </TabPanel>
      <TabPanel header="Custos Embalagens">

        <div>
          <DataTable sortField="item" :sortOrder="1" :size=small :value="especsStore.especEmbalagens" dataKey="id">
            <Column v-for="col of colunasEspecs" :key="col.field" :field="col.field" sortable :header="col.header"
              style="min-width: 5rem; text-align: left;">
            </Column>
            <!--  <Column :rowEditor="true" style="width: 10%; min-width: 5rem" bodyStyle="text-align:center"></Column> -->
            <Column :exportable="false" style="min-width:5rem">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                  @click="editEspecEmbalagem(slotProps.data)" />
                <Button icon="pi pi-trash" rounded severity="secondary"
                  @click="confirmDeleteEspecEmbalagem(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
          <Toolbar class="mb-4">
            <template #start>
              <Button label="Nova" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewEspecEmbalagem" />
            </template>
          </Toolbar>
        </div>
        <div>
          <Dialog id="embdialog" v-model:visible="especDialogEmbalagem" :style="{ width: '450px' }"
            header="Novo custo de embalagem" :modal="true" class="p-fluid">
            <div class="field">
              <label for="microverde">Item</label>
              <InputText id="item" v-model.trim="especdodialog.item" required="true" autofocus
                :invalid="submitted && !especdodialog.item" />
              <small class="p-error" v-if="submitted && !especdodialog.item">Esse campo não pode ficar em
                branco</small>
            </div>

            <div class="field">
              <label for="diasEmPilha">Valor</label>
              <InputNumber id="valor" v-model="especdodialog.valor" required="true" mode="currency" currency="BRL"
                locale="pt-BR" autofocus :invalid="submitted && !especdodialog.valor" />
              <small class="p-error" v-if="submitted && !especdodialog.valor">Esse campo não pode ficar em
                branco</small>
            </div>
            <template #footer>
              <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogEspecEmbalagem" />
              <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaEspecEmbalagem" />
            </template>
          </Dialog>
          <Dialog v-model:visible="deleteEspecDialogEmbalagem" :style="{ width: '450px' }" header="Confirmar"
            :modal="true">
            <div class="confirmation-content">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              <span v-if="especdodialog">Tem certeza que deseja deletar <b>{{ especdodialog.item }}</b>?</span>
            </div>
            <template #footer>
              <Button label="Não" icon="pi pi-times" text @click="deleteEspecDialogEmbalagem = false" />
              <Button label="Sim" icon="pi pi-check" text @click="deleteEspecEmbalagem" />
            </template>
          </Dialog>
        </div>
      </TabPanel>

    </TabView>
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
import Checkbox from 'primevue/checkbox';




import { useSementesStore } from '../stores/sementes';
import { useLotesStore } from '../stores/lotes';
import { useBlocosStore } from '../stores/blocos';
import { useEspecsStore } from '../stores/especs';
import { Timestamp } from 'firebase/firestore';



import { onBeforeMount, onMounted, onUpdated, ref, watch, computed } from 'vue';



const sementesStore = useSementesStore();
const lotesStore = useLotesStore();
const blocosStore = useBlocosStore();
const especsStore = useEspecsStore();


const colunasEspecs = ref([
  { field: 'item', header: 'Item' },
  { field: 'valor', header: 'Valor' },
]);

const dias = ref([
  { dia: 'Domingo' },
  { dia: 'Segunda' },
  { dia: 'Terça' },
  { dia: 'Quarta' },
  { dia: 'Quinta' },
  { dia: 'Sexta' },
  { dia: 'Sábado' },
]);

const microverdeEFornecedor = (semente) => {
  if (!semente) { return ''; }
  else
    return semente.microverde;
};

const datasSemana = ref([{ data: new Date() }, { data: new Date() }, { data: new Date() }, { data: new Date() }, { data: new Date() }, { data: new Date() }, { data: new Date() }]);


const mes = ref(new Date());




const selectedTipoLote = ref();
const selectedEspec = ref();
const databloco = ref();

const optionsLote = ref([{ tipo: 'Mix' }, { tipo: 'Microverde' },])



const ehEdit = ref(false);
const ehEditBloco = ref(false);
const ehEditLote = ref(false);

const blocododialog = ref({});
const lotedodialog = ref({});
const lotesimplesdodialog = ref({});

const blocoDialog = ref(false);
const loteDialog = ref(false);
const loteSimplesDialog = ref(false);

const submitted = ref(false);

const deleteEspecDialogPlantio = ref(false);
const deleteEspecDialogEmbalagem = ref(false);

const plantiosdoDialog = ref([]);
const plantiosdoDialogsimples = ref([]);



const small = ref('small');





const openNewLote = () => {
  ehEditLote.value = false;
  plantiosdoDialog.value = [];
  lotedodialog.value = {};
  submitted.value = false;
  loteDialog.value = true;
};

const insertblocodialog = ref(false)
const insertblocododialog = ref({})

const insertBloco = () => {
  insertblocododialog.value = {};
  submitted.value = false;
  insertblocodialog.value = true;
};


const plantiosdoDialogBloco = ref([]);


const openNewBloco = () => {
  ehEditBloco.value = false;
  plantiosdoDialogBloco.value = [];
  blocododialog.value = {};
  submitted.value = false;
  blocoDialog.value = true;
};

const hideDialogLote = () => {
  loteDialog.value = false;
  lotedodialog.value = {};
  submitted.value = false;
  plantiosdoDialog.value = [];
};

const hideDialogLoteSimples = () => {
  loteSimplesDialog.value = false;
  lotesimplesdodialog.value = {};
  submitted.value = false;
  plantiosdoDialogsimples.value = [];
};

const hideDialogBloco = () => {
  blocoDialog.value = false;
  blocododialog.value = {};
  submitted.value = false;
  plantiosdoDialogBloco.value = [];
};

const hideInsertBlocoDialog = () => {
  insertblocodialog.value = false;
  insertblocododialog.value = {};
  submitted.value = false;
};


const openNewLoteSimples = (dia, data) => {
  console.log(dia);
  console.log(data.toLocaleDateString());
  lotesimplesdodialog.value = { nome: '', data: data };
  submitted.value = false;
  loteSimplesDialog.value = true;
};

const salvarNovoLoteSimples = () => {
  submitted.value = true;
  if (lotesimplesdodialog.value.nome) {
    plantiosdoDialogsimples.value.forEach(plantio => {
      //encontra a espec semente daquela semente
      let especPlantio = sementesStore.especSementes.find((espec) => espec.id == plantio.semente.especSemente);
      //pega no especPlantio a gramas por bandeja
      plantio.gramasBandejaPlantio = especPlantio.gramasBandejaPlantio;

      //calcula datas de plantio, blackout e estufa
      //data do plantio: data da colheita menos a quantidade de dias que está na espec semente

      //seta plantio.data colheita com a data do de plantiosdoDialogsimples.value.data no formato date

      //se lotesimplesdodialog.value.tipo for Colheita, então lotesimplesdodialog.value.data é a colheita, senão é a semeadura
      console.log(lotesimplesdodialog.value.tipo);
      if (lotesimplesdodialog.value.tipo == 'Colheita') {
        plantio.dataColheita = new Date(lotesimplesdodialog.value.data);
      } else {
        console.log('entrou no else');
        console.log(especPlantio.diasAteAColheita);
        //adiciona os dias de colheita na data de semeadura de acordo com o especPlantio
        plantio.dataColheita = new Date(lotesimplesdodialog.value.data);
        plantio.dataColheita.setDate(plantio.dataColheita.getDate() + especPlantio.diasAteAColheita);




        console.log(plantio.dataColheita);


      }




      let dataSemeadura = new Date(plantio.dataColheita - especPlantio.diasAteAColheita * 24 * 60 * 60 * 1000);

      //plantio.dataSemeadura é a dataSemeadura em timestamp
      plantio.dataSemeadura = Timestamp.fromDate(dataSemeadura);

      let dataIdaBlackout = new Date(plantio.dataColheita - (especPlantio.diasAteAColheita - especPlantio.diasEmPilha) * 24 * 60 * 60 * 1000);

      plantio.dataIdaBlackout = Timestamp.fromDate(dataIdaBlackout);

      let dataIdaEstufa = new Date(plantio.dataColheita - (especPlantio.diasAteAColheita - especPlantio.diasEmPilha - especPlantio.blackout) * 24 * 60 * 60 * 1000);

      plantio.dataIdaEstufa = Timestamp.fromDate(dataIdaEstufa);

      plantio.dataColheita = Timestamp.fromDate(plantio.dataColheita);

      plantio.estado = 'Pré-plantio';

      delete plantio.semente.valorBruto
      delete plantio.semente.percentualICMS
      delete plantio.semente.fornecedor

    });
    const lote = { ...lotesimplesdodialog.value, plantios: plantiosdoDialogsimples.value };

    lotesStore.addLote(lote).then(() => {

      preenchePlantiosDict();

    });
    hideDialogLoteSimples();


  }

};

const salvarNovoLote = () => {
  submitted.value = true;

  if (lotedodialog.value.nome) {
    plantiosdoDialog.value.forEach(plantio => {
      //encontra a espec semente daquela semente
      let especPlantio = sementesStore.especSementes.find((espec) => espec.id == plantio.semente.especSemente);

      //pega no especPlantio a gramas por bandeja
      plantio.gramasBandejaPlantio = especPlantio.gramasBandejaPlantio;

      //calcula datas de plantio, blackout e estufa
      //data do plantio: data da colheita menos a quantidade de dias que está na espec semente



      let dataSemeadura = new Date(plantio.dataColheita - especPlantio.diasAteAColheita * 24 * 60 * 60 * 1000);

      //plantio.dataSemeadura é a dataSemeadura em timestamp
      plantio.dataSemeadura = Timestamp.fromDate(dataSemeadura);

      let dataIdaBlackout = new Date(plantio.dataColheita - (especPlantio.diasAteAColheita - especPlantio.diasEmPilha) * 24 * 60 * 60 * 1000);

      plantio.dataIdaBlackout = Timestamp.fromDate(dataIdaBlackout);

      let dataIdaEstufa = new Date(plantio.dataColheita - (especPlantio.diasAteAColheita - especPlantio.diasEmPilha - especPlantio.blackout) * 24 * 60 * 60 * 1000);

      plantio.dataIdaEstufa = Timestamp.fromDate(dataIdaEstufa);

      plantio.dataColheita = Timestamp.fromDate(plantio.dataColheita);

      plantio.estado = 'Pré-plantio';

      delete plantio.semente.valorBruto
      delete plantio.semente.percentualICMS
      delete plantio.semente.fornecedor


      for (let i = 0; i < plantio.selectedCustosPlantio.length; i++) {
        let custo = especsStore.especPlantio.find((espec) => espec.item == plantio.selectedCustosPlantio[i]);
        plantio.selectedCustosPlantio[i] = { item: custo.item, valor: custo.valor };
      }

    });
    const lote = { ...lotedodialog.value, plantios: plantiosdoDialog.value };

    lotesStore.addLote(lote).then(() => {

      preenchePlantiosDict();

    });
    hideDialogLote();


  }
};

const salvarInsertBloco = () => {
  submitted.value = true;

  if (insertblocododialog.value.bloco) {
    const bloco = { ...insertblocododialog.value, dataColheita: insertblocododialog.value.dataColheita, plantios: insertblocododialog.value.bloco.plantios };

    blocosStore.addBloco(bloco);

    hideInsertBlocoDialog();
  }
}

const salvarNovoBloco = () => {
  submitted.value = true;

  if (blocododialog.value.nome) {
    const bloco = { ...blocododialog.value, plantios: plantiosdoDialogBloco.value };




    blocosStore.addBloco(bloco);

    hideDialogBloco();
  }
}



const achaBG = (acao) => {
  switch (acao) {
    case 'SEMEADURA':
      return '#7e3110';
    case 'BLACKOUT':
      return '#360825';
    case 'ESTUFA':
      return '#032c4d';
    case 'COLHEITA':
      return '#004540';
    default:
      return '#607744';
  }
};

// DD - SS
const semanasDoMesSelecionado = computed(() => {
  return preencheSemanasDoMes();
})




const addplantio = () => {
  plantiosdoDialog.value.push({ selectedCustosPlantio: [] });
};

const addplantiobloco = () => {
  plantiosdoDialogBloco.value.push({});
};

const addplantiosimples = () => {
  plantiosdoDialogsimples.value.push({});
};

const removeplantio = (plantio) => {
  plantiosdoDialog.value = plantiosdoDialog.value.filter(p => p !== plantio);
};
const removeplantiosimples = (plantio) => {
  plantiosdoDialogsimples.value = plantiosdoDialogsimples.value.filter(p => p !== plantio);
};
const removeplantiobloco = (plantio) => {
  plantiosdoDialogBloco.value = plantiosdoDialogBloco.value.filter(p => p !== plantio);
};

const diasSemana = ref([
  { dia: 'Domingo' },
  { dia: 'Segunda' },
  { dia: 'Terça' },
  { dia: 'Quarta' },
  { dia: 'Quinta' },
  { dia: 'Sexta' },
  { dia: 'Sábado' },
]);

const tipos = ref([
  { tipo: 'Semeadura' },
  { tipo: 'Colheita' },
]);

const especdodialog = ref({});
const especDialogPlantio = ref(false);
const especDialogEmbalagem = ref(false);

const confirmDeleteEspecPlantio = (es) => {
  especdodialog.value = es;
  deleteEspecDialogPlantio.value = true;
};

const confirmDeleteEspecEmbalagem = (es) => {
  especdodialog.value = es;
  deleteEspecDialogEmbalagem.value = true;
};

const deleteEspecPlantio = () => {

  deleteEspecDialogPlantio.value = false;
  especsStore.deletaEspecPlantio(especdodialog.value)
  especdodialog.value = {};
};

const deleteEspecEmbalagem = () => {

  deleteEspecDialogEmbalagem.value = false;
  especsStore.deletaEspecEmbalagens(especdodialog.value)
  especdodialog.value = {};
};

const editEspecPlantio = (espec) => {
  ehEdit.value = true;
  especdodialog.value = { ...espec };
  especDialogPlantio.value = true;
};

const editEspecEmbalagem = (espec) => {
  ehEdit.value = true;
  especdodialog.value = { ...espec };
  especDialogEmbalagem.value = true;
};

const hideDialogEspecPlantio = () => {
  especDialogPlantio.value = false;
  especdodialog.value = {};
};

const hideDialogEspecEmbalagem = () => {
  especDialogEmbalagem.value = false;
  especdodialog.value = {};
};

const especvalido = () => {
  return especdodialog.value.item !== '' &&
    especdodialog.value.item !== null &&
    especdodialog.value.valor !== '' &&
    especdodialog.value.valor !== null
    ;
};

const clickTarefaCard = (e) => {
  console.log(e);
};

const salvarNovaEspecPlantio = () => {
  submitted.value = true;
  if (especvalido()) {
    ehEdit.value ? especsStore.setaEspecPlantio(especdodialog.value) : especsStore.addEspecPlantio(especdodialog.value);
    especDialogPlantio.value = false;
    especdodialog.value = {};
    submitted.value = false;
  }
  // salva novaespec no banco e fecha o dialog
};
const salvarNovaEspecEmbalagem = () => {
  submitted.value = true;
  if (especvalido()) {
    ehEdit.value ? especsStore.setaEspecEmbalagens(especdodialog.value) : especsStore.addEspecEmbalagens(especdodialog.value);
    especDialogEmbalagem.value = false;
    especdodialog.value = {};
    submitted.value = false;
  }
  // salva novaespec no banco e fecha o dialog
};

/* const openNewEspec = () => {
  ehEdit.value = false;
  especdodialog.value = {};
  submitted.value = false;
  especDialog.value = true;
}; */

const openNewEspecPlantio = () => {
  ehEdit.value = false;
  especdodialog.value = {};
  submitted.value = false;
  especDialogPlantio.value = true;
};

const openNewEspecEmbalagem = () => {
  ehEdit.value = false;
  especdodialog.value = {};
  submitted.value = false;
  especDialogEmbalagem.value = true;
};



/* watch(() => lotesStore.lotes, () => {
  geraLotesPeloLotesStore();
});
 */
//const lotes = ref([]);

/* const geraLotesPeloLotesStore = () => {
  lotes.value = useLotesStore().lotes;
}; */

const anos = ref([])
const meses = ref([]);
const temPlantioNoMes = ref(false);


watch(() => mes.value, () => {
  preencheSemanasDoMes();

});




const preencheSemanasDoMes = () => {


  // calcula semanas do mes selecionado onde semana = {diaInicio: Date, diaFim: Date, acoesplantios: [acaoplantio1, acaoplantio2, ...]}
  // semanas do mes selecionado se dará da seguinte forma: semanasDoMesSelecionado = [semana1, semana2, semana3, ...] onde diaInicio da semana1 é o primeiro domingo do mes e diaFim da semana1 é o primeiro sábado do mes, diaInicio da semana2 é o segundo domingo do mes e diaFim da semana2 é o segundo sábado do mes, e assim por diante
  let semanasDoMesSelecionado = [];

  let primeiroDia = new Date(mes.value.getFullYear(), mes.value.getMonth(), 1);
  //calcula o primeiro domingo do mes
  let primeiroDomingo = new Date(primeiroDia);
  primeiroDomingo.setDate(primeiroDia.getDate() - primeiroDia.getDay());
  // esse calculo resulta no domingo da semana anterior ao mes selecionado, então adiciona 7 dias para obter o primeiro domingo do mes selecionado. Mas se o primeiro domingo for o primeiro dia do mes, não adiciona 7 dias
  if (primeiroDomingo.getDate() != 1)
    primeiroDomingo.setDate(primeiroDomingo.getDate() + 7);

  // calcula todos os domingos do mes
  let domingos = [];
  let domingo = new Date(primeiroDomingo);

  while (domingo.getMonth() == mes.value.getMonth()) {
    domingos.push(domingo);
    domingo = new Date(domingo);
    domingo.setDate(domingo.getDate() + 7);
  }

  // para cada domingo, calcula a semana
  domingos.forEach(domingo => {
    let finalSemana = new Date(domingo);
    finalSemana.setDate(domingo.getDate() + 6);

    let semana = { titulo: (domingo.toLocaleDateString().slice(0, -5) + ' - ' + finalSemana.toLocaleDateString()).slice(0, -5), domingo: domingo, domingoDate: domingo.getDate(), dias: [[], [], [], [], [], [], []] };
    for (let i = 0; i < 7; i++) {
      //calcula semanaDias de acordo com o plantiosDict
      // para cada dia na semana, verifica se tem plantio naquele dia, se tiver, adiciona o plantio na semana
      let dia = new Date(domingo);
      dia.setDate(domingo.getDate() + i);
      semana.dias[i] = plantiosDict.value[dia] ? plantiosDict.value[dia] : [];

    }
    semanasDoMesSelecionado.push(semana);
  });

  semanasDoMesSelecionado.sort((a, b) => a.domingo - b.domingo);

  return semanasDoMesSelecionado;
}






/* A estrutura dos meses se dará da seguinte forma:
meses = [
  [semana1, semana2, semana3, ...], // janeiro
  [semana1, semana2, semana3, ...], // fevereiro
  ...
  [semana1, semana2, semana3, ...] // dezembro
] onde semana = {diaInicio: Date, diaFim: Date, acoesplantios: [acaoplantio1, acaoplantio2, ...]}
 e onde acaoplantio = {lote: Lote, plantio: Plantio, acao: string}
 e onde acao = 'plantio', 'blackout', 'estufa', 'colheita'
 
A semana começa no domingo e termina no sábado
 
*/
// watch lotes
watch(() => lotesStore.lotes, () => {
  preenchePlantiosDict();
});

const plantiosDict = ref({});

//preenche o plantiosDict com os plantios de cada lote onde a chave do dicionário é a data de ação do plantio e o valor é um array de plantios com todos os plantios com aquela data de ação seja semeadura, blackout, estufa ou colheita

const preenchePlantiosDict = () => {
  plantiosDict.value = {};
  lotesStore.lotes.forEach(lote => {
    lote.plantios.forEach((plantio, index) => {
      /*   console.log(plantio); */
      let dataColheita = plantio.dataColheita.toDate();
      let dataSemeadura = plantio.dataSemeadura.toDate();
      let dataIdaBlackout = plantio.dataIdaBlackout.toDate();
      let dataIdaEstufa = plantio.dataIdaEstufa.toDate();

      if (!plantiosDict.value[dataColheita]) {
        plantiosDict.value[dataColheita] = [];
      }
      plantiosDict.value[dataColheita].push({ lote: lote.nome, plantio: plantio.semente.microverde, acao: 'COLHEITA', loteId: lote.id, indexPlantio: index });

      if (!plantiosDict.value[dataSemeadura]) {
        plantiosDict.value[dataSemeadura] = [];
      }
      plantiosDict.value[dataSemeadura].push({ lote: lote.nome, plantio: plantio.semente.microverde, acao: 'SEMEADURA', loteId: lote.id, indexPlantio: index });

      if (!plantiosDict.value[dataIdaBlackout]) {
        plantiosDict.value[dataIdaBlackout] = [];
      }
      plantiosDict.value[dataIdaBlackout].push({ lote: lote.nome, plantio: plantio.semente.microverde, acao: 'BLACKOUT', loteId: lote.id, indexPlantio: index });

      if (!plantiosDict.value[dataIdaEstufa]) {
        plantiosDict.value[dataIdaEstufa] = [];
      }
      plantiosDict.value[dataIdaEstufa].push({ lote: lote.nome, plantio: plantio.semente.microverde, acao: 'ESTUFA', loteId: lote.id, indexPlantio: index });
    });
  });
};



const calculaSemanas = () => {
  meses.value = [];
  lotesStore.lotes.forEach(lote => {
    lote.plantios.forEach(plantio => {
      let dataColheita = plantio.dataColheita.toDate();
      let dataSemeadura = plantio.dataSemeadura.toDate();
      let dataIdaBlackout = plantio.dataIdaBlackout.toDate();
      let dataIdaEstufa = plantio.dataIdaEstufa.toDate();

      let datas = [{ acao: 'SEMEADURA', data: dataSemeadura }, { acao: 'BLACKOUT', data: dataIdaBlackout }, { acao: 'ESTUFA', data: dataIdaEstufa }, { acao: 'COLHEITA', data: dataColheita }];
      datas.forEach(data => {


        //Calcula o primeiro dia da semana de acordo com a data.data
        var diaSemana = data.data.getDay();
        var inicioSemana = new Date(data.data);
        inicioSemana.setDate(data.data.getDate() - diaSemana);
        var finalSemana = new Date(inicioSemana);
        finalSemana.setDate(inicioSemana.getDate() + 6);


        var numMes = inicioSemana.getMonth();

        //se em 'meses[numMes]', onde numMes é o mes do diaInicio da semana, não existir a semana, cria um array vazio, cria a semana e adiciona a acao; senão, adiciona a acao
        if (!meses.value[numMes]) {
          let semana = { diaInicio: inicioSemana.getDate(), dias: [[], [], [], [], [], [], []] };
          semana.dias[data.data.getDay()] = [{ data: data.data, lote: lote.nome, plantio: plantio.semente.microverde, acao: data.acao }];
          meses.value[numMes] = [];
          //pega o dia do mes do inicio da semana para usar de indice no objeto mes para adicionar a semana no mes
          meses.value[numMes][inicioSemana.getDate()] = semana;
          meses.value[numMes].semanas = [{ domingo: inicioSemana.getDate(), domingoDate: inicioSemana, titulo: (inicioSemana.toLocaleDateString().slice(0, -5) + ' - ' + finalSemana.toLocaleDateString()).slice(0, -5) }];
          //meses.value[numMes] = {  inicioSemana = semana}
        } else {
          //se a semana já existir, adiciona a acao a semana, senão, cria um array vazio e adiciona a acao
          if (!meses.value[numMes][inicioSemana.getDate()]) {
            let semana = { diaInicio: inicioSemana.getDate(), dias: [[], [], [], [], [], [], []] };
            semana.dias[data.data.getDay()] = [{ data: data.data, lote: lote.nome, plantio: plantio.semente.microverde, acao: data.acao }];
            meses.value[numMes][inicioSemana.getDate()] = semana;
            meses.value[numMes].semanas.push({ domingo: inicioSemana.getDate(), domingoDate: inicioSemana, titulo: (inicioSemana.toLocaleDateString().slice(0, -5) + ' - ' + finalSemana.toLocaleDateString()).slice(0, -5) });
          } else {
            if (!meses.value[numMes][inicioSemana.getDate()].dias[data.data.getDay()]) {
              meses.value[numMes][inicioSemana.getDate()].dias[data.data.getDay()] = [{ data: data.data, lote: lote.nome, plantio: plantio.semente.microverde, acao: data.acao }];
            }
            else {
              meses.value[numMes][inicioSemana.getDate()].dias[data.data.getDay()].push({ data: data.data, lote: lote.nome, plantio: plantio.semente.microverde, acao: data.acao });
            }
          }
        }
      });
    });
  });
  //ordena cada semana de cada mes por data
  meses.value.forEach(mes => {

    //transforma domingo em numero
    mes.semanas.sort((a, b) => a.domingo - b.domingo);


  });



};



onBeforeMount(() => {


  sementesStore.fetchSementes();
  sementesStore.fetchEspecSementes();
  lotesStore.fetchLotes()

  blocosStore.fetchBlocos();
  especsStore.fetchEspecPlantio();
  especsStore.fetchEspecEmbalagens();



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
