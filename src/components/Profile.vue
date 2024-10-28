<template>
  <div v-if="user">
    <img :src="photoURL" alt="Profile Photo" />
    <input v-model="displayName" placeholder="Name" />
    <input v-model="apellidoPaterno" placeholder="Apellido Paterno" />
    <input v-model="apellidoMaterno" placeholder="Apellido Materno" />
    <input v-model="curp" placeholder="CURP" />
    <input v-model="rfc" placeholder="RFC" />
    <input v-model="telefono" placeholder="Teléfono" />
    <input v-model="email" placeholder="Email" />
    <button @click="saveProfile">Save Profile</button>
    <button @click="logout">Logout</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { useCurrentUser } from 'vuefire';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useRouter } from 'vue-router';
import defaultAvatar from '../assets/default-avatar.png';

export default defineComponent({
  setup() {
    const user = useCurrentUser();
    const photoURL = ref(defaultAvatar);
    const displayName = ref('');
    const apellidoPaterno = ref('');
    const apellidoMaterno = ref('');
    const curp = ref('');
    const rfc = ref('');
    const telefono = ref('');
    const email = ref('');
    const router = useRouter();

    // Carga los datos del usuario desde Firestore al iniciar
    onMounted(async () => {
      if (user.value) {
        const userDoc = await getDoc(doc(db, 'users', user.value.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          displayName.value = userData.displayName || '';
          apellidoPaterno.value = userData.apellidoPaterno || '';
          apellidoMaterno.value = userData.apellidoMaterno || '';
          curp.value = userData.curp || '';
          rfc.value = userData.rfc || '';
          telefono.value = userData.telefono || '';
          email.value = userData.email || '';
          photoURL.value = user.value.photoURL || defaultAvatar;
        }
      }
    });

    const saveProfile = async () => {
      if (user.value) {
        // Actualiza el perfil en Firebase Authentication
        await updateProfile(user.value, { displayName: displayName.value });
        
        // Guarda toda la información en Firestore
        await setDoc(doc(db, 'users', user.value.uid), {
          displayName: displayName.value,
          apellidoPaterno: apellidoPaterno.value,
          apellidoMaterno: apellidoMaterno.value,
          curp: curp.value,
          rfc: rfc.value,
          telefono: telefono.value,
          email: email.value,
        });
      }
    };

    const logout = async () => {
      await signOut(auth);
      router.push('/');
    };

    return { user, photoURL, displayName, apellidoPaterno, apellidoMaterno, curp, rfc, telefono, email, saveProfile, logout };
  },
});
</script>
