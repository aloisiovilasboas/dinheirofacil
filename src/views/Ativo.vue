<template>
    <div style="margin-top: 100px">

        <div>
            <FileUpload mode="basic" chooseLabel="Fazer upload de extrato" accept=".csv,.ofx,.pdf" :auto="true"
                :customUpload="true" @uploader="handleFileUpload" />
        </div>

        <Card>

            <template #title v-if="contasStore.contas[id]">
                {{ contasStore.contas[id].nome }}</template>
            <template #subtitle v-if="contasStore.contas[id]">
                <div class="flex">
                    {{ contasStore.contas[id].tipo }}
                </div>
                <div class="flex">
                    {{ contasStore.contas[id].banco.sigla }}
                </div>
            </template>

            <template #content>
                <DataTable :value="contasStore.contas[id].transacoes">


                    <Column field="data" header="Data"></Column>
                    <Column field="descricao" header="Descrição">
                        <template #body="{ data, index }">
                            {{ data.descricao }}
                            <span v-if="data.selectedCateg">
                                <Button size="small" rounded icon="pi pi-save" label="Salvar"
                                    @click="salvarTransacao(data.categoria, id, data.tid, index, data)" />
                            </span>
                        </template>
                    </Column>
                    <Column field="valor" header="Valor"></Column>
                    <Column field="categoria" header="Categoria">
                        <template #body="{ data }">
                            <TreeSelect v-model="data.categoria" @node-select="onNodeSelect(data, $event)"
                                @node-unselect="onNodeUnSelect(data, $event)" :options="categoriasStore.categorias"
                                placeholder="Sem Categoria" class="md:w-80 w-full">
                                <template #header="{ node }">
                                    <div class="px-3 pt-1 pb-2 flex justify-between">
                                        <Button label="Sem Categoria" severity="secondary" text size="small"
                                            icon="pi pi-minus" @click="apagaCategoria(data)" />
                                    </div>

                                </template>
                                <template #option="{ node }">
                                    <div class="flex-row">
                                        <div>
                                            {{ node.label }}
                                        </div>
                                    </div>
                                </template>
                                <template #footer>
                                    <div class="px-3 pt-1 pb-2 flex justify-between">
                                        <Button label="Nova Categoria" severity="secondary" text size="small"
                                            icon="pi pi-plus" @click="openNewCategoria" />
                                    </div>
                                </template>
                            </TreeSelect>
                        </template>
                    </Column>

                </DataTable>
            </template>
        </Card>
    </div>
    <Dialog v-model:visible="displayDocDialog" header="Transações" :modal="true" class="p-fluid">

        <Button label="Encontra Categorias" @click="verificaTodosOsFiltros()" />
        <div class="">
            <DataTable v-if="tableData.length" :value="tableData" tableStyle="min-width: 50rem">

                <Column field="date" header="Data"></Column>
                <Column field="descricao" header="Descrição">
                    <template #body="{ data, index }">
                        {{ data.descricao }}
                        <span v-if="data.selectedCateg">
                            <Button size="small" rounded icon="pi pi-plus" label="filtro"
                                @click="addfiltro(data.categCompleta, data.descricao, index)" />
                        </span>
                    </template>
                </Column>

                <Column field="valor" class="valor" style="text-align: right;">
                    <template #header>
                        <div style="min-width: 100%">Valor (R$)</div>
                    </template>
                </Column>
                <Column field="categoria" header="Categoria">
                    <template #body="{ data }">
                        <TreeSelect v-model="data.categoria" @node-select="onNodeSelect(data, $event)"
                            :options="categoriasStore.categorias" placeholder="Sem Categoria" class="md:w-80 w-full">
                            <template #header="{ node }">
                                <div class="px-3 pt-1 pb-2 flex justify-between">
                                    <Button label="Sem Categoria" severity="secondary" text size="small"
                                        icon="pi pi-minus" @click="apagaCategoria(data)" />
                                </div>

                            </template>
                            <template #option="{ node }">
                                <div class="flex-row">
                                    <div>
                                        {{ node.label }}
                                    </div>
                                </div>
                            </template>
                            <template #footer>
                                <div class="px-3 pt-1 pb-2 flex justify-between">
                                    <Button label="Nova Categoria" severity="secondary" text size="small"
                                        icon="pi pi-plus" @click="openNewCategoria" />
                                </div>
                            </template>
                        </TreeSelect>
                    </template>
                </Column>

                <Column v-if="verificouCategorias"><template #body="{ data }">
                        <span v-if="JSON.stringify(data.categoria) === '{}'">


                        </span>
                        <span v-else>
                            <i class="pi pi-check"></i>

                        </span>
                    </template>
                </Column>
            </DataTable>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogDoc" />
            <Button label="Salvar" icon="pi pi-check" text @click="salvarDoc(id)" />
        </template>
    </Dialog>




    <div>
        <Dialog v-model:visible="displaycategDialog" :style="{ width: '450px' }" header="Categoria" :modal="true"
            class="p-fluid">
            <div class="field">
                <label for="Categoria">Nome</label>

                <InputText id="Categoria" v-model.trim="categdodialog.label" required="true" autofocus
                    :invalid="submitted && !categdodialog.label" class="md:w-80 w-full" />
                <small class="p-error" v-if="submitted && !categdodialog.label">Esse campo não pode ficar em
                    branco</small>
            </div>

            <div class="field" v-if="!ehEdit">
                <label for="CatPai">Categoria Pai</label>
                <!-- abaixo tree select com funcao quando selecinar algo -->
                <TreeSelect v-model="selectedParentCategoryKey" :options="categoriasStore.categorias"
                    placeholder="nenhuma" class="md:w-80 w-full" />
            </div>

            <div class="card flex flex-column md:flex-row gap-3">
                <!-- <h4>Filtros</h4> -->
                <div v-if="filtrosNovaTag && filtrosNovaTag.length > 0">
                    <DataTable :value="filtrosNovaTag">
                        <Column field="nome" header="Filtros"></Column>
                        <Column field="criteriosDoFiltro" header="Critérios">
                            <template #body="slotProps">
                                <div v-for="criterio of slotProps.data.criteriosDoFiltro">
                                    <Badge style="white-space: nowrap;" :severity="getSeverity(criterio)"
                                        :value="criterio.label" />
                                </div>
                            </template>
                        </Column>
                        <Column :exportable="false" style="min-width:5rem">
                            <template #body="slotProps">
                                <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                                    @click="editFiltro(slotProps.data, slotProps.index)" />
                                <Button icon="pi pi-trash" rounded severity="secondary"
                                    @click="removeFiltro(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>


            </div>


            <div class="card flex justify-content-center">
                <Button label="Filtro" icon="pi pi-plus" @click="novoFiltroCateg()" />
                <Dialog v-model:visible="showfiltroCategDialog" modal :style="{ width: '50vw' }">
                    <div>
                        <div class="field">


                            <label for="nomedialogFiltro">Nome</label>
                            <InputText id="nomedialogFiltro" v-model.trim="filtroDoDialogCateg.nome" required="true"
                                autofocus :invalid="submitted && !filtroDescricao" class="md:w-80 w-full" />
                            <small class="p-error" v-if="submitted && !filtroDescricao">Esse campo não pode
                                ficar em
                                branco</small>
                        </div>
                        <div class="field">


                            <Card v-for="criterio in filtroDoDialogCateg.criteriosDoFiltro" class="cardPlantio">
                                <template #header>
                                    <div class="p-d-flex p-jc-between ">

                                        <Button icon="pi pi-times" class="p-button-rounded  p-button-contrast"
                                            @click="removecriterio(criterio)" aria-label="Filter" />
                                    </div>
                                </template>
                                <template template #content>

                                    <div class="field">
                                        <label for="Categoria">Tipo do Filtro</label>
                                        <div class="flex align-items-center">
                                            <RadioButton v-model="criterio.tipoFiltro" inputId="descricaoradio"
                                                name="descricaoradio" value="Descrição" />
                                            <label for="descricaoradio" class="ml-2">Descrição</label>
                                        </div>
                                        <div class="flex align-items-center">
                                            <RadioButton v-model="criterio.tipoFiltro" inputId="valorradio"
                                                name="valorradio" value="Valor" />
                                            <label for="valorradio" class="ml-2">Valor</label>
                                        </div>
                                        <div class="flex align-items-center">
                                            <RadioButton v-model="criterio.tipoFiltro" inputId="dataradio"
                                                name="dataradio" value="Data" />
                                            <label for="dataradio" class="ml-2">Data</label>
                                        </div>
                                    </div>

                                    <div v-if="criterio.tipoFiltro == 'Descrição'" class="field">
                                        <div v-if="criterio.tipoFiltro == 'Descrição'" class="field">
                                            <label for="nomeNovoFiltro">Termo da transação</label>
                                            <InputText id="nomeNovoFiltro" v-model.trim="criterio.filtroDescricao"
                                                required="true" autofocus
                                                :invalid="submitted && !criterio.filtroDescricao"
                                                class="md:w-80 w-full" />
                                            <small class="p-error" v-if="submitted && !criterio.filtroDescricao">Esse
                                                campo
                                                não
                                                pode
                                                ficar em
                                                branco</small>
                                        </div>


                                    </div>
                                    <div v-if="criterio.tipoFiltro == 'Valor'" class="flex flex-column gap-3">


                                        <div class="flex flex-row gap-3">
                                            <label for="Categoria">Menor que</label>
                                            <InputText id="valorMenorq" v-model="criterio.valorMenorque" />
                                        </div>

                                        <div class="flex flex-row gap-3">
                                            <label for="Categoria">Maior que</label>
                                            <InputText id="valorMaiorque" v-model="criterio.valorMaiorque" />
                                        </div>


                                    </div>
                                    <div v-if="criterio.tipoFiltro == 'Data'" class="flex flex-column gap-3">


                                        <div class="flex flex-row gap-3">
                                            <label for="Categoria">Anterior ao dia</label>
                                            <InputText id="diaMenorQ" v-model="criterio.diaMenorQue" />
                                        </div>

                                        <div class="flex flex-row gap-3">
                                            <label for="Categoria">Depois do dia</label>
                                            <InputText id="diaMaiorQ" v-model="criterio.diaMaiorQue" />
                                        </div>
                                    </div>
                                </template>
                            </Card>
                        </div>
                    </div>
                    <div class="center">
                        <Button icon="pi pi-plus" label="Adicionar Critério" rounded outlined aria-label="Filter"
                            @click="addCriteriosDoFiltro" />
                    </div>

                    <Button :disabled="!filtroDoDialogCateg.criteriosDoFiltro.length > 0" label="Salvar"
                        icon="pi pi-save" @click=salvarCriterios() />
                </Dialog>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogCateg" />
                <Button label="Salvar" icon="pi pi-check" text @click="salvarCateg" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCategoriaDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="categdodialog">Tem certeza que deseja deletar <b>{{ categdodialog.label
                        }}</b>?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" text @click="deleteCategoriaDialog = false" />
                <Button label="Sim" icon="pi pi-check" text @click="removeCategory(categdodialog)" />
            </template>
        </Dialog>



    </div>


