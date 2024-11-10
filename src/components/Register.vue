<template>
  <div class="register-page">
    <div class="register-container">
      <button class="btn-back" @click="goBack">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />&nbsp;&nbsp;Regresar
      </button>
      <h2>Registro</h2>
      <FormKit type="form" :actions="false" incomplete-message="Todos los campos son requeridos, completa los campos."
        @submit.prevent="registerUser" class="register-form">
        <FormKit type="text" label="Nombre" placeholder="Nombre" v-model="name" validation="required" />
        <FormKit type="text" v-model="apellidoPaterno" label="Apellido Paterno" placeholder="Apellido Paterno"
          validation="required" />
        <FormKit type="text" v-model="apellidoMaterno" label="Apellido Materno" placeholder="Apellido Materno"
          validation="required" />
        <FormKit type="text" v-model="email" label="Correo" placeholder="Apellido Materno"
          validation="required|email" />
        <FormKit type="text" v-model="password" label="Contraseña" placeholder="Contraseña" validation="required"
          :suffix-icon="passwordSuffixIcon" @suffix-icon-click="handleToggleIconPass" />
        <FormKit type="text" v-model="confirmPassword" label="Confirmar Contraseña" placeholder="Confirmar Contraseña"
          validation="required" :suffix-icon="passwordSuffixIcon" @suffix-icon-click="handleToggleIconPass" />
        <button type="submit" style="background-color: #EE6C4D;
            color: #E0FBFC;">Registrarme</button>
      </FormKit>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Asegúrate de importar Firestore
import { FormKit } from '@formkit/vue';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';

import useInputPassword from '../composables/useInputPassword';

export default defineComponent({
  setup() {
    library.add(faChevronLeft)
    const name = ref('');
    const apellidoPaterno = ref('');
    const apellidoMaterno = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const curp = ref('');
    const rfc = ref('');
    const telefono = ref('');
    const router = useRouter();

    const auth = getAuth();

    const { handleToggleIconPass } = useInputPassword();
    const passwordSuffixIcon = ref('eyeClosed');

    const registerUser = async () => {
      if (password.value !== confirmPassword.value) {
        alert("Las contraseñas no coinciden");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Guardar información adicional en Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: name.value,
          apellidoPaterno: apellidoPaterno.value,
          apellidoMaterno: apellidoMaterno.value,
          curp: curp.value,
          rfc: rfc.value,
          telefono: telefono.value,
          email: email.value
        });

        alert("Registro exitoso");
      } catch (error) {
        console.error("Error al registrar", error);
      }
    };

    const goBack = () => {
      router.back();
    };

    return {
      name,
      apellidoPaterno,
      apellidoMaterno,
      email,
      password,
      confirmPassword,
      curp,
      rfc,
      telefono,
      registerUser,
      goBack,
      passwordSuffixIcon,
      handleToggleIconPass
    };
  }
});
</script>

<style scoped>
/* Estilos para la página de registro */
.register-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}

/* Contenedor del formulario */
.register-container {
  padding: 2rem;
  background-color: #E0FBFC;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
}

/* Formulario */
.register-form {
  width: 100%;
}

/* Estilos de botón y campos de entrada */
.btn-back {
  align-self: flex-start;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: #3D5A80;
  color: #E0FBFC;
  padding: 0.5rem;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  margin: 0.6rem 0;
  border: 1px solid #98C1D9;
  border-radius: 4px;
  background-color: #E0FBFC;
  color: #293241;
  font-size: 1rem;
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #EE6C4D;
  color: #E0FBFC;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

/* Responsividad para pantallas pequeñas */
@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
    max-width: 100%;
  }

  .btn-back {
    font-size: 0.9rem;
  }
}

/* Estilo para pantallas más grandes */
@media (min-width: 1024px) {
  .register-container {
    padding: 3rem;
  }

  .register-form {
    width: 400px;
  }
}
</style>