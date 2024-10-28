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

export default defineComponent({
    setup() {
        const user = useCurrentUser();

        const loginWithGoogle = async () => {
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            await signInWithPopup(auth, provider);
        };

        return { loginWithGoogle, user };
    }
});
</script>