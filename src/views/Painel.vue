<template>
    <TabView>
        <TabPanel header="Para Semeadura">
            <DataTable :value="emSemeadura">
                <Column field="lote.nome" header="Lote"></Column>
                <Column field="plantio.microverde" header="Microverde"></Column>

                <Column field="plantio.gramasBandejaPlantio" header="Gramas de Sementes por Bandeja"
                    style="text-align: center"></Column>

                <Column field="plantio.dataSemeadura" header="Data de Semeadura">
                    <template #body="slotProps">
                        <span>{{ slotProps.data.plantio.dataSemeadura.toDate().toLocaleDateString() }}</span>
                    </template>
                </Column>
                <Column field="plantio.numBandejas" header="Número de Bandejas" style="text-align: center"></Column>
                <!-- <Column field="plantio.pendencia" header="Pendência"></Column> -->
                <!-- Adiciona um botão 'semear' que altera o estado para 'Pilha'  -->
                <Column field="plantio.estado" style="text-align: center">
                    <template #body="slotProps">

                        <Button plain text raised
                            @click="chamaChangePlantioEstado(slotProps.data.lote.id, slotProps.data.indexPlantio, 'Pilha')">Semear</Button>
                    </template>
                </Column>
            </DataTable>


        </TabPanel>
        <TabPanel header="Para Blackout">
            <DataTable :value="emBlackout">
                <Column field="lote.nome" header="Lote"></Column>
                <Column field="plantio.microverde" header="Microverde"></Column>



                <Column field="plantio.dataIdaBlackout" header="Data de ida ao Blackout">
                    <template #body="slotProps">
                        <span>{{ slotProps.data.plantio.dataIdaBlackout.toDate().toLocaleDateString() }}</span>
                    </template>
                </Column>
                <Column field="plantio.numBandejas" header="Número de Bandejas" style="text-align: center"></Column>
                <!-- <Column field="plantio.pendencia" header="Pendência"></Column> -->
                <!-- Adiciona um botão 'semear' que altera o estado para 'Pilha'  -->
                <Column field="plantio.estado" style="text-align: center">
                    <template #body="slotProps">

                        <Button plain text raised
                            @click="chamaChangePlantioEstado(slotProps.data.lote.id, slotProps.data.indexPlantio, 'Blackout')">Colocar
                            em Blackout</Button>
                    </template>
                </Column>
            </DataTable>
        </TabPanel>

        <TabPanel header="Para Estufa">
            <DataTable :value="emEstufa">
                <Column field="lote.nome" header="Lote"></Column>
                <Column field="plantio.microverde" header="Microverde"></Column>



                <Column field="plantio.dataIdaEstufa" header="Data de ida a Estufa">
                    <template #body="slotProps">
                        <span>{{ slotProps.data.plantio.dataIdaEstufa.toDate().toLocaleDateString() }}</span>
                    </template>
                </Column>
                <Column field="plantio.numBandejas" header="Número de Bandejas" style="text-align: center"></Column>
                <!-- <Column field="plantio.pendencia" header="Pendência"></Column> -->
                <!-- Adiciona um botão 'semear' que altera o estado para 'Pilha'  -->
                <Column field="plantio.estado" style="text-align: center">
                    <template #body="slotProps">

                        <Button plain text raised
                            @click="chamaChangePlantioEstado(slotProps.data.lote.id, slotProps.data.indexPlantio, 'Estufa')">Colocar
                            na Estufa</Button>
                    </template>
                </Column>
            </DataTable>
        </TabPanel>
        <TabPanel header="Para Colheita">
            <DataTable :value="emColheita">
                <Column field="lote.nome" header="Lote"></Column>
                <Column field="plantio.microverde" header="Microverde"></Column>



                <Column field="plantio.dataColheita" header="Data de Colheita">
                    <template #body="slotProps">
                        <span>{{ slotProps.data.plantio.dataColheita.toDate().toLocaleDateString() }}</span>
                    </template>
                </Column>
                <Column field="plantio.numBandejas" header="Número de Bandejas" style="text-align: center"></Column>
                <!-- <Column field="plantio.pendencia" header="Pendência"></Column> -->
                <!-- Adiciona um botão 'semear' que altera o estado para 'Pilha'  -->
                <Column field="plantio.estado" style="text-align: center">
                    <template #body="slotProps">

                        <Button plain text raised
                            @click="chamaChangePlantioEstado(slotProps.data.lote.id, slotProps.data.indexPlantio, 'Colhido')">Colher</Button>
                    </template>
                </Column>
            </DataTable>
        </TabPanel>

        <TabPanel header="Sem Pendência">
            <DataTable :value="semPendencia">
                <Column field="lote.nome" header="Lote"></Column>
                <Column field="plantio.microverde" header="Microverde"></Column>
                <Column field="plantio.dataSemeadura" header="Data de Semeadura">
                    <template #body="slotProps">
                        <span>{{ slotProps.data.plantio.dataSemeadura.toDate().toLocaleDateString() }}</span>
                    </template>
                </Column>
                <Column field="plantio.dataIdaBlackout" header="Data de ida ao Blackout">
                    <template #body="slotProps">
                        <span>{{ slotProps.data.plantio.dataIdaBlackout.toDate().toLocaleDateString() }}</span>
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
                <Column field="plantio.estado" style="text-align: center">
                </Column>
            </DataTable>
        </TabPanel>
    </TabView>
</template>

<script setup>

