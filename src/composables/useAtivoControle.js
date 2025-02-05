import { ref } from "vue";

export function useAtivoControle() {
  const displayDocDialog = ref(false);

  const submitted = ref(false);

  const onNodeSelect = (rowData, event) => {
    /*  console.log('tempdel:', tempdel); // Teste para ver o conteúdo do evento */
    console.log("Evento node-select:", event); // Teste para ver o conteúdo do evento
    console.log("rowData:", rowData); // Teste para ver o conteúdo do rowData

    rowData.categCompleta = event; // Armazena o nó completo em categoria
    rowData.selectedCateg = true; // Armazena o nó completo em categoria
  };

  const onNodeUnSelect = (rowData, event) => {
    console.log("Evento node-unselect:", event); // Teste para ver o conteúdo do evento
    console.log("rowData:", rowData); // Teste para ver o conteúdo do rowData
    rowData.categCompleta = { key: null }; // Armazena o nó completo em categoria
    rowData.selectedCateg = true; // Armazena o nó completo em categoria
  };

  const getSeverity = (filtro) => {
    console.log("filtro");
    console.log(filtro.tipoFiltro);
    switch (filtro.tipoFiltro) {
      case "Valor": {
        console.log("valor");
        return "warn";
      }

      case "Descricao":
        return "secondary";

      case "Data":
        return "warn";

      default:
        return null;
    }
  };

  return {
    displayDocDialog,
    /* categdodialog,
    ehEdit,
    selectedParentCategoryKey,
    deleteCategoriaDialog,
    filtrosNovaTag,
    showfiltroCategDialog,
    filtroDoDialogCateg,
    displayfiltrosDialog,
     */
    submitted,
    onNodeSelect,
    onNodeUnSelect,
    getSeverity,
  };
}
