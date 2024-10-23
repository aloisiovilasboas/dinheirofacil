import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import {
  addDoc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

//import { inicializarFirebase, auth, db, fs } from "../services/firebase";

//import { collection, doc, getDocs, getFirestore, limit, orderBy, query } from 'firebase/firestore'
//import { useFirestore } from '@vueuse/firebase/useFirestore'

// import { db } from "../services/firebase"

// const usuarios = useFirestore(collection(db, 'usuarios'))

export const useUserStore = defineStore("user", {
  state: () => {
    const admin = ref(false);
    const loggedin = ref(false);
    const apto = ref(false);
    const user = ref({
      apto: false,
      admin: false,
      /* loading: true, */
      id: null,
      email: "email",
      nome: "nan",
    });

    const isAdmin = computed(() => user.value.admin);
    const isapto = computed(() => user.value.apto);
    const isLogged = computed(() => user.value.id != null);

    //    const website = computed(() => user.value.email.substring(user.value.email.lastIndexOf("@") +1 ));

    const resetUser = () => {
      user.value = {
        apto: false,
        admin: false,
        /* loading: true, */
        id: null,
        email: "email",
        nome: "nan",
      };
    };

    const setUser = (u) => {
      user.value = u;
    };

    /* const changeId = (newid) => {
      user.value.id = newid;
    }; */

    return {
      admin,
      loggedin,
      user,
      /* changeId, */
      isAdmin,
      isLogged,
      isapto,
      setUser,
      resetUser,
      /* authuser, */
      /* setAuthUser, */
    };
  },
  actions: {
    /* async getIsAdmin(id) {
      const docRef = doc(db, "usuarios", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        //             console.log("Document data:", docSnap.data());
        this.isAdmin = true;
        this.loading = false;
        //              console.log(docSnap.data())
        return true;
      } else {
        this.isAdmin = false;
        this.loading = false;
        // this.user.valido = false
        // doc.data() will be undefined in this case
        //               console.log("nao existe admin com esse id:"+id);
        return false;
      }
    }, */
    async cadastraEmail(u) {
      try {
        const usuarioref = doc(db, "usuarios", u.uid);
        await setDoc(usuarioref, {
          admin: false,
          apto: false,
          telefone: u.telefone,
          email: u.email,
          nome: u.nome,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },

    async fetchUsuarioById(id) {
      const docRef = doc(db, "usuarios", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        /* console.log("Document data:", docSnap.data()); */
        this.user = { ...docSnap.data(), id: id };
        /*  console.log(this.user); */
        return true;
      } else {
        // this.user.valido = false
        // doc.data() will be undefined in this case
        console.log("nao existe usuario com esse id:" + id);
        return false;
      }
    },
  },
});
