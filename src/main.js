import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";

import { useUserStore } from "./stores/user";

// Inicialização do Firebase
import { inicializarFirebase } from "../src/services/firebase";
inicializarFirebase();

// Configuração do Pinia com persistência
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Configuração do PrimeVue centralizada
import PrimeVuePlugin from "./plugins/primevue";

// Importação do estilo customizado
import "./style.css"; // <--- Adicionada esta linha

// Criação da aplicação Vue
const app = createApp(App);

// Registro de plugins
app.use(pinia);
app.use(router);

const userStore = useUserStore();
userStore.initializeUser();

app.use(PrimeVuePlugin);

// Montagem da aplicação
app.mount("#app");
