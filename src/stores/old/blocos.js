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

export const useBlocosStore = defineStore("blocos", {
  state: () => {
    const blocos = [];

    const setBlocos = (newvalue) => {
      blocos.value = newvalue;
    };

    return {
      blocos,
      setBlocos,
      /* setSementes, */
    };
  },
  actions: {
    async fetchBlocos() {
      const colRef = collection(db, "blocos");
      getDocs(colRef)
        .then((snapshot) => {
          this.blocos = [];
          snapshot.docs.forEach((doc) => {
            let bloco = { ...doc.data(), id: doc.id };

            this.blocos.push(bloco);
          });
          //ordenar por data
          this.blocos.sort((a, b) => {
            return b.created.seconds - a.created.seconds;
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },

    async setaBloco(s) {
      try {
        const docref = doc(db, "blocos", s.id);
        let index = this.blocos.findIndex((bloco) => s.id == bloco.id);
        await updateDoc(docref, s).then(() => {
          this.blocos[index] = s;
        });
      } catch (e) {
        alert("Erro alterando bloco: ", e);
        console.error("Erro alterando bloco: ", e);
      }
    },

    async deletaBloco(bloco) {
      try {
        const docRef = doc(db, "blocos", bloco.id);
        let index = this.blocos.findIndex((s) => s.id == bloco.id);
        await deleteDoc(docRef).then(() => {
          this.blocos.splice(index, 1);
        });
      } catch (e) {
        alert("Erro deletando bloco: ", e);
        console.error("Erro deletando bloco: ", e);
      }
    },

    async addBloco(s) {
      try {
        s.created = Timestamp.now();
        const docRef = await addDoc(collection(db, "blocos"), s);
        s.id = docRef.id;
        //adiciona na primeira posicao do array
        this.blocos.unshift(s);
      } catch (e) {
        alert("Erro adicionando bloco: ", e);
        console.error("Erro adicionando bloco: ", e);
      }
    },
  },
});
