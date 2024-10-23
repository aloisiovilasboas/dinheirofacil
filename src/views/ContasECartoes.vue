<template>
    <div class="flex flex-column">
        <TabView>
            <TabPanel header="Contas" :disabled="false">
                <Button label="Conta" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewConta" />
                <DataTable :value="contasStore.contas">
                    <Column field="nome" header="Nome"></Column>
                    <Column field="banco.nome" header="Banco"></Column>
                    <Column :exportable="false" style="min-width:5rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                                @click="editConta(slotProps)" />
                            <Button icon="pi pi-trash" rounded severity="secondary"
                                @click="confirmDeleteConta(slotProps)" />
                        </template>
                    </Column>
                </DataTable>
            </TabPanel>

            <TabPanel header="Cartões" :disabled="false">
                <Button label="Cartão" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewCartao" />
                <DataTable :value="cartoesStore.cartoes">
                    <Column field="nome" header="Nome"></Column>
                    <Column field="banco.nome" header="Banco"></Column>
                    <Column :exportable="false" style="min-width:5rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                                @click="editCartao(slotProps)" />
                            <Button icon="pi pi-trash" rounded severity="secondary"
                                @click="confirmDeleteCartao(slotProps)" />
                        </template>
                    </Column>
                </DataTable>
            </TabPanel>
            <TabPanel header="Documentos" :disabled="false">
                <div>
                    <!-- <Button @click="handleCSVUpload" label="Importar CSV" icon="pi pi-upload" iconPos="right" /> -->

                    <!-- <FileUpload mode="basic" name="demo[]" accept=".csv" @select="handleCSVUpload" @upload="onUpload" /> -->
                    <FileUpload mode="basic" chooseLabel="Subir CSV" accept=".csv" :auto="true" :customUpload="true"
                        @uploader="handleCSVUpload" />
                </div>
                <p>--</p>
                <div>
                    <FileUpload mode="basic" chooseLabel="Subir OFX" accept=".ofx" :auto="true" :customUpload="true"
                        @uploader="handleOFXUpload" />
                </div>
                <div class="">

                    <DataTable v-if="tableData.length" :value="tableData" tableStyle="min-width: 50rem">

                        <Column field="date" header="Data"></Column>
                        <Column field="descricao" header="Descrição"></Column>
                        <!--  <Column field="parcela" header="Parcela"></Column>
  <Column field="cidade" header="Cidade"></Column>
  <Column field="pais" header="País"></Column>
  <Column field="valorusd" header="Valor usd"></Column>
  -->
                        <Column field="valor" class="valor" style="text-align: right;">
                            <template #header>
                                <div style="min-width: 100%">Valor (R$)</div>
                            </template>
                        </Column>

                    </DataTable>

                </div>

            </TabPanel>
        </TabView>

        <!-- Dialog for Contas -->
        <Dialog v-model:visible="displayContaDialog" :style="{ width: '450px' }" header="Nova Conta" :modal="true"
            class="p-fluid">
            <div class="field">
                <label for="Conta">Nome</label>
                <InputText id="Conta" v-model.trim="contaDoDialog.nome" required="true" autofocus
                    :invalid="submitted && !contaDoDialog.nome" class="md:w-80 w-full" />
                <small class="p-error" v-if="submitted && !contaDoDialog.nome">Esse campo não pode ficar em
                    branco</small>

            </div>
            <div class="field">
                <label for="Banco">Banco</label>
                <Select id="Banco" v-model="contaDoDialog.banco" :options="contasStore.modelosbancos" optionLabel="nome"
                    placeholder="Selecione um banco" class="md:w-80 w-full" />
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogConta" />
                <Button label="Salvar" icon="pi pi-check" text @click="salvarConta" />
            </template>
        </Dialog>


        <Dialog v-model:visible="deleteContaDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Tem certeza que deseja deletar <b>{{ contaDoDialog.nome
                        }}</b>?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" text @click="deleteContaDialog = false" />
                <Button label="Sim" icon="pi pi-check" text @click="removeConta(contaDoDialog)" />
            </template>
        </Dialog>

        <!-- Dialog for cartoes -->
        <Dialog v-model:visible="displayCartaoDialog" :style="{ width: '450px' }" header="Nova Cartão" :modal="true"
            class="p-fluid">
            <div class="field">
                <label for="Conta">Nome</label>
                <InputText id="Conta" v-model.trim="cartaoDoDialog.nome" required="true" autofocus
                    :invalid="submitted && !contaDoDicartaoDoDialogalog.nome" class="md:w-80 w-full" />
                <small class="p-error" v-if="submitted && !cartaoDoDialog.nome">Esse campo não pode ficar em
                    branco</small>

            </div>
            <div class="field">
                <label for="Banco">Banco</label>
                <Select id="Banco" v-model="cartaoDoDialog.banco" :options="contasStore.modelosbancos"
                    optionLabel="nome" placeholder="Selecione um banco" class="md:w-80 w-full" />
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogCartao" />
                <Button label="Salvar" icon="pi pi-check" text @click="salvarCartao" />
            </template>
        </Dialog>


        <Dialog v-model:visible="deleteCartaoDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Tem certeza que deseja deletar <b>{{ cartaoDoDialog.nome
                        }}</b>?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" text @click="deleteCartaoDialog = false" />
                <Button label="Sim" icon="pi pi-check" text @click="removeCartao(cartaoDoDialog)" />
            </template>
        </Dialog>

    </div>
