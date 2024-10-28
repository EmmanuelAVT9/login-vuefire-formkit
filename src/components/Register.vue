<template>
    <div>
      <h2>Registro</h2>
      <form @submit.prevent="registerUser">
        <input v-model="name" placeholder="Nombre" required />
        <input v-model="apellidoPaterno" placeholder="Apellido Paterno" required />
        <input v-model="apellidoMaterno" placeholder="Apellido Materno" required />
        <input v-model="email" type="email" placeholder="Correo" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <input v-model="confirmPassword" type="password" placeholder="Confirmar Contraseña" required />
        <input v-model="curp" placeholder="CURP" required />
        <input v-model="rfc" placeholder="RFC" required />
        <input v-model="telefono" placeholder="Teléfono" required />
        <button type="submit">Registrar</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import { db } from '../firebase'; // Asegúrate de importar Firestore
  
  export default defineComponent({
    setup() {
      const name = ref('');
      const apellidoPaterno = ref('');
      const apellidoMaterno = ref('');
      const email = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const curp = ref('');
      const rfc = ref('');
      const telefono = ref('');
  
      const auth = getAuth();
  
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
  
      return { name, apellidoPaterno, apellidoMaterno, email, password, confirmPassword, curp, rfc, telefono, registerUser };
    }
  });
  </script>
  
  <style scoped></style>
  