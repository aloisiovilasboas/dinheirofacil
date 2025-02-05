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

export const useCartoesStore = defineStore("cartoesStore", {
  state: () => ({
    cartoes: [], // Array para armazenar os cartoes de um usuário
    loading: false, // Estado de carregamento
    error: null, // Estado para armazenar erros
  }),
  actions: {
    // Carregar as contas de um usuário específico

    async loadCartoes(userId) {
      this.loading = true;
      this.error = null;

      try {
        const docRef = doc(db, "cartoes", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.cartoes = docSnap.data().cartoes || [];
          console.log("cartoes carregadas com sucesso:", this.cartoes); // Confirmação de sucesso
          return { success: true, data: this.cartoes };
        } else {
          return {
            success: false,
            error: "Documento de cartoes não encontrado",
          };
        }
      } catch (error) {
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Adicionar uma nova cartao ao Firestore
    async addCartao(userId, cartao) {
      this.loading = true;
      this.error = null;
      console.log("Adicionando cartao:", cartao); // Verificar se a função é chamada

      try {
        const docRef = doc(db, "cartoes", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          const updatedCartoes = [...(existingData.cartoes || []), cartao];
          await updateDoc(docRef, { cartoes: updatedCartoes });
          this.cartoes.push(cartao);
          console.log("cartao adicionado com sucesso:", cartao); // Confirmação de sucesso
        } else {
          await setDoc(docRef, { userId, cartoes: [cartao] });
          this.cartoes = [cartao];
          console.log("Novo documento criado com o cartao:", cartao); // Confirmação de sucesso
        }

        return { success: true };
      } catch (error) {
        this.error = error.message;
        console.error("Erro ao adicionar cartao:", error); // Captura de erros
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Atualizar uma cartao existente
    async updateCartao(userId, updatedCartao, index) {
      this.loading = true;
      this.error = null;
      console.log("Atualizando cartao:", updatedCartao, index); // Verificar se a função é chamada

      try {
        const docRef = doc(db, "cartoes", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          const updatedCartoes = [...existingData.cartoes];
          updatedCartoes[index] = updatedCartao;

          await updateDoc(docRef, { cartoes: updatedCartoes });
          this.cartoes = updatedCartoes;
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
    async deleteCartao(userId, index) {
      this.loading = true;
      this.error = null;

      try {
        const docRef = doc(db, "cartoes", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          const updatedCartoes = [...existingData.cartoes];

          updatedCartoes.splice(index, 1);
          await updateDoc(docRef, { cartoes: updatedCartoes });
          this.cartoes = updatedCartoes;
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
    getCartaoByIndex(index) {
      return this.cartoes[index];
    },
  },
});