</template>


<script setup>
const props = defineProps({
    id: String
})

import { onBeforeMount } from 'vue';


import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Badge from 'primevue/badge';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import TreeSelect from 'primevue/treeselect';
import RadioButton from 'primevue/radiobutton';


import { useAtivoDados } from "../composables/useAtivoDados";
import { useAtivoControle } from "../composables/useAtivoControle";
import { useFilesParser } from '@/composables/useFilesParser';
import { useFiltrosECategorias } from '@/composables/useFiltrosECategorias';

import { useUserStore } from '@/stores/user';
import { useContasStore } from '@/stores/contasStore';
import { useCategoriasStore } from '@/stores/categoriasStore';


const userStore = useUserStore();
const contasStore = useContasStore();
const categoriasStore = useCategoriasStore();


const {
    displayDocDialog,
    submitted,
    onNodeSelect,
    onNodeUnSelect,
} = useAtivoControle();




const {
    tableData,
    verificouCategorias,
} = useAtivoDados(userStore,
    contasStore, props.id);


onBeforeMount(() => {
    contasStore.loadContas(userStore.user.id);
    contasStore.loadmodelosbancos();

    categoriasStore.loadCategories(userStore.user.id);
});


const {
    deleteCategoriaDialog,
    showfiltroCategDialog,
    displayfiltrosDialog,
    ehEditFiltro,
    ehEdit,
    displaycategDialog,
    filtrosNovaTag,
    categdodialog,
    selectedParentCategoryKey,
    filtroDoDialogCateg,


    openNewCategoria,
    salvarCriterios,
    apagaCategoria,
    addCriteriosDoFiltro,
    novoFiltroCateg,
    removecriterio,
    removeFiltro,
    addfiltro,
    salvarTransacao,
    editFiltro,
    hideDialogCateg,
    salvarCateg,
    removeCategory,
    editCategoria,

} = useFiltrosECategorias(
    submitted,
    tableData,
    categoriasStore,
    contasStore
);

const {
    handleFileUpload,
    verificaTodosOsFiltros,
} = useFilesParser(
    tableData,
    submitted,
    displayDocDialog,
    verificouCategorias
);



const salvarDoc = (id) => {
    var transacoes = [];

    //Trata os dados para salvar no banco

    tableData.value.forEach(transacao => {
        if (transacao.descricao !== '' && transacao.descricao !== undefined) {
            transacoes.push({
                tid: Math.random().toString(16).slice(2),
                data: transacao.date,
                descricao: transacao.descricao,
                valor: transacao.valor,
                categoria: transacao.categoria,
            });
        }
    });

    console.log('transacoes');
    console.log(transacoes);


    //Salva no banco

    console.log('useContasStore.addTransacoes(userStore.user.id,id,transacoes)');


    // transforma o id em numero
    var intid = parseInt(id);
    contasStore.addTransacoes(userStore.user.id, intid, transacoes);
    displayDocDialog.value = true;
};



</script>