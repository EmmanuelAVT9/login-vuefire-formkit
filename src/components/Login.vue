<template>
    <div class="login-container">
        <h2>Iniciar sesión</h2>
        <FormKit type="form" :actions="false" incomplete-message="Todos los campos son requeridos, completa los campos." @submit.prevent="loginWithEmail" class="login-form">
            <FormKit type="email" label="Correo" placeholder="Correo" v-model="email" validation="required|email" />
            <FormKit type="password" label="Contraseña" placeholder="Contraseña" v-model="password"
                validation="required" :suffix-icon="passwordSuffixIcon" @suffix-icon-click="handleToggleIconPass" />
            <button type="submit" class="btn-primary">Iniciar sesión</button>
            <p>O</p>
            <button @click="loginWithGoogle" class="btn-secondary">
                Iniciar sesión con Google
                <span>
                    <font-awesome-icon :icon="['fab', 'google']" />
                </span>
            </button>
            <p>
                ¿No tienes cuenta? <router-link to="/register">Registrate</router-link>
            </p>
        </FormKit>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useCurrentUser } from 'vuefire';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import useInputPassword from '../composables/useInputPassword';

export default defineComponent({
    setup() {
        library.add(faGoogle);
        const email = ref('');
        const password = ref('');
        const user = useCurrentUser();
        const router = useRouter();
        const provider = new GoogleAuthProvider();
        const authInstance = getAuth();

        const { handleToggleIconPass } = useInputPassword();
        const passwordSuffixIcon = ref('eyeClosed');

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

        return {
            email,
            password,
            loginWithEmail,
            loginWithGoogle,
            user,
            passwordSuffixIcon,
            handleToggleIconPass,
        };
    },
});
</script>

<style scoped>
:root {
  --fk-color-border-focus: var(--pastel-indigo);
  --fk-font-family: 'Poppins', sans-serif;
  --fk-max-width-input: 100%;
  --fk-bg-submit: var(--pastel-indigo);
}

.formkit-mdd-label {
  color: var(--gentle-purple);
}

.formkit-mdd-inner {
  background: var(--light-lavender);
}

button.formkit-input {
  --fk-bg-button: var(--gentle-purple);
  --fk-color-button: var(--white);
  --fk-bg-button-hover: var(--soft-blue);
  border: 2px solid var(--pale-pink) !important;
}

[data-type="button"] .formkit-input,
[data-type="submit"] .formkit-input {
  width: 100%;
  text-align: center;
}

[data-type="checkbox"] .formkit-input~.formkit-decorator {
  margin: 0;
}

[data-type="checkbox"] .formkit-mdd-label {
  color: black;
  margin-left: 5px;
}

[data-type="checkbox"] fieldset.formkit-fieldset {
  border: 1px solid var(--gentle-purple);
}
.login-container {
    max-width: 600px;
    width: 100%;
    padding: 2rem;
    background-color: #E0FBFC;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;

    h2 {
        color: #3D5A80;
        margin-bottom: 1rem;
    }
    .login-form {
        width: 350px;
        height: 900px;
    }

    input[type="email"],
    input[type="password"] {
        width: 100%;
        padding: 0.75rem;
        margin: 0.5rem 0;
        border: 1px solid #98C1D9;
        border-radius: 4px;
        background-color: #E0FBFC;
        color: #293241;
        font-size: 1rem;

        &:focus {
            outline: none;
            border-color: #3D5A80;
            box-shadow: 0 0 0 2px rgba(61, 90, 128, 0.3);
        }
    }

    button {
        width: 100%;
        padding: 0.75rem;
        margin: 0.5rem 0;
        font-size: 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;

        &.btn-primary {
            background-color: #3D5A80;
            color: #E0FBFC;

            &:hover {
                background-color: #293241;
                transform: translateY(-2px);
            }
        }

        &.btn-secondary {
            background-color: #EE6C4D;
            color: #E0FBFC;

            &:hover {
                background-color: #D95D4C;
                transform: translateY(-2px);
            }
        }
    }

    p {
        color: #293241;
        margin-top: 1rem;
    }

    a {
        color: #3D5A80;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    @media (max-width: 768px) {
        width: 90%;
    }

    @media (min-width: 1024px) {
        max-width: 500px;
    }

    @media (min-width: 1280px) {
        max-width: 600px;
    }
}
</style>
