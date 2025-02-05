import { defineStore } from "pinia";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

export const useContasStore = defineStore("contasStore", {
  state: () => ({
    contas: [], // Array para armazenar as contas de um usuário
    modelosbancos: [], // Array para armazenar os modelos de bancos
    loading: false, // Estado de carregamento
    error: null, // Estado para armazenar erros
  }),
  actions: {
    // Carregar as contas de um usuário específico
    async loadmodelosbancos() {
      this.loading = true;
      this.error = null;

      try {
        const querySnapshot = await getDocs(collection(db, "opcoesbancos"));
        this.modelosbancos = [];
        querySnapshot.forEach((doc) => {
          this.modelosbancos.push(doc.data());
        });
        console.log(
          "Modelos de bancos carregados com sucesso:",
          this.modelosbancos
        ); // Confirmação de sucesso
        return { success: true, data: this.modelosbancos };
      } catch (error) {
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    async loadContas(userId) {
      this.loading = true;
      this.error = null;

      try {
        const docRef = doc(db, "contas", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.contas = docSnap.data().contas || [];
          console.log("Contas carregadas com sucesso:", this.contas); // Confirmação de sucesso
          return { success: true, data: this.contas };
        } else {
          return {
            success: false,
            error: "Documento de contas não encontrado",
          };
        }
      } catch (error) {
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Adicionar uma nova conta ao Firestore
    async addConta(userId, conta) {
      this.loading = true;
      this.error = null;
      console.log("Adicionando conta:", conta); // Verificar se a função é chamada

      try {
        const docRef = doc(db, "contas", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          const updatedContas = [...(existingData.contas || []), conta];
          await updateDoc(docRef, { contas: updatedContas });
          this.contas.push(conta);
          console.log("Conta adicionada com sucesso:", conta); // Confirmação de sucesso
        } else {
          await setDoc(docRef, { userId, contas: [conta] });
          this.contas = [conta];
          console.log("Novo documento criado com a conta:", conta); // Confirmação de sucesso
        }

        return { success: true };
      } catch (error) {
        this.error = error.message;
        console.error("Erro ao adicionar conta:", error); // Captura de erros
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Atualizar uma conta existente
    async updateConta(userId, updatedConta, index) {
      this.loading = true;
      this.error = null;
      console.log("Atualizando conta:", updatedConta, index); // Verificar se a função é chamada

      try {
        const docRef = doc(db, "contas", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          const updatedContas = [...existingData.contas];
          updatedContas[index] = updatedConta;

          await updateDoc(docRef, { contas: updatedContas });
          this.contas = updatedContas;
        }

        return { success: true };
      } catch (error) {
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Excluir uma conta
    async deleteConta(userId, index) {
      this.loading = true;
      this.error = null;

      try {
        const docRef = doc(db, "contas", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          const updatedContas = [...existingData.contas];

          updatedContas.splice(index, 1);
          await updateDoc(docRef, { contas: updatedContas });
          this.contas = updatedContas;
        } else {
          return { success: false, error: "Documento não encontrado" };
        }

        return { success: true };
      } catch (error) {
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Obter uma conta pelo índice
    getContaByIndex(index) {
      return this.contas[index];
    },
  },
});
