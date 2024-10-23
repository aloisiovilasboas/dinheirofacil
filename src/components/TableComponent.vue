<template>
    <div>
        <Button :label="buttonLabel" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
        <DataTable :value="items">
            <Column field="nome" header="Nome"></Column>
            <Column :exportable="false" style="min-width:5rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                        @click="editItem(slotProps)" />
                    <Button icon="pi pi-trash" rounded severity="secondary" @click="deleteItem(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { Button } from 'primevue/button';
import { Column } from 'primevue/column';
import { DataTable } from 'primevue/datatable';

import { ref } from 'vue';

const props = defineProps({
    items: Array,
    buttonLabel: String,
    openNew: Function,
    editItem: Function,
    deleteItem: Function
});
</script>
