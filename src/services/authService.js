// src/services/authService.js
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user); // Usuário autenticado
      } else {
        reject(new Error("Usuário não está autenticado"));
      }
    });
  });
};

export const getDetalhesUsuario = (id) => {
  return new Promise((resolve, reject) => {
    onSnapshot(doc(db, "usuarios", id), (doc) => {
      if (doc.exists()) {
        resolve(doc.data());
      } else {
        reject("Usuário não encontrado");
      }
    });
  });
};

export const getUsuarioLogado = async () => {
  const user = await getCurrentUser();
  const detalhes = await getDetalhesUsuario(user.uid);
  return { ...detalhes, id: user.uid };
};
