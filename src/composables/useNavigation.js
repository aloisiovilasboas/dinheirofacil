// src/composables/useNavigation.js
import { computed } from "vue";
import { useUserStore } from "../stores/user";

export const useNavigation = () => {
  const userStore = useUserStore();

  const links = computed(() => [
    { name: "Login", path: "/login", show: !userStore.isLogged },
    { name: "Cadastro", path: "/cadastro", show: !userStore.isLogged },
    { name: "Perfil", path: "/perfil", show: userStore.isLogged },
    { name: "Categorias", path: "/categorias", show: userStore.isAdmin },
    { name: "Usuários", path: "/usuarios", show: userStore.isAdmin },
    {
      name: "Contas e Cartões",
      path: "/contasecartoes",
      show: userStore.isAdmin,
    },
    /* { name: "Produção", path: "/producao", show: userStore.isAdmin }, */
    /* { name: "Sementes", path: "/sementes", show: userStore.isAdmin }, */
  ]);

  return { links };
};
