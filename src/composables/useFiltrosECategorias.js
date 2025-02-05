import { ref, computed, onBeforeMount } from "vue";
import { useUserStore } from "@/stores/user";
import { useContasStore } from "@/stores/contasStore";

export function useFiltrosECategorias(submitted, tableData, categoriasStore) {
  const contasStore = useContasStore();
  const deleteCategoriaDialog = ref(false);
  const showfiltroCategDialog = ref(false);
  const displayfiltrosDialog = ref(false);
  const ehEditFiltro = ref(false);
  const ehEdit = ref(false);
  const displaycategDialog = ref(false);
  const filtrosNovaTag = ref([]);
  const categdodialog = ref({ filtros: [] });
  const selectedParentCategoryKey = ref(null);
  const filtroDoDialogCateg = ref({ criteriosDoFiltro: [{}] });
  const indexEditFiltro = ref({});

  const userStore = useUserStore();

  const openNewCategoria = () => {
    ehEdit.value = false;
    categdodialog.value = {};
    filtroDoDialogCateg.value = { criteriosDoFiltro: [{}] };
    selectedParentCategoryKey.value = null;
    submitted.value = false;
    displaycategDialog.value = true;
    filtrosNovaTag.value = [];
  };

  const apagaCategoria = (node) => {
    console.log("apagando");
    console.log(node);
    node.categoria = {};
    node.selectedCateg = false;
  };

  const addCriteriosDoFiltro = () => {
    filtroDoDialogCateg.value.criteriosDoFiltro.push({});
  };

  const removecriterio = (criterio) => {
    filtroDoDialogCateg.value.criteriosDoFiltro =
      filtroDoDialogCateg.value.criteriosDoFiltro.filter((p) => p !== criterio);
  };

  const removeFiltro = (filtro) => {
    filtrosNovaTag.value = filtrosNovaTag.value.filter((p) => p !== filtro);
  };

  const addfiltro = (categoria, descricaofiltro, index) => {
    /* { "nome": "Cassi", "criteriosDoFiltro": [ { "filtroDescricao": "Cassi", "tipoFiltro": "Descrição", "label": "Cassi" } ] } */
    tableData.value[index]["selectedCateg"] = false;
    editCategoria(categoria);
    novoFiltroCateg({
      nome: descricaofiltro,
      criteriosDoFiltro: [
        {
          filtroDescricao: descricaofiltro,
          tipoFiltro: "Descrição",
          label: descricaofiltro,
        },
      ],
    });
  };

  const salvarTransacao = (categoria, id, tid, index, data) => {
    contasStore.updateCategoriaTransacao(userStore.user.id, id, tid, categoria);
  };

  const editFiltro = (filtro, index) => {
    indexEditFiltro.value = index;
    ehEditFiltro.value = true;
    filtroDoDialogCateg.value = { ...filtro };
    showfiltroCategDialog.value = true;
  };

  const novoFiltroCateg = (novoFiltro) => {
    console.log("novoFiltro");
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
    filtrosNovaTag.value = [];

    filtrosNovaTag.value = [];
  };

  const salvarCateg = () => {
    submitted.value = true;
    if (categValida()) {
      if (ehEdit.value) {
        console.log("editando");
        console.log(categdodialog.value);
        let newCategory = {
          key: categdodialog.value.key,
          label: categdodialog.value.label,
          value: categdodialog.value.label,
          filtros: filtrosNovaTag.value,
        };
        categoriasStore.updateCategory(userStore.user.id, newCategory);
      } else {
        console.log("salvando");
        let parentKey = selectedParentCategoryKey.value
          ? Object.keys(selectedParentCategoryKey.value)[0]
          : null;
        let newCategory = {
          key: Date.now(),
          label: categdodialog.value.label,
          value: categdodialog.value.label,
          filtros: filtrosNovaTag.value,
        };
        categoriasStore.addCategory(userStore.user.id, newCategory, parentKey);
      }

      displaycategDialog.value = false;
      categdodialog.value = {};
      selectedParentCategoryKey.value = null;
      submitted.value = false;
      ehEdit.value = false;
      filtrosNovaTag.value = [];
    } else {
      console.log("erro");
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

  const salvarCriterios = () => {
    if (ehEditFiltro.value) {
      var filtroeditado = trataCriterios();
      filtrosNovaTag.value[indexEditFiltro.value] = filtroeditado;
    } else {
      var novoFiltro = trataCriterios();
      filtrosNovaTag.value.push(novoFiltro);
    }
    showfiltroCategDialog.value = false;
    filtroDoDialogCateg.value = { criteriosDoFiltro: [{}] };
  };

  const trataCriterios = () => {
    console.log(filtroDoDialogCateg.value.criteriosDoFiltro);
    var novoFiltro = {
      nome: filtroDoDialogCateg.value.nome,
      criteriosDoFiltro: [],
    };
    filtroDoDialogCateg.value.criteriosDoFiltro.forEach((criterio) => {
      novoFiltro.criteriosDoFiltro.push(trataCriterio(criterio));
    });
    return novoFiltro;
  };

  const trataCriterio = (criterio) => {
    var f = { tipoFiltro: criterio.tipoFiltro, label: "" };

    if (criterio.tipoFiltro == "Valor") {
      f.label = "";
      if (
        criterio.valorMaiorque !== "" &&
        criterio.valorMaiorque !== undefined
      ) {
        f.label = f.label + criterio.valorMaiorque + "<";
        f.valorMaiorque = criterio.valorMaiorque;
      }
      f.label = f.label + "Valor";
      if (
        criterio.valorMenorque !== "" &&
        criterio.valorMenorque !== undefined
      ) {
        f.label = f.label + "<" + criterio.valorMenorque;
        f.valorMenorque = criterio.valorMenorque;
      }
    } else if (criterio.tipoFiltro == "Data") {
      f.label = "";
      if (criterio.diaMaiorQue !== "" && criterio.diaMaiorQue !== undefined) {
        f.label = f.label + criterio.diaMaiorQue + "<";
        f.diaMaiorQue = criterio.diaMaiorQue;
      }
      f.label = f.label + "Data";
      if (criterio.diaMenorQue !== "" && criterio.diaMenorQue !== undefined) {
        f.label = f.label + "<" + criterio.diaMenorQue;
        f.diaMenorQue = criterio.diaMenorQue;
      }
    } else if (criterio.tipoFiltro == "Descrição") {
      if (
        criterio.filtroDescricao !== "" &&
        criterio.filtroDescricao !== undefined
      ) {
        f.label = criterio.filtroDescricao;
        f.filtroDescricao = criterio.filtroDescricao;
      }
    }
    return f;
  };

  return {
    deleteCategoriaDialog,
    showfiltroCategDialog,
    displayfiltrosDialog,
    ehEditFiltro,
    ehEdit,
    displaycategDialog,
    filtrosNovaTag,
    categdodialog,
    selectedParentCategoryKey,
    filtroDoDialogCateg,

    openNewCategoria,
    salvarCriterios,
    apagaCategoria,
    addCriteriosDoFiltro,
    novoFiltroCateg,
    removecriterio,
    removeFiltro,
    addfiltro,
    salvarTransacao,
    editFiltro,
    hideDialogCateg,
    salvarCateg,
    removeCategory,
    editCategoria,
  };
}
