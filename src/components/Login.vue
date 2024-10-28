<template>
    <div>
        <h2>Iniciar sesión</h2>
        <form @submit.prevent="loginWithEmail">
            <input v-model="email" type="email" placeholder="Correo" required />
            <input v-model="password" type="password" placeholder="Contraseña" required />
            <button type="submit">Iniciar sesión</button>
        </form>
        <button @click="loginWithGoogle">Login with Google</button>
        <p v-if="user">Logged in as: {{ user.displayName }}</p>
        <p>
            ¿No tienes cuenta? <router-link to="/register">Registrarme</router-link>
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useCurrentUser } from 'vuefire';
import { useRouter } from 'vue-router';
//import { auth } from '../firebase'; // Importar el auth configurado

export default defineComponent({
    setup() {
        const email = ref('');
        const password = ref('');
        const user = useCurrentUser();
        const router = useRouter();
        const provider = new GoogleAuthProvider();
        const authInstance = getAuth();

        const loginWithEmail = async () => {
            try {
                await signInWithEmailAndPassword(authInstance, email.value, password.value);
                router.push('/profile');
            } catch (error) {
                console.error("Error al iniciar sesión", error);
            }
        };

        const loginWithGoogle = async () => {
            try {
                await signInWithPopup(authInstance, provider);
                router.push('/profile');
            } catch (error) {
                console.error("Error al iniciar sesión con Google", error);
            }
        };

        return { email, password, loginWithEmail, loginWithGoogle, user };
    }
});
</script>

<style scoped></style>