<template>
    <div style="margin-top: 100px">

        <div>
            <FileUpload mode="basic" chooseLabel="Fazer upload de extrato" accept=".csv,.ofx" :auto="true"
                :customUpload="true" @uploader="handleFileUpload" />
        </div>

        <div>
            <botaoteste buttonType="primary" @click="handleFileUpload"> Clieque aqui para testar</botaoteste>
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
                            :options="categoriasStore.categorias" placeholder="Select Item" class="md:w-80 w-full">
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
        </div>

        <template #footer>
            <!--   <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogDoc" />
            <Button label="Salvar" icon="pi pi-check" text @click="salvarDoc" /> -->
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
defineProps({
    id: String
})

import { onBeforeMount } from 'vue';

import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Badge from 'primevue/badge';
import Select from 'primevue/select';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import Tree from 'primevue/tree';
import TreeTable from 'primevue/treetable';

import * as txml from 'txml';

import botaoteste from '../components/botaoteste.vue';

import TreeSelect from 'primevue/treeselect';

import { useCategoriasStore } from '@/stores/categoriasStore';

import { useFiltrosStore } from '@/stores/filtrosStore';
const filtrosStore = useFiltrosStore();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { useCartoesStore } from '@/stores/cartoesStore';
const cartoesStore = useCartoesStore();

const onNodeSelect = (rowData, event) => {
    /*  console.log('tempdel:', tempdel); // Teste para ver o conteúdo do evento */
    console.log('Evento node-select:', event); // Teste para ver o conteúdo do evento
    console.log('rowData:', rowData); // Teste para ver o conteúdo do rowData 

    rowData.categCompleta = event; // Armazena o nó completo em categoria
    rowData.selectedCateg = true; // Armazena o nó completo em categoria

}



const categoriasStore = useCategoriasStore();


import { ref } from 'vue';

import { useContasStore } from '@/stores/contasStore';
const contasStore = useContasStore();

const tableData = ref([]);
const submitted = ref(false);

const displayDocDialog = ref(false);
const docDoDialog = ref({});


const getSeverity = (filtro) => {
    console.log('filtro');
    console.log(filtro.tipoFiltro);
    switch (filtro.tipoFiltro) {
        case 'Valor':
            {
                console.log('valor');
                return 'warn';
            }


        case 'Descricao':
            return 'secondary';

        case 'Data':
            return 'warn';

        default:
            return null;
    }
};


const handleFileUpload = (event) => {
    // a depender da extensao do arquivo, chama a funcao correspondente para tratar o arquivo
    const file = event.files[0];
    const ext = file.name.split('.').pop();
    if (ext == 'csv') {
        handleCSVUpload(event);
    } else if (ext == 'ofx') {
        handleOFXUpload(event);
    }

    console.log('tableData');
    console.log(tableData.value);


    submitted.value = false;
    displayDocDialog.value = true;

};

const verificaTodosOsFiltros = () => {
    console.log('verificando todos os filtros');
    for (let i = 0; i < tableData.value.length; i++) {
        const transacao = tableData.value[i];
        if (transacao.descricao) {
            tableData.value[i]['selectedCateg'] = false;
            //zera as categorias
            tableData.value[i]['categoria'] = {};
            verificarFiltrosDaTransacao(categoriasStore.categorias, i)
        }
    }
};

// percorre recursivamente a arvore de categorias e verifica se algum filtro se aplica a transacao

const verificarFiltrosDaTransacao = (categorias, index) => {
    console.log('verificando filtros');
    categorias.forEach(categoria => {
        console.log('categoria');
        console.log(categoria);
        if (categoria.filtros) {
            categoria.filtros.forEach(filtro => {
                if (verificarFiltro(filtro, index)) {
                    console.log('filtro aplicado');
                    console.log(filtro);
                    tableData.value[index]['categoria'] = { [categoria.key]: true };
                    console.log(tableData.value[index]);
                }
            });
        }
        if (categoria.children) {
            verificarFiltrosDaTransacao(categoria.children, index);
        }
    });
};



const verificarFiltro = (filtro, index) => {
    var transacao = tableData.value[index];
    var cabeOFiltro = true
    filtro.criteriosDoFiltro.forEach(criterio => {
        if (criterio.tipoFiltro == 'Valor') {
            if (criterio.valorMaiorque) {
                if (transacao.valor < criterio.valorMaiorque) {
                    cabeOFiltro = false
                }
            }
            if (criterio.valorMenorque) {
                if (transacao.valor > criterio.valorMenorque) {
                    cabeOFiltro = false
                }
            }
        } else if (criterio.tipoFiltro == 'Data') {
            if (criterio.diaMaiorQue) {
                if (transacao.dia < criterio.diaMaiorQue) {
                    cabeOFiltro = false
                }
            }
            if (criterio.diaMenorQue) {
                if (transacao.dia > criterio.diaMenorQue) {
                    cabeOFiltro = false
                }
            }
        } else if (criterio.tipoFiltro == 'Descrição') {
            /* console.log('filtroDescricao');
            console.log(criterio.filtroDescricao);
            console.log(transacao); */
            if (criterio.filtroDescricao) {
                if (!transacao.descricao.includes(criterio.filtroDescricao)) {
                    cabeOFiltro = false
                }
            }
        }
    });
    return cabeOFiltro
}



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
                rowData['categoria'] = {}
                data.push(rowData)
            }
        }
        tableData.value = data;
    };
    reader.readAsText(file);
};

