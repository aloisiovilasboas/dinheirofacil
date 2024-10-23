import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

export const useUsuariosStore = defineStore("usuarios", {
  state: () => {
    const isAdmin = ref(false);
    const setIsAdmin = (newvalue) => {
      isAdmin.value = newvalue;
    };
    const loading = ref(true);
    const usuarios = ref([]);
    const pagos = ref(0);
    const cadastrados = ref(0);
    const setUsuarios = (newvalue) => {
      usuarios.value = newvalue;
    };
    /* const dominio = ref("http://127.0.0.1:5173/#/cadastro/") */
    const dominio = ref("https://bolaoafc2022.firebaseapp.com/#/cadastro/");
    /* const fetchUsuarios = () => {
                const colRef = collection(db, 'usuarios')
                getDocs(colRef)
                .then((snapshot) => {
                    usuarios.value = []
                    snapshot.docs.forEach((doc) => {
                        let unovo = {...doc.data(), id: doc.id, link: dominio.value+doc.id}
                        usuarios.value.push(unovo)
                        console.log(unovo);
                        if (unovo.pago){
                            pagos.value = pagos.value+1
                        }
                        if (unovo.email != 'nao cadastrado'){
                            cadastrados.value = cadastrados.value+1
                        }
                    })
                  //  console.log(usuarios.value);
                }).catch( err=> {
                    console.log(err.message)
                })
            } */
    return {
      pagos,
      cadastrados,
      setUsuarios,
      isAdmin,
      setIsAdmin,
      usuarios,
      loading,
      //fetchUsuarios,
      dominio,
    };
  },
  actions: {
    async fetchUsuarios() {
      const colRef = collection(db, "usuarios");
      getDocs(colRef)
        .then((snapshot) => {
          this.usuarios = [];
          snapshot.docs.forEach((doc) => {
            let unovo = {
              ...doc.data(),
              id: doc.id,
              link: this.dominio + doc.id,
            };
            this.usuarios.push(unovo);
            ///   console.log(unovo);
            if (unovo.pago) {
              this.pagos = this.pagos + 1;
            }
            if (unovo.email != "nao cadastrado") {
              this.cadastrados = this.cadastrados + 1;
            }
          });
          //  console.log(usuarios.value);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },

    async cadastraPlayer(u) {
      try {
        const docRef = await addDoc(collection(db, "usuarios"), {
          nome: u.nome,
          email: u.email,
        });
        //    console.log(docRef);
        //    console.log("Document written with ID: ", docRef.id);
        this.usuarios.push({
          nome: u.nome,
          email: u.email,
          id: docRef.id,
          link: this.dominio + docRef.id,
        });
        // linkCadastro.value = docRef.id
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },

    async cadastraEmail(u) {
      try {
        const usuarioref = doc(db, "usuarios", this.user.id);
        await updateDoc(usuarioref, {
          email: u.email,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },

    async deleteUsuario(u) {
      //   console.log("delete: "+u.id+" "+u.nome)
      try {
        //const usuarioref = doc(db, "usuarios", this.user.id);
        await deleteDoc(doc(db, "usuarios", u.id));
        console.log("usuario excluido");
        this.usuarios = this.usuarios.filter((val) => val.id !== u.id);
      } catch (e) {
        console.error("erro ao excluir usuario: ", e);
      }
    },
    /* async pagouUsuario(u) {
                try {
                    
                    db.collection("usuarios").doc(u.id).update({pago: "true"});
                    // console.log(doc);
                    // console.log("Document written with ID: ", docRef.id);
                    // linkCadastro.value = docRef.id
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }, */
    async setaUsuarioAdmin(u, admin) {
      try {
        const usuarioref = doc(db, "usuarios", u.id);
        await updateDoc(usuarioref, {
          admin: admin,
        }).then(() => {
          let index = this.usuarios.findIndex((user) => user.id == u.id);
          this.usuarios[index].admin = admin;
        });
      } catch (e) {
        alert("Erro alterando admin: ", e);
      }
    },

    async setaUsuarioApto(u, apto) {
      try {
        const usuarioref = doc(db, "usuarios", u.id);
        await updateDoc(usuarioref, {
          apto: apto,
        }).then(() => {
          let index = this.usuarios.findIndex((user) => user.id == u.id);
          this.usuarios[index].apto = apto;
        });
      } catch (e) {
        console.error("Erro alterando apto: ", e);
      }
    },
    async naoPagouUsuario(u) {
      try {
        const usuarioref = doc(db, "usuarios", u.id);
        await updateDoc(usuarioref, {
          pago: false,
        });
        let index = this.usuarios.findIndex((user) => user.id == u.id);
        this.usuarios[index].pago = false;
        this.pagos--;
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },

    async getIsAdmin(id) {
      const docRef = doc(db, "admins", id);
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
    },
  },
});
