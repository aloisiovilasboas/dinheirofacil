// stores/crudStore.js
import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";

export const useCrudStore = defineStore("crudStore", {
  state: () => ({
    collections: {}, // Armazena todas as coleções e seus documentos
    loading: false, // Status de carregamento para qualquer ação
    error: null, // Mensagem de erro para qualquer operação
  }),

  actions: {
    // Função principal que lida com ações CRUD genéricas e atualiza o estado por coleção
    async executeAction({ collectionName, action, payload }) {
      const collectionRef = collection(db, collectionName);

      // Atualiza o estado de carregamento
      this.loading = true;
      this.error = null;

      try {
        let result;

        switch (action) {
          case "create":
            const docRef = await addDoc(collectionRef, payload);
            result = { success: true, id: docRef.id };

            // Atualiza o estado da coleção com o novo documento criado
            if (!this.collections[collectionName]) {
              this.collections[collectionName] = [];
            }
            this.collections[collectionName].push({
              id: docRef.id,
              ...payload,
            });
            break;

          case "read":
            const querySnapshot = await getDocs(collectionRef);

            // Atualiza o estado da coleção com os documentos lidos
            this.collections[collectionName] = querySnapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );
            result = { success: true, data: this.collections[collectionName] };
            break;

          case "update":
            const updateRef = doc(db, collectionName, payload.id);
            await updateDoc(updateRef, payload.data);
            result = { success: true };

            // Atualiza o estado do documento dentro da coleção correspondente
            if (this.collections[collectionName]) {
              const index = this.collections[collectionName].findIndex(
                (item) => item.id === payload.id
              );
              if (index !== -1) {
                this.collections[collectionName][index] = {
                  ...this.collections[collectionName][index],
                  ...payload.data,
                };
              }
            }
            break;

          case "delete":
            const deleteRef = doc(db, collectionName, payload.id);
            await deleteDoc(deleteRef);
            result = { success: true };

            // Remove o documento deletado do estado da coleção correspondente
            if (this.collections[collectionName]) {
              this.collections[collectionName] = this.collections[
                collectionName
              ].filter((item) => item.id !== payload.id);
            }
            break;

          default:
            throw new Error("Ação desconhecida");
        }

        this.loading = false;
        return result;
      } catch (error) {
        console.error(
          `Erro ao executar ${action} na coleção ${collectionName}:`,
          error
        );
        this.loading = false;
        this.error = error.message;
        return { success: false, error: error.message };
      }
    },

    // Função para limpar uma coleção específica do estado
    clearCollection(collectionName) {
      if (this.collections[collectionName]) {
        this.collections[collectionName] = [];
      }
    },

    // Função para limpar todo o estado do store
    clearState() {
      this.collections = {};
      this.loading = false;
      this.error = null;
    },
  },
});
