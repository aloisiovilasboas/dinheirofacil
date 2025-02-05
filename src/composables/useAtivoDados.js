import { ref, onBeforeMount } from "vue";

export function useAtivoDados(userStore, contasStore, id) {
  const tableData = ref([]);
  const verificouCategorias = ref(false);

  return {
    tableData,
    verificouCategorias,
  };
}
