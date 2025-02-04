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
                <DataTable v-if="contasStore.contas[id] && contasStore.contas[id].transacoes"
                    :value="contasStore.contas[id].transacoes">
                    <Column>
                        <template #body="{ data, index }">
                            <Checkbox v-model="checkboxes" input-id="'checkbox-index" value="index" />

                        </template>
                    </Column>

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
                <div v-else>
                    <p>Nenhuma transação encontrada para esta conta.</p>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import TreeSelect from 'primevue/treeselect';
import FileUpload from 'primevue/fileupload';

import { fileService } from '@/services/fileService';
import { useCategoriasStore } from '@/stores/categoriasStore';
import { useContasStore } from '@/stores/contasStore';
import { useUserStore } from '@/stores/user';

const categoriasStore = useCategoriasStore();
const contasStore = useContasStore();
const userStore = useUserStore();

const checkboxes = ref([]);
const tableData = ref([]);
const verificouCategorias = ref(false);

const handleFileUpload = async (event) => {
    const file = event.files[0];
    const ext = file.name.split('.').pop().toLowerCase();

    try {
        switch (ext) {
            case 'csv':
                tableData.value = await fileService.handleCSV(file);
                break;
            case 'ofx':
                tableData.value = await fileService.handleOFX(file);
                break;
            case 'pdf':
                const pdfText = await fileService.handlePDF(file);
                // Processar o texto do PDF conforme necessário
                tableData.value = processPDFText(pdfText);
                break;
            default:
                console.error('Formato de arquivo não suportado:', ext);
        }

        verificouCategorias.value = false;
    } catch (error) {
        console.error('Erro ao processar o arquivo:', error);
    }
};

const processPDFText = (text) => {
    // Lógica para processar o texto extraído do PDF
    // Exemplo: converter para dados estruturados
    const rows = text.split('\n').filter(row => row.trim());
    return rows.map(row => ({ descricao: row }));
};

const onNodeSelect = (rowData, event) => {
    rowData.categCompleta = event;
    rowData.selectedCateg = true;
};

const onNodeUnSelect = (rowData, event) => {
    rowData.categCompleta = { key: null };
    rowData.selectedCateg = false;
};
</script>

<style>
/* Adicione aqui os estilos necessários */
</style>