function areObjectsEqual(obj1, obj2) {
    // Verifica se são o mesmo objeto
    if (obj1 === obj2) return true;

    // Verifica se ambos são objetos
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    // Verifica se têm o mesmo número de chaves
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    // Verifica se todas as propriedades e valores são iguais
    for (let key of keys1) {
        if (!keys2.includes(key) || !areObjectsEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

const loadCategoriasEFiltros = async () => {
    console.log(userStore.user.id);
    await filtrosStore.loadFiltros(userStore.user.id);
    await categoriasStore.loadCategories(userStore.user.id);
    console.log(categoriasStore.categorias);
};



const loadmodelosbancos = () => {
    contasStore.loadmodelosbancos();
};


const openNewCategoria = () => {

    ehEdit.value = false;
    categdodialog.value = {};
    filtroDoDialogCateg.value = { criteriosDoFiltro: [{}] };
    selectedParentCategoryKey.value = null;
    submitted.value = false;
    displaycategDialog.value = true;
    filtrosNovaTag.value = []

};

const categdodialog = ref({ filtros: [] });
const displaycategDialog = ref(false);
const ehEdit = ref(false);
const selectedParentCategoryKey = ref(null);
const deleteCategoriaDialog = ref(false);
const filtrosNovaTag = ref([]);
const showfiltroCategDialog = ref(false);
const filtroDoDialogCateg = ref({ criteriosDoFiltro: [{}] });
/* const submittedFiltro = ref(false); */


const addCriteriosDoFiltro = () => {
    filtroDoDialogCateg.value.criteriosDoFiltro.push({});
};

const removecriterio = (criterio) => {
    filtroDoDialogCateg.value.criteriosDoFiltro = filtroDoDialogCateg.value.criteriosDoFiltro.filter(p => p !== criterio);
};

const removeFiltro = (filtro) => {
    filtrosNovaTag.value = filtrosNovaTag.value.filter(p => p !== filtro);
};


const displayfiltrosDialog = ref(false);

const ehEditFiltro = ref(false);


const addfiltro = (categoria, descricaofiltro, index) => {
    /* { "nome": "Cassi", "criteriosDoFiltro": [ { "filtroDescricao": "Cassi", "tipoFiltro": "Descrição", "label": "Cassi" } ] } */

    /*  encontraCategoriaPeloKey 
     console.log('addfiltro'); */
    console.log('index');
    console.log(index);
    tableData.value[index]['selectedCateg'] = false;
    editCategoria(categoria);
    novoFiltroCateg({ nome: descricaofiltro, "criteriosDoFiltro": [{ filtroDescricao: descricaofiltro, tipoFiltro: "Descrição", label: descricaofiltro }] });

};

const editFiltro = (filtro, index) => {
    indexEditFiltro.value = index
    ehEditFiltro.value = true;
    filtroDoDialogCateg.value = { ...filtro };
    showfiltroCategDialog.value = true;
};

const novoFiltroCateg = (novoFiltro) => {
    console.log('novoFiltro');
    console.log(novoFiltro);
    ehEditFiltro.value = false;
    if (novoFiltro) {
        filtroDoDialogCateg.value = { ...novoFiltro };
    } else {
        filtroDoDialogCateg.value = { criteriosDoFiltro: [{}] };
    }
    showfiltroCategDialog.value = true;
};

const editCategoria = (categoria) => {

    const pai = findParentNode(categoriasStore.categorias, categoria.key);
    ehEdit.value = true;
    categdodialog.value = { ...categoria };
    filtrosNovaTag.value = categoria.filtros;

    displaycategDialog.value = true;

    if (pai) {
        selectedParentCategoryKey.value = { [pai.key]: true };
    } else {
        selectedParentCategoryKey.value = null;
    }

    console.log(selectedParentCategoryKey.value);


};

const confirmDeleteCateg = (categoria) => {
    categdodialog.value = { ...categoria };
    deleteCategoriaDialog.value = true;
};

const categValida = () => {
    if (selectedParentCategoryKey.value !== null) {
        console.log(selectedParentCategoryKey.value);
    }

    return categdodialog.value.label;
};

const hideDialogCateg = () => {

    displaycategDialog.value = false;
    submitted.value = false;
    categdodialog.value = {};
    selectedParentCategoryKey.value = null;
    ehEdit.value = false;
    displayfiltrosDialog.value = false;
    filtroDoDialogCateg.value = { criteriosDoFiltro: [{}] };
    submitted.value = false;
    filtrosNovaTag.value = []

    filtrosNovaTag.value = []

};


const salvarCateg = () => {
    submitted.value = true;
    if (categValida()) {
        if (ehEdit.value) {
            console.log('editando');
            console.log(categdodialog.value);
            let newCategory = { key: categdodialog.value.key, label: categdodialog.value.label, value: categdodialog.value.label, filtros: filtrosNovaTag.value };
            categoriasStore.updateCategory(userStore.user.id, newCategory);
        } else {

            console.log('salvando');
            let parentKey = selectedParentCategoryKey.value ? Object.keys(selectedParentCategoryKey.value)[0] : null;
            let newCategory = {
                key: Date.now(), label: categdodialog.value.label, value: categdodialog.value.label
                , filtros: filtrosNovaTag.value
            };
            categoriasStore.addCategory(userStore.user.id, newCategory, parentKey);
        }

        displaycategDialog.value = false;
        categdodialog.value = {};
        selectedParentCategoryKey.value = null;
        submitted.value = false;
        ehEdit.value = false;
        filtrosNovaTag.value = []

    } else {
        console.log('erro');
    }

    // salva novaespec no banco e fecha o dialog


};
const encontraCategoriaPeloKey = (categorias, key) => {
    for (const categoria of categorias) {
        // transforma para string para comparar
        let catstring = categoria.key.toString();
        let keystring = key.toString();
        if (catstring === keystring) {
            return categoria;
        } else if (categoria.children) {
            const found = encontraCategoriaPeloKey(categoria.children, key);
            if (found) return found;
        }
    }
    return null;
};

const removeCategory = async (node) => {
    console.log('removendo');
    console.log(node.key);
    await categoriasStore.deleteCategory(userStore.user.id, node.key);
    deleteCategoriaDialog.value = false;

};

function findParentNode(categorias, childKey) {

    for (const category of categorias) {
        // Verifica se o nó atual possui filhos
        if (category.children) {
            // Percorre os filhos e verifica se algum possui a key fornecida
            for (const child of category.children) {
                if (child.key === childKey) {
                    return category; // Retorna o nó pai
                }
            }
            // Realiza a busca recursiva nos filhos
            const foundParent = findParentNode(category.children, childKey);
            if (foundParent) {
                return foundParent;
            }
        }
    }
    return null; // Retorna null se o nó pai não for encontrado
}



const loadContasECartoes = () => {
    contasStore.loadContas(userStore.user.id);
    cartoesStore.loadCartoes(userStore.user.id);
};

onBeforeMount(() => {
    loadCategoriasEFiltros();
    loadmodelosbancos();
    loadContasECartoes();
});

const indexEditFiltro = ref({})


const salvarCriterios = () => {
    if (ehEditFiltro.value) {
        var filtroeditado = trataCriterios()
        filtrosNovaTag.value[indexEditFiltro.value] = filtroeditado
    } else {
        var novoFiltro = trataCriterios()
        filtrosNovaTag.value.push(novoFiltro)
    }
    showfiltroCategDialog.value = false
    filtroDoDialogCateg.value = { criteriosDoFiltro: [{}] }
};


const trataCriterios = () => {
    console.log(filtroDoDialogCateg.value.criteriosDoFiltro);
    var novoFiltro = { nome: filtroDoDialogCateg.value.nome, criteriosDoFiltro: [] }
    filtroDoDialogCateg.value.criteriosDoFiltro.forEach(criterio => {
        novoFiltro.criteriosDoFiltro.push(trataCriterio(criterio))
    });
    return novoFiltro
};

const trataCriterio = (criterio) => {
    var f = { tipoFiltro: criterio.tipoFiltro, label: '' }

    if (criterio.tipoFiltro == 'Valor') {
        f.label = ''
        if (criterio.valorMaiorque !== '' && criterio.valorMaiorque !== undefined) {
            f.label = f.label + criterio.valorMaiorque + '<'
            f.valorMaiorque = criterio.valorMaiorque
        }
        f.label = f.label + 'Valor'
        if (criterio.valorMenorque !== '' && criterio.valorMenorque !== undefined) {
            f.label = f.label + '<' + criterio.valorMenorque
            f.valorMenorque = criterio.valorMenorque
        }


    } else if (criterio.tipoFiltro == 'Data') {

        f.label = ''
        if (criterio.diaMaiorQue !== '' && criterio.diaMaiorQue !== undefined) {
            f.label = f.label + criterio.diaMaiorQue + '<'
            f.diaMaiorQue = criterio.diaMaiorQue
        }
        f.label = f.label + 'Data'
        if (criterio.diaMenorQue !== '' && criterio.diaMenorQue !== undefined) {
            f.label = f.label + '<' + criterio.diaMenorQue
            f.diaMenorQue = criterio.diaMenorQue
        }

    }
    else if (criterio.tipoFiltro == 'Descrição') {
        if (criterio.filtroDescricao !== '' && criterio.filtroDescricao !== undefined) {
            f.label = criterio.filtroDescricao
            f.filtroDescricao = criterio.filtroDescricao
        }

    }
    return f
};








onBeforeMount(() => {
    contasStore.loadContas(userStore.user.id);
    loadmodelosbancos();
    loadCategoriasEFiltros();
});





</script>