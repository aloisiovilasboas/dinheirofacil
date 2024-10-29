<template>
    <div style="margin-top: 100px">

        <div>
            <Button label="Transações" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewDoc" />
        </div>

        <Card>
            <template #title>{{ contasStore.contas[id].nome }}</template>
            <template #subtitle>
                <div class="flex">
                    {{ contasStore.contas[id].tipo }}
                </div>
                <div class="flex">
                    {{ contasStore.contas[id].banco.sigla }}
                </div>
            </template>
            <template #content>
                <DataTable>
                    <Column field="data" header="Data"></Column>
                    <Column field="descricao" header="Descrição"></Column>
                    <Column field="valor" header="Valor"></Column>
                    <Column field="saldo" header="Saldo"></Column>
                    <Column field="categoria" header="Categoria"></Column>
                    <Column field="conta" header="Conta"></Column>
                    <Column field="tipo" header="Tipo"></Column>
                    <Column field="status" header="Status"></Column>
                    <Column field="observacao" header="Observação"></Column>
                    <Column field="actions" header="Ações"></Column>
                </DataTable>
            </template>
        </Card>
    </div>
    <Dialog v-model:visible="displayDocDialog" header="Novo Documento" :modal="true" class="p-fluid">

        <!-- <div class="field">
    <label for="data" class="block">Data</label>
    <DatePicker v-model="docDoDialog.data" id="data" view="month" dateFormat="mm/yy" />
    <small class="p-error" v-if="submitted && !docDoDialog.data">Esse campo não pode ficar em
        branco</small>
</div> -->
        <div>
            <FileUpload mode="basic" chooseLabel="Documento" accept=".csv,.ofx" :auto="true" :customUpload="true"
                @uploader="handleFileUpload" />
        </div>

        <div class="">

            <DataTable v-if="tableData.length" :value="tableData" tableStyle="min-width: 50rem">

                <Column field="date" header="Data"></Column>
                <Column field="descricao" header="Descrição"></Column>
                <!-- <Column field="parcela" header="Parcela"></Column>
                <Column field="cidade" header="Cidade"></Column>
                <Column field="pais" header="País"></Column>
                <Column field="valorusd" header="Valor usd"></Column> -->
                <Column field="valor" class="valor" style="text-align: right;">
                    <template #header>
                        <div style="min-width: 100%">Valor (R$)</div>
                    </template>
                </Column>
                <Column field="categoria" header="Categoria">

                    <template #body="rowData">
                        <!-- {{ rowData.data }} -->
                        {{ categoriasStore.categorias }}
                        <TreeSelect value="rowData.categoria" :options="categoriasStore.categorias"
                            placeholder="Select Item" class="md:w-80 w-full">
                            <template #options>
                                <span>{{ "asd" }}</span>
                            </template>

                            <template #footer>
                                <div class="px-3 pt-1 pb-2 flex justify-between">
                                    <Button label="Nova Categoria" severity="secondary" text size="small"
                                        icon="pi pi-plus" />

                                </div>
                            </template>

                        </TreeSelect>

                    </template>
                </Column>
            </DataTable>
        </div>
        <!-- <div class="field">
    <label for="Documento">Nome</label>
    <InputText id="Documento" v-model.trim="docDoDialog.nome" required="true" autofocus
        :invalid="submitted && !docDoDialog.nome" class="md:w-80 w-full" />
    <small class="p-error" v-if="submitted && !docDoDialog.nome">Esse campo não pode ficar em
        branco</small>
</div> -->
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogDoc" />
            <Button label="Salvar" icon="pi pi-check" text @click="salvarDoc" />
        </template>
    </Dialog>


</template>

<script setup>
defineProps({
    id: String
})

import { onBeforeMount } from 'vue';

import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import FileUpload from 'primevue/fileupload';

import TreeSelect from 'primevue/treeselect';

import { useCategoriasStore } from '@/stores/categoriasStore';

import { useFiltrosStore } from '@/stores/filtrosStore';
const filtrosStore = useFiltrosStore();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();


const categoriasStore = useCategoriasStore();

import { ref } from 'vue';

import { useContasStore } from '@/stores/contasStore';
const contasStore = useContasStore();

const tableData = ref([]);
const submitted = ref(false);

const displayDocDialog = ref(false);
const docDoDialog = ref({});

const openNewDoc = () => {

    docDoDialog.value = {};
    submitted.value = false;
    displayDocDialog.value = true;
};


const handleFileUpload = (event) => {
    console.log(event.files[0])
    // a depender da extensao do arquivo, chama a funcao correspondente para tratar o arquivo
    const file = event.files[0];
    const ext = file.name.split('.').pop();
    if (ext == 'csv') {
        handleCSVUpload(event);
    } else if (ext == 'ofx') {
        handleOFXUpload(event);
    }
};

const handleCSVUpload = (event) => {
    console.log(event.files[0])

    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const contents = e.target.result;
        const rows = contents.split('\r\n');
        const headers = rows[0].split(',');

        const data = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            const rowData = {};
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if (headers[j] == 'valorbrl') {
                    rowData['valor'] = cell.replace('.', ',');
                } else {
                    rowData[headers[j]] = cell;
                }

            }
            data.push(rowData);
        }
        tableData.value = data;
    };
    reader.readAsText(file);
};





const handleOFXUpload = (event) => {
    // console.log(event.files[0])
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const ofxString = e.target.result;
        const objtree = txml.parse(ofxString)
        const transacoes = objtree[1].children[1].children[0].children[2].children[2].children
        console.log(transacoes)

        /* todo */
        //const headers = ['descricao', 'parcela', 'cidade', 'pais', 'valorusd', 'valorbrl']
        const headers = ['date', 'descricao', 'valorbrl']
        console.log(headers)
        const data = [];
        for (let i = 1; i < transacoes.length; i++) {

            if (transacoes[i].tagName == 'STMTTRN') {
                console.log(transacoes[i])
                const rowData = {}

                const date = transacoes[i].children[1].children[0]
                rowData['ano'] = date.substring(0, 4)
                rowData['mes'] = date.substring(4, 6)
                rowData['dia'] = date.substring(6, 8)
                rowData['date'] = rowData['dia'] + '/' + rowData['mes'] + '/' + rowData['ano']
                rowData['valor'] = transacoes[i].children[2].children[0]
                rowData['valor'] = rowData['valor'].replace('.', ',');
                // rowData['valor'] = 'R$ ' + rowData['valor']
                rowData['id'] = transacoes[i].children[3].children[0]
                rowData['descricao'] = transacoes[i].children[4].children[0]
                rowData['tipo'] = transacoes[i].children[0].children[0]
                rowData['Categoria'] = { id: 1, nome: 'teste' }
                data.push(rowData)
            }
        }
        tableData.value = data;
    };
    reader.readAsText(file);
};



const loadCategoriasEFiltros = async () => {
    console.log(userStore.user.id);
    await filtrosStore.loadFiltros(userStore.user.id);
    await categoriasStore.loadCategories(userStore.user.id);
    console.log(categoriasStore.categorias);
};



const loadmodelosbancos = () => {
    contasStore.loadmodelosbancos();
};

onBeforeMount(() => {
    contasStore.loadContas(userStore.user.id);
    loadmodelosbancos();
    loadCategoriasEFiltros();
});





</script>