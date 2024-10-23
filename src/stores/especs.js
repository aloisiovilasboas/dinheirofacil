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

export const useEspecsStore = defineStore("especs", {
  state: () => {
    const especPlantio = [];
    const especEmbalagens = [];

    const setEspecPlantio = (newvalue) => {
      especPlantio.value = newvalue;
    };

    const setEspecEmbalagens = (newvalue) => {
      especEmbalagens.value = newvalue;
    };

    return {
      especPlantio,
      especEmbalagens,
      setEspecPlantio,
      setEspecEmbalagens,
    };
  },
  actions: {
    async fetchEspecPlantio() {
      const colRef = collection(db, "especPlantio");
      getDocs(colRef)
        .then((snapshot) => {
          this.especPlantio = [];
          snapshot.docs.forEach((doc) => {
            let espec = { ...doc.data(), id: doc.id };

            this.especPlantio.push(espec);
          });
          //ordenar por data
          this.especPlantio.sort((a, b) => {
            return b.created.seconds - a.created.seconds;
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },

    async fetchEspecEmbalagens() {
      const colRef = collection(db, "especEmbalagens");
      getDocs(colRef)
        .then((snapshot) => {
          this.especEmbalagens = [];
          snapshot.docs.forEach((doc) => {
            let espec = { ...doc.data(), id: doc.id };

            this.especEmbalagens.push(espec);
          });
          //ordenar por data
          this.especEmbalagens.sort((a, b) => {
            return b.created.seconds - a.created.seconds;
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },

    async setaEspecPlantio(s) {
      try {
        const docref = doc(db, "especPlantio", s.id);
        let index = this.especPlantio.findIndex((espec) => s.id == espec.id);
        await updateDoc(docref, s).then(() => {
          this.especPlantio[index] = s;
        });
      } catch (e) {
        alert("Erro alterando especPlantio: ", e);
        console.error("Erro alterando especPlantio: ", e);
      }
    },

    async setaEspecEmbalagens(s) {
      try {
        const docref = doc(db, "especEmbalagens", s.id);
        let index = this.especEmbalagens.findIndex((espec) => s.id == espec.id);
        await updateDoc(docref, s).then(() => {
          this.especEmbalagens[index] = s;
        });
      } catch (e) {
        alert("Erro alterando especEmbalagens: ", e);
        console.error("Erro alterando especEmbalagens: ", e);
      }
    },

    async deletaEspecPlantio(espec) {
      try {
        const docRef = doc(db, "especPlantio", espec.id);
        let index = this.especPlantio.findIndex((s) => s.id == espec.id);
        await deleteDoc(docRef).then(() => {
          this.especPlantio.splice(index, 1);
        });
      } catch (e) {
        alert("Erro deletando especPlantio: ", e);
        console.error("Erro deletando especPlantio: ", e);
      }
    },

    async deletaEspecEmbalagens(espec) {
      try {
        const docRef = doc(db, "especEmbalagens", espec.id);
        let index = this.especEmbalagens.findIndex((s) => s.id == espec.id);
        await deleteDoc(docRef).then(() => {
          this.especEmbalagens.splice(index, 1);
        });
      } catch (e) {
        alert("Erro deletando especEmbalagens: ", e);
        console.error("Erro deletando especEmbalagens: ", e);
      }
    },
    async addEspecPlantio(s) {
      try {
        s.created = Timestamp.now();
        const docRef = await addDoc(collection(db, "especPlantio"), s);
        s.id = docRef.id;
        //adiciona na primeira posicao do array
        this.especPlantio.unshift(s);
      } catch (e) {
        alert("Erro adicionando especPlantio: ", e);
        console.error("Erro adicionando especPlantio: ", e);
      }
    },

    async addEspecEmbalagens(s) {
      try {
        s.created = Timestamp.now();
        const docRef = await addDoc(collection(db, "especEmbalagens"), s);
        s.id = docRef.id;
        //adiciona na primeira posicao do array
        this.especEmbalagens.unshift(s);
      } catch (e) {
        alert("Erro adicionando especEmbalagens: ", e);
        console.error("Erro adicionando especEmbalagens: ", e);
      }
    },
  },
});