</template>

<script setup>
import { ref } from "vue";
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Select from 'primevue/select';
import Column from 'primevue/column';
import { useContasStore } from '@/stores/contasStore';
import { useCartoesStore } from '@/stores/cartoesStore';
import { useUserStore } from "@/stores/user";

import FileUpload from 'primevue/fileupload';


import * as txml from 'txml';

import { onBeforeMount } from 'vue';

const contasStore = useContasStore();
const cartoesStore = useCartoesStore();

const userStore = useUserStore();

const ehEdit = ref({ 'value': false, 'index': null });

const displayContaDialog = ref(false);
const displayCartaoDialog = ref(false);
const contaDoDialog = ref({});
const cartaoDoDialog = ref({});
const submitted = ref(false);

const loadContasECartoes = () => {
    contasStore.loadContas(userStore.user.id);
    cartoesStore.loadCartoes(userStore.user.id);
};

const loadmodelosbancos = () => {
    contasStore.loadmodelosbancos();
};

// Handlers for Contas
const openNewConta = () => {
    ehEdit.value = { 'value': false, 'index': null };
    contaDoDialog.value = {};
    submitted.value = false;
    displayContaDialog.value = true;
};

const editConta = (node) => {
    console.log('editConta', node);
    ehEdit.value = { 'value': true, 'index': node.index };
    submitted.value = false;
    contaDoDialog.value = { ...node.data };
    displayContaDialog.value = true;
};

const deleteContaDialog = ref(false);

const delContaIndex = ref(null);

const confirmDeleteConta = (node) => {
    console.log('delconta', node.data.nome, node.index);
    delContaIndex.value = node.index;
    contaDoDialog.value = { ...node.data };
    deleteContaDialog.value = true;
};


const removeConta = async (node) => {
    console.log('removendo');
    console.log(node);
    await contasStore.deleteConta(userStore.user.id, delContaIndex.value);
    deleteContaDialog.value = false;

};



const salvarConta = () => {
    submitted.value = true;
    if (contaDoDialog.value.nome) {
        if (ehEdit.value.value) {
            console.log('editando', contaDoDialog.value);
            contasStore.updateConta(useUserStore().user.id, contaDoDialog.value, ehEdit.value.index);
        } else {
            console.log('contaDoDialog.value', contaDoDialog.value);
            console.log('userStore.user.uid', userStore.user.id);
            contasStore.addConta(useUserStore().user.id, contaDoDialog.value);
        }
        displayContaDialog.value = false;
        contaDoDialog.value = {};
        ehEdit.value = false;
    }
};

const hideDialogConta = () => {
    displayContaDialog.value = false;
    contaDoDialog.value = {};
    ehEdit.value = false;
};

// Handlers for Cartoes

const openNewCartao = () => {
    ehEdit.value = { 'value': false, 'index': null };
    cartaoDoDialog.value = {};
    submitted.value = false;
    displayCartaoDialog.value = true;
};

const editCartao = (node) => {
    console.log('editCartao', node);
    ehEdit.value = { 'value': true, 'index': node.index };
    submitted.value = false;
    cartaoDoDialog.value = { ...node.data };
    displayCartaoDialog.value = true;
};

const deleteCartaoDialog = ref(false);

const delCartaoIndex = ref(null);

const confirmDeleteCartao = (node) => {
    console.log('delcartao', node.data.nome, node.index);
    delCartaoIndex.value = node.index;
    cartaoDoDialog.value = { ...node.data };
    deleteCartaoDialog.value = true;
};

const removeCartao = async (node) => {
    console.log('removendo');
    console.log(node);
    await cartoesStore.deleteCartao(userStore.user.id, delCartaoIndex.value);
    deleteCartaoDialog.value = false;

};

const salvarCartao = () => {
    submitted.value = true;
    if (cartaoDoDialog.value.nome) {
        if (ehEdit.value.value) {
            console.log('editando', cartaoDoDialog.value);
            cartoesStore.updateCartao(useUserStore().user.id, cartaoDoDialog.value, ehEdit.value.index);
        } else {
            console.log('cartaoDoDialog.value', cartaoDoDialog.value);
            console.log('userStore.user.uid', userStore.user.id);
            cartoesStore.addCartao(useUserStore().user.id, cartaoDoDialog.value);
        }
        displayCartaoDialog.value = false;
        cartaoDoDialog.value = {};
        ehEdit.value = false;
    }
};

const hideDialogCartao = () => {
    displayCartaoDialog.value = false;
    cartaoDoDialog.value = {};
    ehEdit.value = false;
};




onBeforeMount(() => {
    loadmodelosbancos();
    loadContasECartoes();
});






/* import { useFilesStore } from '../stores/files.js'; */

const tableData = ref([]);
/* const store = useFilesStore(); */

/* const onUpload = () => {
  console.log('teste33')
} */


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
                data.push(rowData)
            }
        }
        tableData.value = data;
    };
    reader.readAsText(file);
};


</script>