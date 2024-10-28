<template>
    <div>
        <button @click="loginWithGoogle">Login with Google</button>
        <p v-if="user">Logged in as: {{ user.displayName }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useCurrentUser } from 'vuefire';
import { useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const user = useCurrentUser();
        const router = useRouter();
        const provider = new GoogleAuthProvider();
        const authInstance = getAuth();

        const loginWithGoogle = async () => {
            try {
                await signInWithPopup(authInstance, provider);
                router.push('/profile');
            } catch (error) {
                console.error("Error al iniciar sesión con Google", error);
            }
        };

        return { loginWithGoogle, user };
    }
});
</script>