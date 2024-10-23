<TabPanel header="Custos Plantio">
    <div>
      <DataTable sortField="item" :sortOrder="1" :size=small :value="especsStore.especPlantio" dataKey="id">


        <Column v-for="col of colunasEspecs" :key="col.field" :field="col.field" sortable :header="col.header"
          style="min-width: 5rem; text-align: left;">
        </Column>
        <!--  <Column :rowEditor="true" style="width: 10%; min-width: 5rem" bodyStyle="text-align:center"></Column> -->
        <Column :exportable="false" style="min-width:5rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
              @click="editEspecPlantio(slotProps.data)" />
            <Button icon="pi pi-trash" rounded severity="secondary"
              @click="confirmDeleteEspecPlantio(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
      <Toolbar class="mb-4">
        <template #start>
          <Button label="Nova" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewEspecPlantio" />
        </template>
      </Toolbar>
    </div>
    <div>
      <Dialog id="plantiodialog" v-model:visible="especDialogPlantio" :style="{ width: '450px' }"
        header="Novo custo de plantio" :modal="true" class="p-fluid">
        <div class="field">
          <label for="item">Item</label>
          <InputText id="item" v-model.trim="especdodialog.item" required="true" autofocus
            :invalid="submitted && !especdodialog.item" />
          <small class="p-error" v-if="submitted && !especdodialog.item">Esse campo não pode ficar em
            branco</small>
        </div>
        <div class="field">
          <label for="valor">Valor</label>
          <InputNumber id="valor" v-model="especdodialog.valor" required="true" mode="currency" currency="BRL"
            locale="pt-BR" autofocus :invalid="submitted && !especdodialog.valor" />
          <small class="p-error" v-if="submitted && !especdodialog.valor">Esse campo não pode ficar em
            branco</small>
        </div>

        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogEspecPlantio" />
          <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaEspecPlantio" />
        </template>
      </Dialog>
      <Dialog v-model:visible="deleteEspecDialogPlantio" :style="{ width: '450px' }" header="Confirmar"
        :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="especdodialog">Tem certeza que deseja deletar <b>{{ especdodialog.item }}</b>?</span>
        </div>
        <template #footer>
          <Button label="Não" icon="pi pi-times" text @click="deleteEspecDialogPlantio = false" />
          <Button label="Sim" icon="pi pi-check" text @click="deleteEspecPlantio" />
        </template>
      </Dialog>
    </div>
  </TabPanel>
  <TabPanel header="Custos Embalagens">

    <div>
      <DataTable sortField="item" :sortOrder="1" :size=small :value="especsStore.especEmbalagens" dataKey="id">
        <Column v-for="col of colunasEspecs" :key="col.field" :field="col.field" sortable :header="col.header"
          style="min-width: 5rem; text-align: left;">
        </Column>
        <!--  <Column :rowEditor="true" style="width: 10%; min-width: 5rem" bodyStyle="text-align:center"></Column> -->
        <Column :exportable="false" style="min-width:5rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
              @click="editEspecEmbalagem(slotProps.data)" />
            <Button icon="pi pi-trash" rounded severity="secondary"
              @click="confirmDeleteEspecEmbalagem(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
      <Toolbar class="mb-4">
        <template #start>
          <Button label="Nova" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewEspecEmbalagem" />
        </template>
      </Toolbar>
    </div>
    <div>
      <Dialog id="embdialog" v-model:visible="especDialogEmbalagem" :style="{ width: '450px' }"
        header="Novo custo de embalagem" :modal="true" class="p-fluid">
        <div class="field">
          <label for="microverde">Item</label>
          <InputText id="item" v-model.trim="especdodialog.item" required="true" autofocus
            :invalid="submitted && !especdodialog.item" />
          <small class="p-error" v-if="submitted && !especdodialog.item">Esse campo não pode ficar em
            branco</small>
        </div>

        <div class="field">
          <label for="diasEmPilha">Valor</label>
          <InputNumber id="valor" v-model="especdodialog.valor" required="true" mode="currency" currency="BRL"
            locale="pt-BR" autofocus :invalid="submitted && !especdodialog.valor" />
          <small class="p-error" v-if="submitted && !especdodialog.valor">Esse campo não pode ficar em
            branco</small>
        </div>
        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogEspecEmbalagem" />
          <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaEspecEmbalagem" />
        </template>
      </Dialog>
      <Dialog v-model:visible="deleteEspecDialogEmbalagem" :style="{ width: '450px' }" header="Confirmar"
        :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="especdodialog">Tem certeza que deseja deletar <b>{{ especdodialog.item }}</b>?</span>
        </div>
        <template #footer>
          <Button label="Não" icon="pi pi-times" text @click="deleteEspecDialogEmbalagem = false" />
          <Button label="Sim" icon="pi pi-check" text @click="deleteEspecEmbalagem" />
        </template>
      </Dialog>
    </div>
  </TabPanel>