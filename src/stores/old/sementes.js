import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import {
  setDoc,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { funcoesCRUD } from "@/services/firebaseFunctions";
import router from "../router";

export const useSementesStore = defineStore("sementes", {
  state: () => {
    const sementes = [];
    const especSementes = ref([]);
    const loadingSementes = ref(false);

    const setSementes = (newvalue) => {
      sementes.value = newvalue;
    };

    return {
      sementes,
      especSementes,
      loadingSementes,
      /* setSementes, */
    };
  },
  actions: {
    async fetchSementes() {
      const colRef = collection(db, "sementes");
      getDocs(colRef)
        .then((snapshot) => {
          this.sementes = [];
          snapshot.docs.forEach((doc) => {
            let semente = {
              ...doc.data(),
              id: doc.id,
            };

            this.sementes.push(semente);
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    async fetchEspecSementes() {
      const colRef = collection(db, "especSementes");
      getDocs(colRef)
        .then((snapshot) => {
          this.especSementes = [];
          snapshot.docs.forEach((doc) => {
            let especSemente = { ...doc.data(), id: doc.id };
            this.especSementes.push(especSemente);
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },

    async setaSemente(s) {
      try {
        const docref = doc(db, "sementes", s.id);
        let index = this.sementes.findIndex((semente) => s.id == semente.id);

        await updateDoc(docref, s).then(() => {
          this.sementes[index] = s;
          /* this.sementes.sort((a, b) =>
            a.microverde > b.microverde ? 1 : -1
          ); */
        });
      } catch (e) {
        alert("Erro alterando semente: ", e);
        console.error("Erro alterando semente: ", e);
      }
    },

    async setaEspecSemente(e) {
      try {
        const docref = doc(db, "especSementes", e.id);
        let index = this.especSementes.findIndex((es) => e.id == es.id);

        await updateDoc(docref, e).then(() => {
          this.especSementes[index] = e;
          /* this.especSementes.sort((a, b) =>
            a.microverde > b.microverde ? 1 : -1
          ); */
        });
      } catch (e) {
        alert("Erro alterando especificacao de semente: ", e);
        console.error("Erro alterando especificacao de semente: ", e);
      }
    },
    async deletaSemente(semente) {
      try {
        const docRef = doc(db, "sementes", semente.id);
        let index = this.sementes.findIndex((s) => s.id == semente.id);
        await deleteDoc(docRef).then(() => {
          this.sementes.splice(index, 1);
        });
      } catch (e) {
        alert("Erro deletando semente: ", e);
        console.error("Erro deletando semente: ", e);
      }
    },
    async deletaEspecSemente(especSemente) {
      try {
        const docRef = doc(db, "especSementes", especSemente.id);
        let index = this.especSementes.findIndex(
          (es) => es.id == especSemente.id
        );
        await deleteDoc(docRef).then(() => {
          this.especSementes.splice(index, 1);
        });
      } catch (e) {
        alert("Erro deletando especificacao de semente: ", e);
        console.error("Erro deletando especificacao de semente: ", e);
      }
    },
    async addSemente(s) {
      try {
        s.disponivel = true;
        const docRef = await addDoc(collection(db, "sementes"), s);
        s.id = docRef.id;
        this.sementes.unshift(s);
      } catch (e) {
        alert("Erro adicionando semente: ", e);
        console.error("Erro adicionando semente: ", e);
      }
    },

    async addEspecSemente(es) {
      try {
        const docRef = await addDoc(collection(db, "especSementes"), es);
        es.id = docRef.id;
        this.especSementes.push(es);
      } catch (e) {
        alert("Erro adicionando especificacao de semente: ", e);
        console.error("Erro adicionando especificacao de semente: ", e);
      }
    },
  },
});
