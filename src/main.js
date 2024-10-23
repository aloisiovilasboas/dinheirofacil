import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import "primeflex/primeflex.css";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css"; //icons

import "./style.css";

import ToastService from "primevue/toastservice";

import { inicializarFirebase } from "../src/services/firebase";

/* import { initializeApp } from "firebase/app";
 import { getFirestore } from "firebase/firestore";

 import { firebaseConfig } from './firebaseConfig';

 import PrimeVue from 'primevue/config'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
 
appInstance.component('Column', Column)
appInstance.component('Dialog', Dialog)
appInstance.component('Datatable', DataTable)


// Initialize Firebase

const fireapp = initializeApp(firebaseConfig);

const db = getFirestore(fireapp); */

inicializarFirebase();

const pinia = createPinia();

if (localStorage.getItem("state")) {
  pinia.state.value = JSON.parse(localStorage.getItem("state"));
}

const app = createApp(App);
app.use(ToastService);

app.use(router);
//importa locale de assets/pt-br.json
import locale from "./assets/pt-br.json";
app.use(PrimeVue, {
  locale: locale["pt-br"],
  theme: {
    preset: Aura,
  },
});

import Column from "primevue/column";
import Dialog from "primevue/dialog";
import ConfirmationService from "primevue/confirmationservice";

app.component("Column", Column);
app.component("Dialog", Dialog);

app.use(pinia);
app.use(ConfirmationService);

app.mount("#app");
