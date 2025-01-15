<template>
    <div>
        <Card class="inscricao">
            <template #header>
                <h3>{{ userStore.user.nome }}</h3>
                <h3>{{ userStore.user.email }}</h3>
                <h3>{{ userStore.user.telefone }}</h3>
            </template>
        </Card>

        <Button icon="pi pi-trash" outlined rounded class="mr-2" severity="secondary" @click="backupBanco" />

    </div>
</template>

<script setup>
import Card from "primevue/card";
import Tree from 'primevue/tree';
import TreeSelect from 'primevue/treeselect';

import Button from 'primevue/button';

import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/user";
import { useCrudStore } from "../stores/crudStore";

const userStore = useUserStore();
const crudStore = useCrudStore();
const data = ref([]);
const nodes = ref(null);
const selectedValue = ref(null);
const selectedKey = ref(null);


// Funções CRUD
const backupBanco = async () => {
    try {
        console.log("Iniciando o backup do banco para download");

        // Faz o backup de todas as coleções
        const result = await crudStore.backupAllCollections();
        if (result.success) {
            // Converte o objeto JSON em string
            const jsonString = JSON.stringify(result.data, null, 2);

            // Cria um blob a partir do JSON
            const blob = new Blob([jsonString], { type: "application/json" });

            // Cria um link para download
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `backup-${new Date().toISOString().split("T")[0]}.json`;

            // Aciona o download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log("Backup baixado com sucesso");
        } else {
            console.error("Erro ao gerar backup para download:", result.error);
        }
    } catch (error) {
        console.error("Erro no processo de backup e download:", error);
    }
};


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