import {
  setDoc,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../services/firebase";

export const funcoesCRUD = {
  async fetch(tabela) {
    const colRef = collection(db, tabela);
    getDocs(colRef)
      .then((snapshot) => {
        const elementos = [];
        snapshot.docs.forEach((doc) => {
          let elemento = { ...doc.data(), id: doc.id };
          elementos.push(elemento);
        });
        return elementos;
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
};
