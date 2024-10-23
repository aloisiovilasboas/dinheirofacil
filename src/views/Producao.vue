<template>
  <Button @click="exportarEtiquetas" label="Exportar Etiquetas" icon="pi pi-download"
    class="p-button-rounded p-button-success" />

  <div class="flex flex-column " style="min-width: 1100px;">
    <TabView>
      <TabPanel header="Calendário">

        <!-- div abaixo centralizado, width 100% e justify-content-start -->
        <div class="flex flex-row flex-wrap align-items-center" style="padding-top: 1rem;">
          <div style="padding-right: 10px;">
            <label for="mescol">Mês: </label>
          </div>
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
                        <!-- abaixo, acao.plantio e ao lado um circulo com o numero de bandejas -->
                        <div class="flex flex-row gap-3 ">
                          <div class="flex flex-column ">
                            <span class="word-large">{{ acao.plantio }}</span>
                            <span class="word-small">{{ acao.lote }}</span>
                            <span class="word-acao">{{ acao.acao }}</span>
                          </div>
                          <div class="flex flex-column" style="align-items: center; justify-content: center;">
                            <Badge :value=acao.numBandejas />
                          </div>
                        </div>

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
                placeholder="Semeadura" checkmark :highlightOnSelect="false" />
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
                      <Dropdown v-model="plantio.idSemente" :options="optionsSementes" optionLabel="label" filter
                        optionValue="value" placeholder="Microverde" checkmark :highlightOnSelect="false" />
                      <small class="p-error" v-if="submitted && !plantio.idSemente">Esse campo não pode ficar em
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
                      <Dropdown v-model="plantio.idSemente" :options="optionsSementes" optionLabel="label" filter
                        optionValue="value" placeholder="Microverde" checkmark :highlightOnSelect="false" />
                      <small class="p-error" v-if="submitted && !plantio.idSemente">Esse campo não pode ficar em
                        branco</small>
                    </div>
                    <div class="field">
                      <label for="data">Data da colheita</label>
                      <Calendar id="data" v-model="plantio.dataColheita" required="true"
                        :invalid="submitted && !plantio.dataColheita" />
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

      <TabPanel header="Lotes">
        <div class="grid grid-cols-2">
          <div class="flex flex-column ">
            <Button label="Novo Lote" icon="pi pi-plus" class="mr-2" @click="openNewLote" />
          </div>
        </div>
        <div>
          <DataTable :value="destrinchaLotes">
            <Column :exportable="false" style="min-width:5rem">
              <template #body="slotProps">
                <Button icon="pi pi-trash" rounded severity="secondary" @click="confirmDeletePlantio(slotProps.data)" />
              </template>
            </Column>
            <Column field="lote.nome" header="Lote"></Column>
            <Column field="plantio.microverde" header="Microverde"></Column>
            <Column field="plantio.dataSemeadura" header="Data de Semeadura">
              <template #body="slotProps">
                <span>{{ slotProps.data.plantio.dataSemeadura.toDate().toLocaleDateString() }}</span>
              </template>
            </Column>
            <Column field="plantio.dataIdaBlackout" header="Data de ida ao Blackout">
              <template #body="slotProps">
                <!-- v-if data de blackout é diferente da data de estufa  -->
                <span
                  v-if="slotProps.data.plantio.dataIdaBlackout.toDate().getTime() != slotProps.data.plantio.dataIdaEstufa.toDate().getTime()">{{
                    slotProps.data.plantio.dataIdaBlackout.toDate().toLocaleDateString() }}</span>
                <!-- v-else  -->
                <span v-else> Direto para Estufa </span>
              </template>
            </Column>
            <Column field="plantio.dataIdaEstufa" header="Data de ida a Estufa">
              <template #body="slotProps">
                <span>{{ slotProps.data.plantio.dataIdaEstufa.toDate().toLocaleDateString() }}</span>
              </template>
            </Column>
            <Column field="plantio.dataColheita" header="Data de Colheita">
              <template #body="slotProps">
                <span>{{ slotProps.data.plantio.dataColheita.toDate().toLocaleDateString() }}</span>
              </template>
            </Column>
            <Column field="plantio.numBandejas" header="Número de Bandejas" style="text-align: center"></Column>
            <!-- <Column field="plantio.pendencia" header="Pendência"></Column> -->
            <!-- Adiciona um botão 'semear' que altera o estado para 'Pilha'  -->
            <Column field="plantio.estado" header="Estado" style="text-align: center">
            </Column>
          </DataTable>

          <Dialog v-model:visible="deleteLoteDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="confirmation-content">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              <span v-if="lotedodialog">Tem certeza que deseja excluir o plantio <b>{{ lotedodialog.plantio.microverde
                  }} de colheita em {{ lotedodialog.plantio.dataColheita.toDate().toLocaleDateString() }}</b>?</span>
            </div>
            <template #footer>
              <Button label="Não" icon="pi pi-times" text @click="deleteLoteDialog = false" />
              <Button label="Sim" icon="pi pi-check" text @click="deletePlantio" />
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
import Badge from 'primevue/badge';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Toolbar from 'primevue/toolbar';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Divider from 'primevue/divider';
import Checkbox from 'primevue/checkbox';




