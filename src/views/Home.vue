<template>
    <!-- <h1>Entre</h1>

    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Senha" v-model="password" /></p>
    <p><button @click="register">Entrar</button></p>

 -->
    <div>

        <Card class="inscricao">
            <template #header>

                <img src="../assets/logo1.svg" width="100%" />
                <!--     <img src="../assets/imgs/rascunho.png"  /> -->
            </template>
            <template #title>

            </template>
            <!-- <template #subtiirParaRankingtle>
                Bem vindo
            </template> -->
            <template #content>

                <div class="col-12 card_home">

                    <div class="botao_home" v-for="link in links">
                        <div v-if="link.show">
                            <Button class="col-8 p-button-primary" @click="irPara(link.path)">
                                <span class="p-button-icon p-button-icon-left">💰</span>
                                <span class="p-button-label">{{ link.name }}</span>
                            </Button>
                        </div>
                    </div>
                </div>

            </template>
            <template #footer>
                <!-- <Button icon="pi pi-check" label="Save" />
                <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" style="margin-left: .5em" />
        -->
            </template>
        </Card>



    </div>



</template>

<script setup>

import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import InlineMessage from 'primevue/inlinemessage';
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();

const links = ref([

    { name: "Login", path: "/Login", show: !userStore.isLogged },
    /* { name: "Cadastro", path: "/Cadastro", show: !userStore.isLogged }, */
    /* { name: "Painel", path: "/Painel", show: userStore.isapto }, */
    { name: "Perfil", path: "/Perfil", show: userStore.isLogged },
    /* { name: "Sementes", path: "/Sementes", show: userStore.isAdmin }, */
    /* { name: "Produção", path: "/Producao", show: userStore.isAdmin }, */
    { name: "Usuários", path: "/Usuarios", show: userStore.isAdmin },
    { name: "Categorias", path: "/Categorias", show: userStore.isAdmin },
    { name: "Ativos", path: "/ContasECartoes", show: userStore.isAdmin }

]);
const email = ref("");
const password = ref("");
const errMsg = ref() // ERROR MESSSAGE
const router = useRouter()

const irPara = (path) => {
    router.push(path);
}

const register = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
            console.log("Logado com Sucesso")
            router.push('/')
        }).catch((error) => {
            console.log(error.code);
            switch (error.code) {
                case "auth/invalid-email":
                    errMsg.value = "Email inválido";
                    break;
                case "auth/user-not-found":
                    errMsg.value = "Não foi encontrada nenhuma conta com esse email";
                    break;
                case "auth/wrong-password":
                    errMsg.value = "Senha incorreta";
                    break;
                case "auth/user-disabled":
                    errMsg.value = "Usuário desabilitado";
                    break;
                default:
                    errMsg.value = "Não foi possivel fazer o login";
                    break;
            }
        })
};


</script>