import TabPanel from 'primevue/tabpanel';
//import TheWelcome from '../components/TheWelcome.vue'

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import Button from 'primevue/button';

import { Timestamp } from "firebase/firestore";



import { useSementesStore } from "../stores/sementes";
import { useLotesStore } from "../stores/lotes";

import { onMounted, onBeforeMount, ref, watch } from 'vue';


const sementesStore = useSementesStore();
const lotesStore = useLotesStore();
const sementes = ref({});
//cada lote tem varios plantios. cada plantio tem dataSemeadura, dataIdaBlackout, dataIdaEstufa e dataColheita. Além disso, o cada plantio tem um estado que é a ultima atividade já realizada no plantio. o plantio nasce como 'Pré-plantio' depois vai para 'Pilha', depois 'Blackout', depois 'Estufa' e por fim 'Colhido'. Porém, o estado do plantio pode ser alterado apenas manualmente pelo usuário. Se ainda não foi alterado, e sua data limite já passou ou é hoje, o plantio é considerado com pendencia.
// para cada plantio temos que calcular se há pendencia ou não. Se houver, o plantio é considerado com pendencia. Se não houver, o plantio é considerado sem pendencia.


const emSemeadura = ref([]);
const emBlackout = ref([]);
const emEstufa = ref([]);
const emColheita = ref([]);
const semPendencia = ref([]);

const chamaChangePlantioEstado = (loteId, indexPlantio, estado) => {
    lotesStore.changePlantioEstado(loteId, indexPlantio, estado);
    calculaPendendenciaDosLotes();
};

// a funcao calcula dependencia precisa ser chamada dentro de um watch q observa a mudança da lotesStore.lotes

const calculaPendendenciaDosLotes = () => {
    emSemeadura.value = [];
    emBlackout.value = [];
    emEstufa.value = [];
    emColheita.value = [];
    semPendencia.value = [];


    lotesStore.lotes.forEach(lote => {
        lote.plantios.forEach(plantio => {
            if (plantio.estado === 'Pré-plantio') {
                if (plantio.dataSemeadura.toDate() < Timestamp.now().toDate()) {
                    plantio.pendencia = 'Semeadura';
                    //indexplantio é o indice do plantio no array de plantios do lote
                    emSemeadura.value.push({ lote: { id: lote.id, nome: lote.nome, created: lote.created }, indexPlantio: lote.plantios.indexOf(plantio), plantio: plantio });
                } else {
                    plantio.pendencia = 'Sem pendência';
                    semPendencia.value.push({ lote: { id: lote.id, nome: lote.nome, created: lote.created }, indexPlantio: lote.plantios.indexOf(plantio), plantio: plantio });
                }
            } else if (plantio.estado === 'Pilha') {
                if (plantio.dataIdaBlackout.toDate() < Timestamp.now().toDate()) {
                    plantio.pendencia = 'Blackout';
                    emBlackout.value.push({ lote: { id: lote.id, nome: lote.nome, created: lote.created }, indexPlantio: lote.plantios.indexOf(plantio), plantio: plantio });
                } else {
                    plantio.pendencia = 'Sem pendência';
                    semPendencia.value.push({ lote: { id: lote.id, nome: lote.nome, created: lote.created }, indexPlantio: lote.plantios.indexOf(plantio), plantio: plantio });
                }
            } else if (plantio.estado === 'Blackout') {
                if (plantio.dataIdaEstufa.toDate() < Timestamp.now().toDate()) {
                    plantio.pendencia = 'Estufa';
                    emEstufa.value.push({ lote: { id: lote.id, nome: lote.nome, created: lote.created }, indexPlantio: lote.plantios.indexOf(plantio), plantio: plantio });
                } else {
                    plantio.pendencia = 'Sem pendência';
                    semPendencia.value.push({ lote: { id: lote.id, nome: lote.nome, created: lote.created }, indexPlantio: lote.plantios.indexOf(plantio), plantio: plantio });
                }
            } else if (plantio.estado === 'Estufa') {
                if (plantio.dataColheita.toDate() < Timestamp.now().toDate()) {
                    plantio.pendencia = 'Colheita';
                    emColheita.value.push({ lote: { id: lote.id, nome: lote.nome, created: lote.created }, indexPlantio: lote.plantios.indexOf(plantio), plantio: plantio });
                } else {
                    plantio.pendencia = 'Sem pendência';
                    semPendencia.value.push({ lote: { id: lote.id, nome: lote.nome, created: lote.created }, indexPlantio: lote.plantios.indexOf(plantio), plantio: plantio });
                }
            } else if (plantio.estado === 'Colhido') {
                plantio.pendencia = 'Sem pendência';
                semPendencia.value.push({ lote: { id: lote.id, nome: lote.nome, created: lote.created }, indexPlantio: lote.plantios.indexOf(plantio), plantio: plantio });
            }
        });
    });
};
watch(() => lotesStore.lotes, () => {
    calculaPendendenciaDosLotes();
});


onBeforeMount(() => {
    lotesStore.fetchLotes();




    /* sementesStore.fetchSementes();
    sementes.value = sementesStore.sementes; */

});

/* onMounted(() => {
    calculaPendendenciaDosLotes();
    console.log('emsemeadura', emSemeadura.value);
    console.log('emblackout', emBlackout.value);
    console.log('emestufa', emEstufa.value);
    console.log('emcolheita', emColheita.value);
    console.log('sempendencia', semPendencia.value);
    console.log('lotes', lotesStore.lotes);
}); */



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