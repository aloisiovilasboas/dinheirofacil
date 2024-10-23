<template>

    <div class="flex flex-column ">
        <TabView>
            <TabPanel header="Categorias" :disabled="false">

                <Button label="Categoria" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewCategoria" />

                <Tree :value="categoriasStore.categorias" nodeKey="key" class="w-full md:w-[30rem]">
                    <template #default="{ node }">
                        <div>
                            {{ node.label }}
                            <Button icon="pi pi-pencil" size="small" severity="secondary" rounded class="mr-2"
                                @click="editCategoria(node)" />
                            <Button icon="pi pi-trash" size="small" rounded severity="secondary"
                                @click="confirmDeleteCateg(node)" />
                            <!-- <button @click="editCategory(node)">Editar</button>
                            <button @click="removeCategory(node.key)">Remover</button> -->
                        </div>
                    </template>
                </Tree>

            </TabPanel>

            <TabPanel header="Filtros" :disabled="false">
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
            </TabPanel>
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
                <template #footer>
                    <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogCateg" />
                    <Button label="Salvar" icon="pi pi-check" text @click="salvarCateg" />
                </template>
            </Dialog>



            <Dialog v-model:visible="displayfiltrosDialog" :style="{ width: '450px' }" header="Nova categoria"
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

            </Dialog>

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

            <Dialog v-model:visible="deleteFiltroDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="filtrododialog">Tem certeza que deseja deletar <b>{{ filtrododialog.nome
                            }}</b>?</span>
                </div>
                <template #footer>
                    <Button label="Não" icon="pi pi-times" text @click="deleteFiltroDialog = false" />
                    <Button label="Sim" icon="pi pi-check" text @click="removeFilter(filtrododialog)" />
                </template>
            </Dialog>

        </div>

    </div>



</template>

<script setup>
import Card from "primevue/card";
import Tree from 'primevue/tree';
import TreeSelect from 'primevue/treeselect';

import { onBeforeMount, onMounted, ref } from "vue";
import { useUserStore } from "../stores/user";
import { useCrudStore } from "../stores/crudStore";

import { useCategoriasStore } from '@/stores/categoriasStore';
import { useFiltrosStore } from '@/stores/filtrosStore';	// Importa o store de filtros

// Variáveis para armazenar a seleção

const selectedParentCategoryKey = ref(null);


const tipoFiltro = ref();
const filtroDescricao = ref('');

const valorMenorque = ref('');
const valorMaiorque = ref('');

const diaMenorQue = ref('')

const diaMaiorQue = ref('')
const filtrosNovaTag = ref([])



import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';


import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';

import DataTable from 'primevue/datatable';



const categoriasStore = useCategoriasStore();
const filtrosStore = useFiltrosStore();

const displaycategDialog = ref(false);
const categdodialog = ref({});
const filtrododialog = ref({});
const submitted = ref(false);
const ehEdit = ref(false);
const deleteFiltroDialog = ref(false);
const deleteCategoriaDialog = ref(false);

const displayfiltrosDialog = ref(false);



const editCategoria = (categoria) => {

    const pai = findParentNode(categoriasStore.categorias, categoria.key);
    ehEdit.value = true;
    categdodialog.value = { ...categoria };

    displaycategDialog.value = true;

    if (pai) {
        selectedParentCategoryKey.value = { [pai.key]: true };
    } else {
        selectedParentCategoryKey.value = null;
    }

    console.log(selectedParentCategoryKey.value);


};

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


const confirmDeleteCateg = (categoria) => {
    categdodialog.value = { ...categoria };
    deleteCategoriaDialog.value = true;
};

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



const openNewCategoria = () => {
    ehEdit.value = false;
    categdodialog.value = {};
    selectedParentCategoryKey.value = null;
    submitted.value = false;
    displaycategDialog.value = true;
};

const openNewFiltro = () => {
    ehEdit.value = false;
    filtrododialog.value = {};
    submitted.value = false;
    displayfiltrosDialog.value = true;
};

const categValida = () => {
    if (selectedParentCategoryKey.value !== null) {
        console.log(selectedParentCategoryKey.value);
    }

    return categdodialog.value.label;
};


const filtroValido = () => {
    if (filtrododialog.value.nome && filtrododialog.value.termo && filtrododialog.value.categoria) {
        return true;
    } else {
        return false;
    }
};

const hideDialogCateg = () => {
    displaycategDialog.value = false;
    submitted.value = false;
    categdodialog.value = {};
    selectedParentCategoryKey.value = null;
    ehEdit.value = false;
    displayfiltrosDialog.value = false;
    filtrododialog.value = {};
};


const salvarCateg = () => {
    submitted.value = true;
    if (categValida()) {
        if (ehEdit.value) {
            console.log('editando');
            console.log(categdodialog.value);
            let newCategory = { key: categdodialog.value.key, label: categdodialog.value.label, value: categdodialog.value.label };
            categoriasStore.updateCategory(userStore.user.id, newCategory);
        } else {
            console.log('salvando');
            let parentKey = selectedParentCategoryKey.value ? Object.keys(selectedParentCategoryKey.value)[0] : null;
            let newCategory = { key: Date.now(), label: categdodialog.value.label, value: categdodialog.value.label };
            categoriasStore.addCategory(userStore.user.id, newCategory, parentKey);
        }

        displaycategDialog.value = false;
        categdodialog.value = {};
        selectedParentCategoryKey.value = null;
        submitted.value = false;

    } else {
        console.log('erro');
    }

    // salva novaespec no banco e fecha o dialog


};

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
    await filtrosStore.loadFiltros(userStore.user.id);
    await categoriasStore.loadCategories(userStore.user.id);
};

// Função para remover uma categoria específica

const removeFilter = async (node) => {
    console.log('removendo');
    console.log(node);
    await filtrosStore.deleteFiltro(userStore.user.id, node.key);
    deleteFiltroDialog.value = false;

};

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

</script>