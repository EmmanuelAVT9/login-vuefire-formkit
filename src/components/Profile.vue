<template>
    <div v-if="user">
        <div class="profile-photo" style="border: 1px solid black;">
            <img :src="imagePreview || photoURL" alt="Profile Photo" class="profile-image" />
            <button @click="toggleFileInput" class="edit-button" style="border: 1px solid black;">
                <i class="fa-solid fa-pencil"></i>
                <font-awesome-icon :icon="['fa', 'pencil']" />
            </button>
            <input type="file" ref="fileInput" @change="selectImage" hidden />
        </div>
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
import { defineComponent, ref, onMounted } from 'vue';
import { useCurrentUser } from 'vuefire';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, storage } from '../firebase';
import { useRouter } from 'vue-router';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import defaultAvatar from '../assets/default-avatar.png';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

export default defineComponent({
    setup() {
        library.add(faPencil)

        const user = useCurrentUser();
        const photoURL = ref<string>(defaultAvatar);
        const displayName = ref<string>('');
        const apellidoPaterno = ref<string>('');
        const apellidoMaterno = ref<string>('');
        const curp = ref<string>('');
        const rfc = ref<string>('');
        const telefono = ref<string>('');
        const email = ref<string>('');
        const router = useRouter();
        const fileInput = ref<HTMLInputElement | null>(null);
        const imagePreview = ref<string | null>(null);

        const toggleFileInput = () => {
            fileInput.value?.click();
        };

        const selectImage = async (event: Event) => {
            const target = event.target as HTMLInputElement;
            const files = target.files;
            if (files && files.length > 0) {
                const file = files[0];
                imagePreview.value = URL.createObjectURL(file);
                await uploadPhoto(file);
            }
        };

        const uploadPhoto = async (file: File) => {
            if (user.value) {
                const fileName = generateFileName(displayName.value, apellidoPaterno.value, apellidoMaterno.value);
                const storageRefPath = storageRef(storage, `profile_pictures/${fileName}-Perfil.jpg`);

                await uploadBytes(storageRefPath, file);
                const downloadURL = await getDownloadURL(storageRefPath);
                photoURL.value = downloadURL; // Actualiza photoURL con la imagen subida
            }
        };

        const generateFileName = (name: string, apellidoPaterno: string, apellidoMaterno: string) => {
            const namePart = name.slice(0, 3).charAt(0).toUpperCase() + name.slice(1, 3).toLowerCase();
            const apellidoPart = apellidoPaterno.slice(0, 3).charAt(0).toUpperCase() + apellidoPaterno.slice(1, 3).toLowerCase();
            const apellidoMart = apellidoMaterno.slice(0, 3).charAt(0).toUpperCase() + apellidoMaterno.slice(1, 3).toLowerCase();
            return `${namePart}${apellidoPart}${apellidoMart}`;
        };

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
                    photoURL.value = user.value.photoURL || photoURL.value; // Usa photoURL predeterminada si no hay personalizada
                }
            }
        });

        const saveProfile = async () => {
            if (user.value) {
                await updateProfile(user.value, { displayName: displayName.value, photoURL: photoURL.value });
                await setDoc(
                    doc(db, 'users', user.value.uid),
                    {
                        displayName: displayName.value,
                        apellidoPaterno: apellidoPaterno.value,
                        apellidoMaterno: apellidoMaterno.value,
                        curp: curp.value,
                        rfc: rfc.value,
                        telefono: telefono.value,
                        email: email.value,
                        photoURL: photoURL.value
                    },
                    { merge: true }
                );
            }
        };

        const logout = async () => {
            await signOut(auth);
            router.push('/');
        };

        return {
            user,
            photoURL,
            imagePreview,
            displayName,
            apellidoPaterno,
            apellidoMaterno,
            curp,
            rfc,
            telefono,
            email,
            toggleFileInput,
            fileInput,
            saveProfile,
            logout,
            selectImage,
        };
    },
});
</script>

<style scoped>
.profile-photo {
    position: relative;
    width: 150px;
    height: 150px;
    margin-bottom: 20px;
}

.profile-image {
    width: 100%;
    height: 100%;
    border-radius: 60%;
    object-fit: cover;
    border: 1px solid red;
}

.edit-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #ffffff;
    border: none;
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
    font-size: 16px;
    color: #333;
}
</style>