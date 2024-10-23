// stores/crudStore.js
import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";

export const useCategoriasStore = defineStore("categoriasStore", {
  state: () => ({
    categorias: [], // Armazena a estrutura de árvore das categorias
    loading: false, // Indicador de carregamento
    error: null, // Mensagem de erro
  }),

  actions: {
    // Função para salvar ou atualizar a estrutura completa de categorias no Firestore
    async saveCategories(userId, categories) {
      this.loading = true;
      this.error = null;

      try {
        const docRef = doc(db, "categorias", userId);
        await setDoc(docRef, { userId, categories }, { merge: true });
        this.categorias = categories;
        return { success: true };
      } catch (error) {
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Função para carregar as categorias do Firestore
    async loadCategories(userId) {
      this.loading = true;
      this.error = null;

      try {
        const docRef = doc(db, "categorias", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.categorias = docSnap.data().categories || [];
          return { success: true, data: this.categorias };
        } else {
          return { success: false, error: "Documento não encontrado" };
        }
      } catch (error) {
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Função para atualizar uma categoria específica
    async updateCategory(userId, updatedCategory) {
      // Encontra a categoria na árvore e atualiza a estrutura completa
      const updatedCategories = this._updateTree(
        this.categorias,
        updatedCategory
      );
      await this.saveCategories(userId, updatedCategories);
    },

    // Função para adicionar uma nova categoria ou subcategoria
    async addCategory(userId, newCategory, parentKey = null) {
      // Se `parentKey` for fornecido, adiciona a categoria como subcategoria do parent
      let updatedCategories;
      console.log("parentKey");
      console.log(parentKey);
      if (parentKey) {
        updatedCategories = this._addSubcategory(
          this.categorias,
          newCategory,
          parentKey
        );
      } else {
        // Caso contrário, adiciona a nova categoria ao nível superior
        updatedCategories = [...this.categorias, newCategory];
      }
      console.log(updatedCategories);
      await this.saveCategories(userId, updatedCategories);
    },

    // Função para remover uma categoria específica
    async deleteCategory(userId, categoryKey) {
      // Remove a categoria e atualiza a estrutura completa
      const updatedCategories = this._deleteNode(this.categorias, categoryKey);
      await this.saveCategories(userId, updatedCategories);
    },

    // Função auxiliar para atualizar uma categoria dentro da árvore
    _updateTree(tree, updatedCategory) {
      return tree.map((node) => {
        if (node.key === updatedCategory.key) {
          return { ...node, ...updatedCategory }; // Atualiza a categoria encontrada
        } else if (node.children) {
          return {
            ...node,
            children: this._updateTree(node.children, updatedCategory),
          };
        }
        return node;
      });
    },

    // Função auxiliar para adicionar uma subcategoria em um nó específico
    _addSubcategory(tree, newCategory, parentKey) {
      return tree.map((node) => {
        console.log("node");
        console.log(node);
        //converte ambos para string para comparar
        let nodeKey = node.key.toString();
        let parentKeyString = parentKey.toString();
        if (nodeKey === parentKeyString) {
          console.log("node.key === parentKey");
          console.log(node.key);
          return {
            ...node,
            children: node.children
              ? [...node.children, newCategory]
              : [newCategory],
          };
        } else if (node.children) {
          return {
            ...node,
            children: this._addSubcategory(
              node.children,
              newCategory,
              parentKey
            ),
          };
        }
        return node;
      });
    },

    // Função auxiliar para remover uma categoria da árvore
    _deleteNode(tree, categoryKey) {
      return tree
        .filter((node) => {
          //converte ambos para string para comparar
          let nodeKey = node.key.toString();
          let categoryKeyString = categoryKey.toString();
          return nodeKey !== categoryKeyString;
        }) // Remove o nó atual se for o desejado
        .map((node) => ({
          ...node,
          children: node.children
            ? this._deleteNode(node.children, categoryKey)
            : [],
        }));
    },
  },
});
