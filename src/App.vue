<template>

  <div class="cssrouterview">
    <div v-if="loadingstore.loading">
      <h3>Carregando...</h3>
      <ProgressSpinner />
    </div>
    <router-view v-else />
  </div>
  <div class="cssmenu">
    <Toolbar fixed class="barra">
      <template #start>
        <Button icon="pi pi-bars" class="p-button-rounded p-button-Primary p-button-text" @click="visibleLeft = true" />
        <h4> Dinheiro Fácil </h4>
      </template>
    </Toolbar>
    <div class="card">
      <Drawer v-model:visible="visibleLeft">
        <div class="card">
          <div class="card-container yellow-container">
            <!-- # router link para o home com a logo -->
            <router-link to="/" @click.native="InlineButtonClickHandler">
              <Button class="p-button-text button-sidebar">
                <!--  span abaixo com a imagem no centro -->
                <span style="width: 100%; text-align: center"><img src="./assets/logo1.svg" height="50">
                </span>
              </Button>
            </router-link>
            <!-- um router link para cada intem na lista de links chamada links utilizando v-for -->
            <div v-for="link in links">
              <div v-if="link.show">
                <router-link :key="link.name" :to="link.path" @click.native="InlineButtonClickHandler">
                  <!-- <h2>{{ link }}</h2> -->
                  <Button class="p-button-text button-sidebar">
                    <span class="p-button-label">{{ link.name }}</span>
                  </Button>
                </router-link>
              </div>
            </div>
            <Button label="Sair" class="p-button-text button-sidebar" icon="pi pi-sign-out" @click="handleSignOut" />

          </div>
        </div>
      </Drawer>
    </div>
  </div>
</template>

<script setup>

import { onBeforeMount, onMounted, onUpdated, ref } from "vue";

import { RouterLink, RouterView } from 'vue-router'
import router from "./router";

import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";

import Drawer from 'primevue/drawer';
import Toolbar from 'primevue/toolbar';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';


import { useLoadingStore } from "./stores/loading"
import { useUserStore } from "./stores/user"
import { useUsuariosStore } from "./stores/usuarios"
import { useCategoriasStore } from "./stores/categoriasStore"




const visibleLeft = ref(false);

const userStore = useUserStore();
const categoriasStore = useCategoriasStore();
const usuariosStore = useUsuariosStore();
const loadingstore = useLoadingStore();
const links = ref([]);

onUpdated(() => {

  links.value = [

    { name: "Login", path: "/Login", show: !userStore.isLogged },
    /* { name: "Cadastro", path: "/Cadastro", show: !userStore.isLogged }, */
    /* { name: "Painel", path: "/Painel", show: userStore.isapto }, */
    { name: "Perfil", path: "/Perfil", show: userStore.isLogged },
    /* { name: "Sementes", path: "/Sementes", show: userStore.isAdmin }, */
    { name: "Categorias", path: "/Categorias", show: userStore.isAdmin },
    { name: "Ativos", path: "/ContasECartoes", show: userStore.isAdmin },
    /* { name: "Produção", path: "/Producao", show: userStore.isAdmin }, */
    { name: "Usuários", path: "/Usuarios", show: userStore.isAdmin }

  ]
})

const InlineButtonClickHandler = () => {
  visibleLeft.value = !visibleLeft.value
}

let auth;





/* onMounted( () => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      //  apostasStore.fetchApostaById(user.uid)
      // user.getIsAdmin(user.uid)
      // user.getIsAdmin(user.uid)
       
      //      console.log('admin: '+usuariosStore.isAdmin);

    } else {
      isLoggedIn.value = false;
    }
  });
}); */


const handleSignOut = () => {
  auth = getAuth();
  signOut(auth).then(() => {
    userStore.resetUser()
    usuariosStore.setUsuarios([])
    categoriasStore.saveCategories(userStore.user.id, [])
    usuariosStore.setIsAdmin(false)
    router.push("/");
    visibleLeft.value = !visibleLeft.value
  });
};

</script>

<style>
.app {
  width: 100%;
}

.button-sidebar {
  width: 100%;
}

.routerview {
  width: 100%;
}

.cssmenu {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}
</style>
