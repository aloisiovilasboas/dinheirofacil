import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      id: null,
      email: null,
      admin: false,
      apto: false,
    },
    isLogged: false,
    isAdmin: false,
  }),
  actions: {
    setUser(user) {
      this.user = user;
      this.isLogged = !!user.id;
      this.isAdmin = !!user.admin;
    },
    resetUser() {
      this.user = {
        id: null,
        email: null,
        admin: false,
        apto: false,
      };
      this.isLogged = false;
      this.isAdmin = false;
    },
    async initializeUser() {
      const auth = getAuth();
      return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              // Busca detalhes adicionais no Firestore
              const docRef = doc(db, "usuarios", firebaseUser.uid);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                this.setUser({
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  ...docSnap.data(),
                });
              } else {
                this.setUser({
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  admin: false,
                  apto: false,
                });
              }
              resolve();
            } catch (error) {
              console.error("Erro ao buscar detalhes do usuário:", error);
              this.resetUser();
              reject(error);
            }
          } else {
            this.resetUser();
            resolve();
          }
        });
      });
    },
  },
});
