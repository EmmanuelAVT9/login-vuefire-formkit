<template>
    <div v-if="user">
      <img :src="user.photoURL" alt="Profile Photo" />
      <input v-model="displayName" placeholder="Name" />
      <input v-model="email" placeholder="Email" />
      <button @click="saveProfile">Save Profile</button>
      <button @click="logout">Logout</button> <!-- Botón para cerrar sesión -->
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useCurrentUser } from 'vuefire';
  import { updateProfile, signOut } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import { db } from '../firebase';
  import { useRouter } from 'vue-router'; // Importar router para redirigir
  
  export default defineComponent({
    setup() {
      const user = useCurrentUser();
      const displayName = ref(user.value?.displayName || '');
      const email = ref(user.value?.email || '');
      const router = useRouter(); // Instancia del router
  
      const saveProfile = async () => {
        if (user.value) {
          await updateProfile(user.value, { displayName: displayName.value });
          await setDoc(doc(db, 'users', user.value.uid), {
            displayName: displayName.value,
            email: email.value,
          });
        }
      };
  
      const logout = async () => {
        const auth = user.value?.auth;
        if (auth) {
          await signOut(auth);
          router.push('/'); // Redirigir al login o página principal
        }
      };
  
      return { user, displayName, email, saveProfile, logout };
    },
  });
  </script>
  