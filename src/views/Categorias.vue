<template>

    <div class="flex flex-column ">
        <TabView>
            <TabPanel header="Categorias" :disabled="false">

                <Button label="Categoria" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewCategoria" />

                <Tree :value="categoriasStore.categorias" nodeKey="key" class="w-full md:w-[30rem]">
                    <template #default="{ node }">

                        <div class="flex flex-row gap-1 align-items-center
                        ">
                            <label>{{ node.label }}</label>

                            <Button icon="pi pi-pencil" size="small" severity="secondary" rounded class="mr-2"
                                @click="editCategoria(node)" />
                            <Button icon="pi pi-trash" size="small" rounded severity="secondary"
                                @click="confirmDeleteCateg(node)" />

                            <div class="flex flex-row gap-1 align-items-center">
                                <!-- {{ slotProps.data.filtros }} -->

                                <Badge v-for="filter of node.filtro" :key="filter" :severity="getSeverity(filter)"
                                    :value="filter.filtro">
                                </Badge>

                            </div>


                        </div>
                    </template>
                </Tree>

            </TabPanel>

            <!-- <TabPanel header="Filtros" :disabled="false">
                <Button label="Filtro" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewFiltro" />
                <DataTable :value="filtrosStore.filtros">
                    <Column field="nome" header="Nome"></Column>
                    <Column field="termo" header="Termo"></Column>
                    <Column field="categoria.label" header="Categoria"></Column>

                    <Column :exportable="false" style="min-width:5rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                                @click="editFiltro(slotProps.data)" />
                            <Button icon="pi pi-trash" rounded severity="secondary"
                                @click="confirmDeleteFiltro(slotProps.data)" />
                        </template>
                    </Column>

                </DataTable>
            </TabPanel> -->
        </TabView>
        <div>
            <Dialog v-model:visible="displaycategDialog" :style="{ width: '450px' }" header="Nova categoria"
                :modal="true" class="p-fluid">
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
                        <DataTable :value="filtrosNovaTag
                            ">
                            <Column field="nome" header="Filtros"></Column>
                            <Column field="criteriosDoFiltro" header="Critérios">
                                <template #body="slotProps">
                                    <div v-for="criterio of slotProps.data.criteriosDoFiltro">
                                        <Badge :severity="getSeverity(criterio)" :value="criterio.label" />
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
                                                <small class="p-error"
                                                    v-if="submitted && !criterio.filtroDescricao">Esse campo
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





            <!-- <Dialog v-model:visible="displayfiltrosDialog" :style="{ width: '450px' }" header="Nova categoria"
                :modal="true" class="p-fluid">
                <div class="field">
                    <label for="Filtro">Nome</label>
                    <InputText id="Filtro" v-model.trim="filtrododialog.nome" required="true" autofocus
                        :invalid="submitted && !filtrododialog.nome" class="md:w-80 w-full" />
                    <small class="p-error" v-if="submitted && !filtrododialog.nome">Esse campo não pode ficar em
                        branco</small>
                </div>
                <div class="field">
                    <label for="Termo">Termo</label>
                    <InputText id="Termo" v-model.trim="filtrododialog.termo" required="true" autofocus
                        :invalid="submitted && !filtrododialog.termo" class="md:w-80 w-full" />
                    <small class="p-error" v-if="submitted && !filtrododialog.termo">Esse campo não pode ficar em
                        branco</small>
                </div>
                <div class="field">
                    <label for="Categoria">Categoria</label>
                    <TreeSelect v-model="filtrododialog.categoria" :options="categoriasStore.categorias"
                        placeholder="nenhuma" class="md:w-80 w-full" />
                </div>
                <template #footer>
                    <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogCateg" />
                    <Button label="Salvar" icon="pi pi-check" text @click="salvarFiltro" />
                </template>

            </Dialog> -->

            <Dialog v-model:visible="deleteCategoriaDialog" :style="{ width: '450px' }" header="Confirmar"
                :modal="true">
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

            <!-- <Dialog v-model:visible="deleteFiltroDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="filtrododialog">Tem certeza que deseja deletar <b>{{ filtrododialog.nome
                            }}</b>?</span>
                </div>
                <template #footer>
                    <Button label="Não" icon="pi pi-times" text @click="deleteFiltroDialog = false" />
                    <Button label="Sim" icon="pi pi-check" text @click="removeFilter(filtrododialog)" />
                </template>
            </Dialog> -->

        </div>


    </div>



</template>

<script setup>
import Card from "primevue/card";
import Tree from 'primevue/tree';
import TreeSelect from 'primevue/treeselect';


import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../stores/user";
import { useCrudStore } from "../stores/crudStore";

import { useCategoriasStore } from '@/stores/categoriasStore';
import { useFiltrosStore } from '@/stores/filtrosStore';	// Importa o store de filtros

// Variáveis para armazenar a seleção

const selectedParentCategoryKey = ref(null);

