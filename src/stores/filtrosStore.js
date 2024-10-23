// stores/crudStore.js
import { defineStore } from "pinia";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

export const useFiltrosStore = defineStore("filtrosStore", {
  state: () => ({
    filtros: [], // Array para armazenar os filtros de um usuário
    loading: false, // Estado de carregamento
    error: null, // Estado para armazenar erros
  }),
  actions: {
    // Carregar os filtros de um usuário específico a partir de seu documento no Firestore
    async loadFiltros(userId) {
      this.loading = true;
      this.error = null;

      try {
        // Referência ao documento com o ID do usuário
        const docRef = doc(db, "filtros", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Se o documento existe, acessa os filtros ou define um array vazio
          this.filtros = docSnap.data().filtros || [];
          return { success: true, data: this.filtros };
        } else {
          // Caso não exista, retorna um erro
          return {
            success: false,
            error: "Documento de filtros não encontrado",
          };
        }
      } catch (error) {
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Adicionar um novo filtro ao documento do usuário no Firestore
    async addFiltro(userId, filtro) {
      this.loading = true;
      this.error = null;

      try {
        // Referência ao documento do usuário
        const docRef = doc(db, "filtros", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Se o documento existir, obtém os filtros existentes e adiciona o novo filtro
          const existingData = docSnap.data();
          const updatedFiltros = [...(existingData.filtros || []), filtro];

          // Atualiza o documento com a nova lista de filtros
          await updateDoc(docRef, { filtros: updatedFiltros });

          // Atualiza o estado local com o novo filtro adicionado
          this.filtros.push(filtro);
        } else {
          // Caso o documento não exista, cria um novo documento com o novo filtro
          await setDoc(docRef, { userId, filtros: [filtro] });

          // Define o estado local com o novo filtro
          this.filtros = [filtro];
        }

        return { success: true };
      } catch (error) {
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Editar um filtro existente no documento do usuário no Firestore

    async updateFiltro(userId, updatedFiltro) {
      this.loading = true;
      this.error = null;

      try {
        // Referência ao documento do usuário
        const docRef = doc(db, "filtros", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Obtém os filtros existentes
          const existingData = docSnap.data();
          const updatedFiltros = existingData.filtros.map((filtro) => {
            // Verifica se o filtro atual tem a mesma `key` que o filtro a ser atualizado
            if (filtro.key === updatedFiltro.key) {
              return { ...filtro, ...updatedFiltro }; // Atualiza o filtro com as novas propriedades
            }
            return filtro; // Mantém os outros filtros inalterados
          });

          // Atualiza o documento no Firestore com a nova lista de filtros
          await updateDoc(docRef, { filtros: updatedFiltros });

          // Atualiza o estado local com os filtros atualizados
          this.filtros = updatedFiltros;
        }

        return { success: true };
      } catch (error) {
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },
    async editFiltro(userId, index, updatedFiltro) {
      this.loading = true;
      this.error = null;

      try {
        // Referência ao documento do usuário
        const docRef = doc(db, "filtros", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Obtém os filtros existentes
          const existingData = docSnap.data();
          const updatedFiltros = [...existingData.filtros];

          // Atualiza o filtro no índice correspondente
          updatedFiltros[index] = updatedFiltro;

          // Atualiza o documento no Firestore
          await updateDoc(docRef, { filtros: updatedFiltros });

          // Atualiza o estado local
          this.filtros[index] = updatedFiltro;
        }

        return { success: true };
      } catch (error) {
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Deletar um filtro pelo índice no Firestore
    async deleteFiltro(userId, filtroKey) {
      this.loading = true;
      this.error = null;

      try {
        // Referência ao documento do usuário
        const docRef = doc(db, "filtros", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Obtém os filtros existentes e remove o filtro com a key correspondente
          const existingData = docSnap.data();
          const updatedFiltros = existingData.filtros.filter(
            (filtro) => filtro.key !== filtroKey
          );

          // Atualiza o documento no Firestore com a nova lista de filtros
          await updateDoc(docRef, { filtros: updatedFiltros });

          // Atualiza o estado local removendo o filtro com a key
          this.filtros = this.filtros.filter(
            (filtro) => filtro.key !== filtroKey
          );
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
    // Obter um filtro pelo índice
    getFiltroByIndex(index) {
      return this.filtros[index];
    },
  },
});
