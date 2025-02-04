<template>
    <div>
        <Card class="inscricao">
            <template #header>
                <div>
                    <img src="../assets/logo1.svg" width="100%" />
                </div>
            </template>
            <template #content>
                <div class="formularioDiv">
                    <InputText class="formulario" id="email" type="text" v-model="email" placeholder="E-mail" />
                    <p></p>
                    <Password class="formulario" v-model="password" toggleMask placeholder="Senha" :feedback="false" />
                    <p v-if="errMsg"></p>
                    <InlineMessage class="formulario" severity="error" v-if="errMsg">
                        {{ errMsg }}
                    </InlineMessage>
                </div>
            </template>
            <template #footer>
                <Button icon="pi pi-check" label="Entrar" @click="register" />
            </template>
        </Card>
    </div>
</template>

<script setup>
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import InlineMessage from "primevue/inlinemessage";
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errMsg = ref(); // ERROR MESSAGE
const router = useRouter();

const register = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then(() => {
            router.push("/perfil"); // Redireciona após login bem-sucedido
        })
        .catch((error) => {
            console.error(error.code);
            switch (error.code) {
                case "auth/invalid-email":
                    errMsg.value = "Email inválido";
                    break;
                case "auth/user-not-found":
                    errMsg.value = "Usuário não encontrado";
                    break;
                case "auth/wrong-password":
                    errMsg.value = "Senha incorreta";
                    break;
                default:
                    errMsg.value = "Erro ao realizar login";
                    break;
            }
        });
};
</script>