const showfiltroCategDialog = ref(false);

/* 

const tipoFiltro = ref();
const filtroDescricao = ref('');

const valorMenorque = ref('');
const valorMaiorque = ref('');

const diaMenorQue = ref('')

const diaMaiorQue = ref('') */
const filtrosNovaTag = ref([])



import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';


import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';

import DataTable from 'primevue/datatable';

import Badge from "primevue/badge";

const filtroDoDialogCateg = ref({ criteriosDoFiltro: [{}] });


const addCriteriosDoFiltro = () => {
    filtroDoDialogCateg.value.criteriosDoFiltro.push({});
};

const removecriterio = (criterio) => {
    filtroDoDialogCateg.value.criteriosDoFiltro = filtroDoDialogCateg.value.criteriosDoFiltro.filter(p => p !== criterio);
};

const removeFiltro = (filtro) => {
    filtrosNovaTag.value = filtrosNovaTag.value.filter(p => p !== filtro);
};

const categoriasStore = useCategoriasStore();
const filtrosStore = useFiltrosStore();

const displaycategDialog = ref(false);
const categdodialog = ref({ filtros: [] });
const filtrododialog = ref({});
const submitted = ref(false);
const ehEdit = ref(false);
const deleteFiltroDialog = ref(false);
const deleteCategoriaDialog = ref(false);

const displayfiltrosDialog = ref(false);

const ehEditFiltro = ref(false);

const editFiltro = (filtro, index) => {
    indexEditFiltro.value = index
    ehEditFiltro.value = true;
    filtroDoDialogCateg.value = { ...filtro };
    showfiltroCategDialog.value = true;
};

