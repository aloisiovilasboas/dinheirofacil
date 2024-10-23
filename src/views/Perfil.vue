<template>
    <div>
        <Card class="inscricao">
            <template #header>
                <h3>{{ userStore.user.nome }}</h3>
                <h3>{{ userStore.user.email }}</h3>
                <h3>{{ userStore.user.telefone }}</h3>
            </template>
        </Card>

        <div>
            <button @click="createDocument">Criar Documento</button>
            <button @click="readDocuments">Ler Documentos</button>
            <button @click="updateDocument">Atualizar Documento</button>
            <button @click="deleteDocument">Deletar Documento</button>

            <div v-if="data.length">
                <h3>Documentos:</h3>
                <ul>
                    <li v-for="item in data" :key="item.id">{{ item }}</li>
                </ul>
            </div>
        </div>

        <div class="card">
            <!-- Verifica se nodes não está vazio -->
            <Tree v-model:selectionKeys="selectedKey" selectionMode="multiple" :value="testCategories"
                class="w-full md:w-[30rem]"></Tree>
        </div>

        <div class="card">
            <TreeSelect v-model="selectedValue" :options="testCategories" placeholder="Select Item"
                class="md:w-80 w-full" />
        </div>
    </div>
</template>

<script setup>
import Card from "primevue/card";
import Tree from 'primevue/tree';
import TreeSelect from 'primevue/treeselect';

import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/user";
import { useCrudStore } from "../stores/crudStore";

const userStore = useUserStore();
const crudStore = useCrudStore();
const data = ref([]);
const nodes = ref(null);
const selectedValue = ref(null);
const selectedKey = ref(null);

const testCategories = ref([
    {
        key: 1,
        label: 'Category 1',
        value: 'category1',
        children: [
            {
                key: 2,
                label: 'Subcategory 1.1',
                value: 'subcategory1.1'
            },
            {
                key: 3,
                label: 'Subcategory 1.2',
                value: 'subcategory1.2'
            }
        ]
    },
    {
        label: 'Category 2',
        value: 'category2',
        key: 4,
        children: [
            {
                key: 5,
                label: 'Subcategory 2.1',
                value: 'subcategory2.1'
            },
            {
                key: 6,
                label: 'Subcategory 2.2',
                value: 'subcategory2.2'
            }
        ]
    }
]);


// Funções CRUD
const createDocument = async () => {
    const response = await crudStore.executeAction({
        collectionName: 'minha_colecao',
        action: 'create',
        payload: { nome: 'Novo Documento', valor: 123 },
    });
    console.log(response);
};

const readDocuments = async () => {
    const response = await crudStore.executeAction({
        collectionName: 'minha_colecao',
        action: 'read',
    });
    if (response.success) {
        data.value = response.data;
    }
};

const updateDocument = async () => {
    const response = await crudStore.executeAction({
        collectionName: 'minha_colecao',
        action: 'update',
        payload: { id: 'ID_DO_DOCUMENTO', data: { valor: 456 } },
    });
    console.log(response);
};

const deleteDocument = async () => {
    const response = await crudStore.executeAction({
        collectionName: 'minha_colecao',
        action: 'delete',
        payload: { id: 'ID_DO_DOCUMENTO' },
    });
    console.log(response);
};

</script>