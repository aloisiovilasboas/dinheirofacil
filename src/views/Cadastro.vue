<template>
    <!-- <h1>Entre {{ $route.params.id }} </h1> -->

    <div>
        <Card class="inscricao">
            <template #header>
                <img src="../assets/logo1.svg" width="100%" />

            </template>
            <!--  <template #title>
                Entre
            </template> -->
            <!-- <template #subtitle>
                Conclua o cadastro para participar do bolão
            </template> -->
            <template #content>
                <div class="formularioDiv">
                    <InputText class="formulario" id="email" type="text" v-model="email" placeholder="E-mail" />
                    <p></p>
                    <InputText class="formulario" id="nome" type="text" v-model="nome" placeholder="Nome" />
                    <p></p>
                    <InputMask class="formulario" id="telefone" v-model="telefone" mask="(99)99999-9999"
                        placeholder="Telefone" />
                    <p></p>
                    <Password class="formulario" v-model="password" toggleMask placeholder="Senha" :feedback="false" />
                    <p v-if="errMsg"></p>
                    <Password class="formulario" v-model="passwordConfirmation" toggleMask placeholder="Confirme senha"
                        :feedback="false" />
                    <p v-if="errMsg"></p>
                    <InlineMessage class="formulario" severity="error" v-if="errMsg">{{ errMsg }}</InlineMessage>
                </div>
            </template>
            <template #footer>
                <Button icon="pi pi-check" label="Cadastrar" @click="register" />
            </template>
        </Card>
    </div>



</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import router from '@/router';

import Card from "primevue/card";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import Password from "primevue/password";
import Button from "primevue/button";
import InlineMessage from 'primevue/inlinemessage';


import { registrar } from '@/services/firebase';

import { useUserStore } from "../stores/user";
const userStore = useUserStore();


const email = ref("");
const nome = ref("");
const telefone = ref("");

const password = ref("");
const passwordConfirmation = ref("");
const errMsg = ref()
const register = () => {
    if (password.value = passwordConfirmation.value) {
        createUserWithEmailAndPassword(getAuth(), email.value, password.value)
            .then((data) => {
                console.log("Registrado com Sucesso")
                userStore.cadastraEmail({ telefone: telefone.value, email: email.value, nome: nome.value, uid: data.user.uid })
                router.push('/Perfil')
            })
    }
    else {
        console.log('senhas diferentes')
    }

};


</script>