const novoFiltroCateg = () => {
    ehEditFiltro.value = false;
    filtroDoDialogCateg.value = { criteriosDoFiltro: [{}] };
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
/* 
const editFiltro = (filtro) => {
    const catKey = filtro.categoria.key;
    console.log(catKey);
    let cat = encontraCategoriaPeloKey(categoriasStore.categorias, catKey);
    console.log('cat', cat);
    ehEdit.value = true;
    filtrododialog.value = { ...filtro };
    if (cat) {
        filtrododialog.value.categoria = { [cat.key]: true };
    } else {
        filtrododialog.value.categoria = null;
    }
    displayfiltrosDialog.value = true;
};
 */

const confirmDeleteCateg = (categoria) => {
    categdodialog.value = { ...categoria };
    deleteCategoriaDialog.value = true;
};
/* 
const confirmDeleteFiltro = (filtro) => {
    const catKey = filtro.categoria.key;
    console.log(catKey);
    let cat = encontraCategoriaPeloKey(categoriasStore.categorias, catKey);
    console.log('cat', cat);

    filtrododialog.value = { ...filtro };
    if (cat) {
        filtrododialog.value.categoria = { [cat.key]: true };
    } else {
        filtrododialog.value.categoria = null;
    }
    deleteFiltroDialog.value = true;
};
 */


const openNewCategoria = () => {

    ehEdit.value = false;
    categdodialog.value = {};
    filtroDoDialogCateg.value = { criteriosDoFiltro: [{}] };
    selectedParentCategoryKey.value = null;
    submitted.value = false;
    displaycategDialog.value = true;
    filtrosNovaTag.value = []

};
/* 
const openNewFiltro = () => {
    ehEdit.value = false;
    filtrododialog.value = {};
    submitted.value = false;
    displayfiltrosDialog.value = true;
}; */

const categValida = () => {
    if (selectedParentCategoryKey.value !== null) {
        console.log(selectedParentCategoryKey.value);
    }

    return categdodialog.value.label;
};

/* 
const filtroValido = () => {
    if (filtrododialog.value.nome && filtrododialog.value.termo && filtrododialog.value.categoria) {
        return true;
    } else {
        return false;
    }
};
 */
const hideDialogCateg = () => {

    displaycategDialog.value = false;
    submitted.value = false;
    categdodialog.value = {};
    selectedParentCategoryKey.value = null;
    ehEdit.value = false;
    displayfiltrosDialog.value = false;
    filtrododialog.value = {};
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
/* 
const salvarFiltro = () => {
    submitted.value = true;
    if (filtroValido()) {
        let catKey = filtrododialog.value.categoria ? Object.keys(filtrododialog.value.categoria)[0] : null;
        let cataux = encontraCategoriaPeloKey(categoriasStore.categorias, catKey);
        let cat = { key: cataux.key, label: cataux.label };
        console.log('cat');
        console.log(cat);
        if (ehEdit.value) {
            console.log('editando');
            let newFiltro = { key: filtrododialog.value.key, nome: filtrododialog.value.nome, termo: filtrododialog.value.termo, categoria: cat };
            console.log(newFiltro);
            filtrosStore.updateFiltro(userStore.user.id, newFiltro);
        } else {
            console.log('salvando');
            let newFiltro = { key: Date.now(), nome: filtrododialog.value.nome, termo: filtrododialog.value.termo, categoria: cat };
            console.log(newFiltro);
            filtrosStore.addFiltro(userStore.user.id, newFiltro);
        }
        displayfiltrosDialog.value = false;
        filtrododialog.value = {};
        submitted.value = false;
    } else {
        console.log('erro');
    }

    // salva novaespec no banco e fecha o dialog
};
 */
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

const loadCategoriasEFiltros = async () => {
    console.log(userStore.user.id);
    /* await filtrosStore.loadFiltros(userStore.user.id); */
    await categoriasStore.loadCategories(userStore.user.id);
    console.log(categoriasStore.categorias);
};

// Função para remover uma categoria específica
/* 
const removeFilter = async (node) => {
    console.log('removendo');
    console.log(node);
    await filtrosStore.deleteFiltro(userStore.user.id, node.key);
    deleteFiltroDialog.value = false;

};
 */
const removeCategory = async (node) => {
    console.log('removendo');
    console.log(node.key);
    await categoriasStore.deleteCategory(userStore.user.id, node.key);
    deleteCategoriaDialog.value = false;

};


const userStore = useUserStore();


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

onBeforeMount(() => {
    loadCategoriasEFiltros();
});

const indexEditFiltro = ref({})


const salvarCriterios = () => {
    if (ehEditFiltro.value) {
        console.log('editando');
        console.log(filtroDoDialogCateg.value);
        var novoFiltro = trataCriterios()
        filtrosNovaTag.value[indexEditFiltro.value] = novoFiltro

    } else {
        addCriterios()
    }
    showfiltroCategDialog.value = false
    filtroDoDialogCateg.value = { criteriosDoFiltro: [{}] }
    console.log(filtrosNovaTag.value);
};

const trataCriterios2 = (criterios) => {
    var criteriosTratados = []
    criterios.forEach(criterio => {
        criteriosTratados.push(addCriterio(criterio))
    });
    return criteriosTratados
};


const trataCriterios = () => {
    // percorre filtroDoDialogCateg.criteriosDoFiltro e adiciona no filtrosNovaTag
    console.log(filtroDoDialogCateg.value.criteriosDoFiltro);
    var novoFiltro = { nome: filtroDoDialogCateg.value.nome, criteriosDoFiltro: [] }
    filtroDoDialogCateg.value.criteriosDoFiltro.forEach(criterio => {

        novoFiltro.criteriosDoFiltro.push(addCriterio(criterio))

    });

    return novoFiltro
    /*  showfiltroCategDialog.value = false
     filtroDoDialogCateg.value = { criteriosDoFiltro: [{}] } */


};

const addCriterios = () => {
    // percorre filtroDoDialogCateg.criteriosDoFiltro e adiciona no filtrosNovaTag
    console.log(filtroDoDialogCateg.value.criteriosDoFiltro);
    var novoFiltro = { nome: filtroDoDialogCateg.value.nome, criteriosDoFiltro: [] }
    filtroDoDialogCateg.value.criteriosDoFiltro.forEach(criterio => {

        novoFiltro.criteriosDoFiltro.push(addCriterio(criterio))

    });

    filtrosNovaTag.value.push(novoFiltro)
    /*  showfiltroCategDialog.value = false
     filtroDoDialogCateg.value = { criteriosDoFiltro: [{}] } */


};

const addCriterio = (criterio) => {
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
/* 
const addFiltro = () => {
    var f = { tipoFiltro: tipoFiltro.value, filtro: '' }

    if (tipoFiltro.value == 'Valor') {
        f.filtro = ''
        if (valorMaiorque.value !== '') {
            f.filtro = f.filtro + valorMaiorque.value + '<'
        }
        f.filtro = f.filtro + 'Valor'
        if (valorMenorque.value !== '') {
            f.filtro = f.filtro + '<' + valorMenorque.value
        }


    } else if (tipoFiltro.value == 'Data') {

        f.filtro = ''
        if (diaMaiorQue.value !== '') {
            f.filtro = f.filtro + diaMaiorQue.value + '<'
        }
        f.filtro = f.filtro + 'Data'
        if (diaMenorQue.value !== '') {
            f.filtro = f.filtro + '<' + diaMenorQue.value
        }

    }
    else if (tipoFiltro.value == 'Descrição') {
        f.filtro = filtroDescricao.value
    }
    valorMenorque.value = ''
    valorMaiorque.value = ''
    diaMaiorQue.value = ''
    diaMenorQue.value = ''
    tipoFiltro.value = ''
    filtroDescricao.value = ''
    filtrosNovaTag.value.push(f)
    showfiltroCategDialog.value = false
} */

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
/* 
const deleteFiltro = (filtro) => {
    const index = filtrosNovaTag.value.findIndex(obj => obj.filtro === filtro);
    if (index > -1) {
        filtrosNovaTag.value.splice(index, 1);
    }
}
 */
</script>