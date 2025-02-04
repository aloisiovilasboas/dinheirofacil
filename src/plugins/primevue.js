import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Column from "primevue/column";
import Dialog from "primevue/dialog";

import "primeflex/primeflex.css";
import Aura from "@primevue/themes/aura";
// Substitua por outro tema, se necessário
import "primeicons/primeicons.css";

import locale from "../assets/pt-br.json";

export default {
  install(app) {
    app.use(PrimeVue, {
      locale: locale["pt-br"],
      ripple: true,
      theme: {
        preset: Aura,
      },
    });
    app.use(ToastService);
    app.use(ConfirmationService);

    app.component("Column", Column);
    app.component("Dialog", Dialog);
  },
};
