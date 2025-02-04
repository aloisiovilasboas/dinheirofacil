import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";
import { useLoadingStore } from "../stores/loading";

const routes = [
  { path: "/", component: () => import("../views/Home.vue") },
  {
    path: "/login",
    component: () => import("../views/Login.vue"),
    meta: { requiresDeslogado: true },
  },
  {
    path: "/cadastro",
    component: () => import("../views/Cadastro.vue"),
    meta: { requiresDeslogado: true },
  },
  {
    path: "/perfil",
    component: () => import("../views/Perfil.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/categorias",
    component: () => import("../views/Categorias.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/usuarios",
    component: () => import("../views/Usuarios.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/contasecartoes",
    component: () => import("../views/ContasECartoes.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/producao",
    component: () => import("../views/Producao.vue"),
    meta: { requiresAdmin: true },
  },
  {
    path: "/ativo/:id",
    name: "ativo",
    component: () => import("../views/Ativo.vue"),
    props: true,
    meta: { requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const loadingStore = useLoadingStore();

  // Ativa o estado de carregamento
  loadingStore.loading = true;

  try {
    // Aguarda a sincronização inicial do estado do usuário
    if (!userStore.user.id) {
      await userStore.initializeUser();
    }

    // Verifica se a rota requer autenticação
    if (to.meta.requiresAuth && !userStore.isLogged) {
      alert("Você precisa estar logado");
      return next("/login");
    }

    // Verifica se a rota requer que o usuário esteja deslogado
    if (to.meta.requiresDeslogado && userStore.isLogged) {
      alert("Você já está logado");
      return next("/");
    }

    // Verifica se a rota requer privilégios de administrador
    if (to.meta.requiresAdmin && !userStore.isAdmin) {
      alert("Acesso restrito a administradores");
      return next("/perfil");
    }

    next();
  } catch (error) {
    console.error("Erro ao processar a rota:", error);
    next("/login");
  }
});

router.afterEach(() => {
  const loadingStore = useLoadingStore();
  // Desativa o estado de carregamento após a navegação
  loadingStore.loading = false;
});

export default router;
