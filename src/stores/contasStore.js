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
    contas: [], // Array para armazenar as contas de um usuário (sem transações)
    modelosbancos: [], // Array para armazenar os modelos de bancos
    loading: false, // Estado de carregamento
    error: null, // Estado para armazenar erros
  }),
  actions: {
    async updateCategoriaTransacao(
      userId,
      contaIndex,
      transacaoId,
      novaCategoria
    ) {
      console.log(
        "Atualizando categoria da transação:",
        transacaoId,
        novaCategoria
      );
      this.loading = true;
      this.error = null;

      try {
        const docRef = doc(db, "contas", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();

          // Verifica se a conta existe no índice especificado
          const contasAtualizadas = [...existingData.contas];
          if (contasAtualizadas[contaIndex]) {
            const conta = contasAtualizadas[contaIndex];

            // Atualiza a categoria da transação específica
            const transacoesAtualizadas = conta.transacoes.map((transacao) => {
              if (transacao.tid === transacaoId) {
                console.log("Transação encontrada:", transacao);
                return {
                  ...transacao,
                  categoria: novaCategoria, // Atualiza a categoria
                };
              }
              return transacao;
            });

            // Atualiza as transações da conta
            contasAtualizadas[contaIndex] = {
              ...conta,
              transacoes: transacoesAtualizadas,
            };

            // Atualiza o documento no Firestore
            await updateDoc(docRef, { contas: contasAtualizadas });

            // Atualiza o estado local
            this.contas = contasAtualizadas;
            console.log(
              `Categoria atualizada para a transação ${transacaoId} na conta ${contaIndex}`
            );
            return { success: true };
          } else {
            return { success: false, error: "Índice de conta inválido" };
          }
        } else {
          return {
            success: false,
            error: "Documento de contas não encontrado",
          };
        }
      } catch (error) {
        this.error = error.message;
        console.error("Erro ao atualizar categoria da transação:", error);
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },
    async addTransacoes(userId, contaIndex, novasTransacoes) {
      this.loading = true;
      this.error = null;

      try {
        const docRef = doc(db, "contas", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();

          // Atualiza diretamente a conta no índice especificado
          const contasAtualizadas = [...existingData.contas];
          if (contasAtualizadas[contaIndex]) {
            contasAtualizadas[contaIndex] = {
              ...contasAtualizadas[contaIndex],
              transacoes: [
                ...(contasAtualizadas[contaIndex].transacoes || []),
                ...novasTransacoes,
              ],
            };

            // Atualiza o documento no Firestore
            await updateDoc(docRef, { contas: contasAtualizadas });

            // Atualiza o estado local
            this.contas = contasAtualizadas;
            console.log(
              `Transações adicionadas com sucesso à conta no índice ${contaIndex}`
            );
            return { success: true };
          } else {
            return {
              success: false,
              error: "Índice de conta inválido",
            };
          }
        } else {
          return {
            success: false,
            error: "Documento de contas não encontrado",
          };
        }
      } catch (error) {
        this.error = error.message;
        console.error("Erro ao adicionar transações:", error);
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },
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
    // Carregar as contas de um usuário sem as transações
    async loadConta(userId, contaIndex) {
      this.loading = true;
      this.error = null;

      try {
        const docRef = doc(db, "contas", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const contas = docSnap.data().contas || [];

          // Verifica se o índice fornecido é válido
          if (contaIndex >= 0 && contaIndex < contas.length) {
            const conta = contas[contaIndex];
            console.log(
              `Conta carregada com sucesso no índice ${contaIndex}:`,
              conta
            );

            // Retorna a conta especificada
            return { success: true, data: conta };
          } else {
            return { success: false, error: "Índice de conta inválido" };
          }
        } else {
          return {
            success: false,
            error: "Documento de contas não encontrado",
          };
        }
      } catch (error) {
        this.error = error.message;
        console.error("Erro ao carregar conta:", error);
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
          const contas = docSnap.data().contas || [];

          console.log(
            `Contas carregadas com sucesso para o usuário ${userId}:`,
            contas
          );

          // Atualiza o estado local
          this.contas = contas;

          return { success: true, data: contas };
        } else {
          return {
            success: false,
            error: "Documento de contas não encontrado",
          };
        }
      } catch (error) {
        this.error = error.message;
        console.error("Erro ao carregar contas:", error);
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },
    async loadContasSemTransacoes(userId) {
      this.loading = true;
      this.error = null;

      try {
        const docRef = doc(db, "contas", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Exclui a propriedade 'transacoes' ao carregar as contas
          this.contas = (docSnap.data().contas || []).map(
            ({ transacoes, ...rest }) => rest
          );
          console.log(
            "Contas carregadas com sucesso (sem transações):",
            this.contas
          );
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

    // Carregar transações específicas de uma conta
    async loadTransacoes(userId, contaId) {
      this.loading = true;
      this.error = null;

      try {
        const contaRef = doc(db, "contas", userId);
        const docSnap = await getDoc(contaRef);

        if (docSnap.exists()) {
          const conta = (docSnap.data().contas || []).find(
            (c) => c.id === contaId
          );
          if (conta) {
            console.log(
              "Transações carregadas com sucesso:",
              conta.transacoes || []
            );
            return { success: true, data: conta.transacoes || [] };
          } else {
            return { success: false, error: "Conta não encontrada" };
          }
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

    // Adicionar uma nova conta sem transações
    async addConta(userId, conta) {
      this.loading = true;
      this.error = null;
      console.log("Adicionando conta:", conta); // Verificar se a função é chamada

      try {
        // Remove a propriedade 'transacoes' para otimização
        const { transacoes, ...contaSemTransacoes } = conta;

        const docRef = doc(db, "contas", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          const updatedContas = [
            ...(existingData.contas || []),
            contaSemTransacoes,
          ];
          await updateDoc(docRef, { contas: updatedContas });
          this.contas.push(contaSemTransacoes);
          console.log("Conta adicionada com sucesso:", contaSemTransacoes);
        } else {
          await setDoc(docRef, { userId, contas: [contaSemTransacoes] });
          this.contas = [contaSemTransacoes];
          console.log("Novo documento criado com a conta:", contaSemTransacoes);
        }

        return { success: true };
      } catch (error) {
        this.error = error.message;
        console.error("Erro ao adicionar conta:", error);
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Atualizar uma conta existente (sem transações)
    async updateConta(userId, updatedConta, index) {
      this.loading = true;
      this.error = null;
      console.log("Atualizando conta:", updatedConta, index); // Verificar se a função é chamada

      try {
        // Remove a propriedade 'transacoes' para otimização
        const { transacoes, ...updatedContaSemTransacoes } = updatedConta;

        const docRef = doc(db, "contas", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          const updatedContas = [...existingData.contas];
          updatedContas[index] = updatedContaSemTransacoes;

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
  },
});
