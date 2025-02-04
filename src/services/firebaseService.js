import { getAuth, signOut } from "@firebase/auth";

export const firebaseService = {
  async signOutUser() {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log("Usuário desconectado com sucesso.");
    } catch (error) {
      console.error("Erro ao desconectar o usuário:", error.message);
      throw error; // Relança o erro para ser tratado pelo chamador
    }
  },
};
