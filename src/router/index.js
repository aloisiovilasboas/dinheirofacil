import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Cadastro from "../views/Cadastro.vue";
import Categorias from "@/views/Categorias.vue";
import Usuarios from "@/views/Usuarios.vue";
import Sementes from "@/views/Sementes.vue";
import Producao from "@/views/Producao.vue";
import Painel from "../views/Painel.vue";
import Perfil from "../views/Perfil.vue";
import Ativo from "../views/Ativo.vue";

import { useLoadingStore } from "../stores/loading";
import { useUsuariosStore } from "../stores/usuarios";
import { useSementesStore } from "../stores/sementes";
import { useUserStore } from "../stores/user";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

import { getAuth, onAuthStateChanged } from "@firebase/auth";
import ContasECartoes from "@/views/ContasECartoes.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/perfil",
      component: Perfil,
      meta: { requiresAuth: true },
    },
    {
      path: "/painel",
      component: Painel,
      meta: { requiresApto: true },
    },
    {
      path: "/login",
      component: Login,
      meta: { requiresDeslogado: true },
    },
    {
      path: "/cadastro",
      component: Cadastro,
      meta: { requiresDeslogado: true },
    },
    {
      path: "/Sementes",
      name: "Sementes",
      component: Sementes,
      meta: { requiresAdmin: true },
    },

    {
      path: "/ativo/:id",
      name: "ativo",
      component: Ativo,
      props: true,
      meta: { requiresAdmin: true },
    },

    {
      path: "/Producao",
      name: "Produção",
      component: Producao,
      meta: { requiresAdmin: true },
    },
    {
      path: "/Usuarios",
      name: "Usuários",
      component: Usuarios,
      meta: { requiresAdmin: true },
    },

    {
      path: "/categorias",
      name: "Categorias",
      component: Categorias,
      meta: { requiresAdmin: true },
    },

    {
      path: "/contasecartoes",
      name: "Contas e Cartões",
      component: ContasECartoes,
      meta: { requiresAdmin: true },
    },
    /* 
    {
      path: "/Sementes/:id",
      name: "Semente",
      component: Admin,
      meta: { requiresAdmin: true },
    },
    {
      path: "/Usuarios/:id",
      name: "Usuario",
      component: Admin,
      meta: { requiresAdmin: true },
    }, */
  ],
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        resolve(user);
      } else {
        reject("Usuário não logado");
      }
    });
  });
};

const getDetalhesUsuario = (id) => {
  return new Promise((resolve, reject) => {
    onSnapshot(doc(db, "usuarios", id), (doc) => {
      if (doc.exists()) {
        resolve(doc.data());
      } else {
        reject("Usuário não encontrado");
      }
    });
  });
};

const getUsuarioLogado = () => {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then((u) => {
        if (u) {
          getDetalhesUsuario(u.uid).then((d) => {
            if (d) {
              d.id = u.uid;
              /*  console.log(d); */
              resolve(d);
            } else {
              reject("não logado");
            }
          });
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};

router.beforeEach(async (to, from, next) => {
  const loadingStore = useLoadingStore();
  const userStore = useUserStore();
  loadingStore.loading = true;
  await getUsuarioLogado()
    .then((u) => {
      if (u) {
        userStore.setUser(u);
      } else {
        userStore.resetUser();
        console.log("erro");
      }
    })
    .catch((e) => {
      userStore.resetUser();
      /* console.log(e); */
    });

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (userStore.user.id) {
      next();
    } else {
      alert("Você não está logado");
      next("/login");
    }
  } else if (to.matched.some((record) => record.meta.requiresApto)) {
    if (userStore.user.id) {
      if (userStore.user.apto) {
        next();
      } else {
        alert("Você não está apto");
        next("/");
      }
    } else {
      alert("Você não está logado");
      next("/login");
    }
  } else if (to.matched.some((record) => record.meta.requiresDeslogado)) {
    if (userStore.user.id) {
      alert("Você já está logado");
      next("/");
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (userStore.user.id) {
      if (userStore.user.admin) {
        next();
      } else {
        next("/perfil");
        alert("Você não é admin");
      }
    } else {
      next("/login");
      alert("Você não está logado");
    }
  } else {
    next();
  }
  loadingStore.loading = false;
});

/* router.afterEach(() => {
  const loadingStore = useLoadingStore();
  loadingStore.loading = false;
}); */

export default router;
