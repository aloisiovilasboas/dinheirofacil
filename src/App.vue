<script setup>
import { ref } from "vue";
import { useLoadingStore } from "./stores/loading";
import { useNavigation } from "./composables/useNavigation";
import Drawer from "primevue/drawer";
import Toolbar from "primevue/toolbar";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import router from "./router";
import { getAuth, signOut } from "@firebase/auth";

// Estado e lógica modularizados
const visibleLeft = ref(false);
const loadingstore = useLoadingStore();
const { links } = useNavigation();

const handleSignOut = () => {
  const auth = getAuth();
  signOut(auth).then(() => {
    router.push("/");
    visibleLeft.value = false;
  });
};

const InlineButtonClickHandler = () => {
  visibleLeft.value = !visibleLeft.value;
};
</script>

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
            <router-link to="/" @click.native="InlineButtonClickHandler">
              <Button class="p-button-text button-sidebar">
                <span style="width: 100%; text-align: center">
                  <img src="./assets/logo1.svg" height="50" />
                </span>
              </Button>
            </router-link>
            <div v-for="link in links" :key="link.name">
              <div v-if="link.show">
                <router-link :to="link.path" @click.native="InlineButtonClickHandler">
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
