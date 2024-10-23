import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";

export const useLotesStore = defineStore("lotes", {
  state: () => {
    const lotes = [];

    const setLotes = (newvalue) => {
      lotes.value = newvalue;
    };

    return {
      lotes,

      setLotes,
      /* setSementes, */
    };
  },
  actions: {
    async fetchLotes() {
      const colRef = collection(db, "lotes");
      getDocs(colRef)
        .then((snapshot) => {
          this.lotes = [];
          snapshot.docs.forEach((doc) => {
            let lote = { ...doc.data(), id: doc.id };

            this.lotes.push(lote);
          });
          //ordenar por data
          this.lotes.sort((a, b) => {
            return b.created.seconds - a.created.seconds;
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },

    async setaLote(s) {
      console.log("setaLote", s);
      try {
        const docref = doc(db, "lotes", s.id);
        let index = this.lotes.findIndex((lote) => s.id == lote.id);
        await updateDoc(docref, s).then(() => {
          this.lotes[index] = s;
        });
      } catch (e) {
        alert("Erro alterando lote: ", e);
        console.error("Erro alterando lote: ", e);
      }
    },

    async deletaLote(lote) {
      try {
        const docRef = doc(db, "lotes", lote.id);
        let index = this.lotes.findIndex((s) => s.id == lote.id);
        await deleteDoc(docRef).then(() => {
          this.lotes.splice(index, 1);
        });
      } catch (e) {
        alert("Erro deletando lote: ", e);
        console.error("Erro deletando lote: ", e);
      }
    },

    async addLote(s) {
      try {
        s.created = Timestamp.now();
        const docRef = await addDoc(collection(db, "lotes"), s);
        s.id = docRef.id;
        //adiciona na primeira posicao do array
        this.lotes.unshift(s);
      } catch (e) {
        alert("Erro adicionando lote: ", e);
        console.error("Erro adicionando lote: ", e);
      }
    },

    async changePlantioEstado(loteId, indexPlantio, estado) {
      try {
        const docRef = doc(db, "lotes", loteId);
        let index = this.lotes.findIndex((lote) => lote.id == loteId);
        let plantios = this.lotes[index].plantios;
        plantios[indexPlantio].estado = estado;
        await updateDoc(docRef, { plantios: plantios }).then(() => {
          this.lotes[index].plantios = plantios;
        });
      } catch (e) {
        alert("Erro alterando estado do plantio: ", e);
        console.error("Erro alterando estado do plantio: ", e);
      }
    },
  },
});
