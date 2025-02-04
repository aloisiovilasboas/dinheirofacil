<template>
    <div>
        <Card class="inscricao">
            <template #header>
                <img src="../assets/logo1.svg" width="100%" />
            </template>
            <template #content>
                <div class="col-12 card_home">
                    <div class="botao_home" v-for="link in links" :key="link.name">
                        <!-- Apenas renderiza o botão se link.show for true -->
                        <Button v-if="link.show" class="col-8 p-button-primary" @click="irPara(link.path)">
                            <span class="p-button-icon p-button-icon-left">💰</span>
                            <span class="p-button-label">{{ link.name }}</span>
                        </Button>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import Card from "primevue/card";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useNavigation } from "../composables/useNavigation";

// Pega a navegação centralizada
const { links } = useNavigation();

// Importa o router para navegação programática
const router = useRouter();

const irPara = (path) => {
    router.push(path); // Redireciona para o caminho fornecido
};
</script>

<style>
.card_home {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    /* Espaço entre os botões */
}

.botao_home {
    display: flex;
    /* Garante que os botões fiquem centralizados */
    justify-content: center;
    width: 100%;
}

.p-button-primary {
    font-size: 1rem;
}
</style>
