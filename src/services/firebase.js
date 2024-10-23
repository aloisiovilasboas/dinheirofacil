import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/* import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebaseConfig';
//import initializeApp from "firebase/app";

import { auth }from "firebase/auth";
import { storage} from "firebase/storage";
import { db } from "firebase/firestore";
//import { fs } from "firebase"
 */

import { firebaseConfig } from "../firebaseConfig";
initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const inicializarFirebase = () => {
  initializeApp(firebaseConfig);
};
const fs = app;
const auth = getAuth(app);
const db = getFirestore(app);
//const storage = getStorage(app);

export {
  inicializarFirebase,
  getCurrentUser,
  registrar,
  auth,
  db,
  fs /*, storage*/,
};

// criar funcao de registrar usando a api do firebase

const registrar = (email, password) => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("Registrado com sucesso");
      const user = userCredential.user;
      router.push("/feed");
    })
    .catch((error) => {
      console.log("erro");
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};

const getCurrentUser = () => {
  logado = null;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in");
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      logado = user;
      // ...
    } else {
      console.log("User is signed out");
      // User is signed out
      // ...
    }
    return logado;
  });
};

/* const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();
const fs = firebase
 */