import { useSementesStore } from '../stores/sementes';
import { useLotesStore } from '../stores/lotes';

import { useEspecsStore } from '../stores/especs';
import { Timestamp } from 'firebase/firestore';



import { onBeforeMount, onMounted, onUpdated, ref, watch, computed } from 'vue';



const sementesStore = useSementesStore();
const lotesStore = useLotesStore();

const especsStore = useEspecsStore();

const destrinchaLotes = computed(() => {
  return lotesStore.lotes.map(lote => {
    return lote.plantios.map(plantio => {
      return { lote: lote, plantio: plantio };
    });
  }).flat();
});




const dias = ref([
  { dia: 'Domingo' },
  { dia: 'Segunda' },
  { dia: 'Terça' },
  { dia: 'Quarta' },
  { dia: 'Quinta' },
  { dia: 'Sexta' },
  { dia: 'Sábado' },
]);



const mes = ref(new Date());





const ehEdit = ref(false);

const ehEditLote = ref(false);


const lotedodialog = ref({});
const lotesimplesdodialog = ref({});

const deleteLoteDialog = ref(false);


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

// optionsSementes é um array de objetos {label: string, value: string} onde label é o 'nome - created'  e value é a semente e é resultado da filtragem de sementesStore.sementes onde semente.disponivel é true
// o created está em timestamp e é convertido para string com o toLocaleDateString	

const optionsSementes = computed(() => {

  return sementesStore.sementes.filter(semente => semente.disponivel).map(semente => {

    let s = { label: semente.microverde + ' - ' + semente.created.toDate().toLocaleDateString(), value: semente.id }
    console.log(s);
    return s;
  });
});



const plantiosdoDialogBloco = ref([]);



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
      //encontra a semente daquele id
      let plantiosemente = sementesStore.sementes.find(semente => semente.id == plantio.idSemente);
      let especPlantio = plantiosemente.especSemente



      plantio.microverde = plantiosemente.microverde;
      plantio.gramasBandejaPlantio = especPlantio.gramasBandejaPlantio;
      plantio.cobertura = especPlantio.cobertura;
      plantio.distincao = especPlantio.distincao;
      plantio.hidratacao = especPlantio.hidratacao;
      plantio.mix = especPlantio.mix;
      plantio.peso = especPlantio.peso;
      plantio.idEspecPlantio = especPlantio.id;




      //calcula datas de plantio, blackout e estufa
      //data do plantio: data da colheita menos a quantidade de dias que está na espec semente

      //seta plantio.data colheita com a data do de plantiosdoDialogsimples.value.data no formato date

      //se lotesimplesdodialog.value.tipo for Colheita, então lotesimplesdodialog.value.data é a colheita, senão é a semeadura
      console.log(lotesimplesdodialog.value.tipo);
      if (lotesimplesdodialog.value.tipo == 'Colheita') {
        plantio.dataColheita = new Date(lotesimplesdodialog.value.data);
      } else {
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



    });
    const lote = { ...lotesimplesdodialog.value, plantios: plantiosdoDialogsimples.value };
    delete lote.data;
    delete lote.tipo;

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
      console.log(plantio);
      //encontra a semente daquele id
      let plantiosemente = sementesStore.sementes.find(semente => semente.id == plantio.idSemente);
      let especPlantio = plantiosemente.especSemente



      plantio.microverde = plantiosemente.microverde;
      plantio.gramasBandejaPlantio = especPlantio.gramasBandejaPlantio;
      plantio.cobertura = especPlantio.cobertura;
      plantio.distincao = especPlantio.distincao;
      plantio.hidratacao = especPlantio.hidratacao;
      plantio.mix = especPlantio.mix;
      plantio.peso = especPlantio.peso;
      plantio.idEspecPlantio = especPlantio.id;

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


      /* 
            for (let i = 0; i < plantio.selectedCustosPlantio.length; i++) {
              let custo = especsStore.especPlantio.find((espec) => espec.item == plantio.selectedCustosPlantio[i]);
              plantio.selectedCustosPlantio[i] = { item: custo.item, valor: custo.valor };
            } */

    });
    const lote = { ...lotedodialog.value, plantios: plantiosdoDialog.value };

    lotesStore.addLote(lote).then(() => {

      preenchePlantiosDict();

    });
    hideDialogLote();


  }
};

