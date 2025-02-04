<template>
    <Drawer v-model:visible="visible">
        <div class="card">
            <router-link to="/" @click.native="closeDrawer">
                <Button class="p-button-text button-sidebar">
                    <span><img src="./assets/logo1.svg" height="50" /></span>
                </Button>
            </router-link>
            <div v-for="link in links" v-if="link.show" :key="link.name">
                <router-link :to="link.path" @click.native="closeDrawer">
                    <Button class="p-button-text button-sidebar">
                        <span class="p-button-label">{{ link.name }}</span>
                    </Button>
                </router-link>
            </div>
            <!-- Botão "Sair" visível apenas se o usuário estiver logado -->
            <Button v-if="isLogged" label="Sair" class="p-button-text button-sidebar" icon="pi pi-sign-out"
                @click="logout" />
        </div>
    </Drawer>
</template>

<script setup>
import { ref, computed } from "vue";
import { useNavigation } from "../composables/useNavigation";
import { useUserStore } from "../stores/user";
import { firebaseService } from "../services/firebaseService";

const visible = ref(false);
const { links } = useNavigation();
const userStore = useUserStore();

const isLogged = computed(() => userStore.isLogged);

const closeDrawer = () => {
    visible.value = false;
};

const logout = () => {
    firebaseService.signOutUser().then(() => {
        userStore.resetUser();
    });
};
</script>

<style>
.card {
    padding: 1rem;
}

.button-sidebar {
    width: 100%;
}

img {
    display: block;
    margin: 0 auto;
}
</style>