const confirmDeletePlantio = (lote) => {
  console.log(lote.plantio.microverde);
  lotedodialog.value = lote;
  deleteLoteDialog.value = true;
};

const confirmDeleteEspec = (es) => {
  especdodialog.value = es;
  deleteEspecDialog.value = true;
};

const deletePlantio = () => {
  console.log(lotedodialog.value);
  deleteLoteDialog.value = false;
  //verifica se o lote tem mais de um plantio, se sim, deleta o plantio, se não, deleta o lote
  if (lotedodialog.value.lote.plantios.length > 1) {
    // deleta o plantio do lote em lotedodialog e atualiza o lote no banco com o setaLote de lotesStore
    lotedodialog.value.lote.plantios = lotedodialog.value.lote.plantios.filter(plantio => plantio !== lotedodialog.value.plantio);
    console.log(lotedodialog.value.lote);
    lotesStore.setaLote(lotedodialog.value.lote).then(() => {
      preenchePlantiosDict();
      mes.value = new Date(mes.value);
    })
  } else {
    lotesStore.deletaLote(lotedodialog.value.lote).then(() => {
      preenchePlantiosDict();
      mes.value = new Date(mes.value);
    });
  }


  lotedodialog.value = {};
};

// const fs = require('node:fs'); abaixo, usando import 
import fs from 'fs';
const content = 'Some content!';



function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const exportarEtiquetas = () => {
  download('etiquetas.json', content);
};

const exportarEtiquetas1 = () => {
  const blob = new Blob([content], { type: 'text/plain' })
  const e = document.createEvent('MouseEvents'),
    a = document.createElement('a');
  a.download = "test.json";
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
  e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(e);
};


const deleteEspec = () => {

  deleteEspecDialog.value = false;
  sementesStore.deletaEspecSemente(especdodialog.value)
  especdodialog.value = {};
};



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
const forcePreencher = ref(0)

const semanasDoMesSelecionado = computed(() => {
  return preencheSemanasDoMes();
})




const addplantio = () => {
  plantiosdoDialog.value.push({ selectedCustosPlantio: [] });
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

      if (!plantiosDict.value[dataSemeadura]) {
        plantiosDict.value[dataSemeadura] = [];
      }
      plantiosDict.value[dataSemeadura].push({ lote: lote.nome, plantio: plantio.microverde, acao: 'SEMEADURA', loteId: lote.id, indexPlantio: index, numBandejas: plantio.numBandejas });

      if (!plantiosDict.value[dataIdaBlackout]) {
        plantiosDict.value[dataIdaBlackout] = [];
      }
      // se a data de ida do blackout for igual a data de estufa, não adiciona o blackout
      if (dataIdaBlackout.getTime() != dataIdaEstufa.getTime())
        plantiosDict.value[dataIdaBlackout].push({ lote: lote.nome, plantio: plantio.microverde, acao: 'BLACKOUT', loteId: lote.id, indexPlantio: index, numBandejas: plantio.numBandejas });

      if (!plantiosDict.value[dataIdaEstufa]) {
        plantiosDict.value[dataIdaEstufa] = [];
      }
      plantiosDict.value[dataIdaEstufa].push({ lote: lote.nome, plantio: plantio.microverde, acao: 'ESTUFA', loteId: lote.id, indexPlantio: index, numBandejas: plantio.numBandejas });


      if (!plantiosDict.value[dataColheita]) {
        plantiosDict.value[dataColheita] = [];
      }
      plantiosDict.value[dataColheita].push({ lote: lote.nome, plantio: plantio.microverde, acao: 'COLHEITA', loteId: lote.id, indexPlantio: index, numBandejas: plantio.numBandejas });

    });
  });
};


onBeforeMount(() => {


  sementesStore.fetchSementes();
  sementesStore.fetchEspecSementes();
  lotesStore.fetchLotes()


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
