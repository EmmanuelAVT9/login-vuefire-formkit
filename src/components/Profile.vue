<template>
    <div v-if="user" class="form-container">
        <div class="profile-photo"> <img :src="imagePreview || photoURL" alt="Profile Photo" class="profile-image" />
            <button @click="toggleFileInput" class="edit-button"> <font-awesome-icon :icon="['fa', 'pencil']" />
            </button> <input type="file" ref="fileInput" @change="selectImage" hidden />
        </div>
        <FormKit type="text" v-model="displayName" placeholder="Name" />
        <FormKit type="text" v-model="apellidoPaterno" placeholder="Apellido Paterno" />
        <FormKit type="text" v-model="apellidoMaterno" placeholder="Apellido Materno" />
        <FormKit type="text" v-model="curp" placeholder="CURP" />
        <FormKit type="text" v-model="rfc" placeholder="RFC" />
        <FormKit type="tel" v-model="telefono" placeholder="Teléfono" />
        <FormKit type="email" v-model="email" placeholder="Email" />
        <div class="button-container">
            <button @click="saveProfile" class="save-button">Save Profile</button>
            <button @click="logout" class="logout-button">Logout</button>
        </div>
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

export default defineComponent({
    setup() {
        library.add(faPencil);

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
                photoURL.value = downloadURL;
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
                    photoURL.value = user.value.photoURL || photoURL.value;
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
.form-container {
    background-color: #E0FBFC;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: auto;
    text-align: center;
}

.profile-photo {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0 auto 20px;
}

.profile-image {
    width: 100%;
    height: 100%;
    border-radius: 60%;
    object-fit: cover;
    border: 2px solid #3D5A80;
}

.edit-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #E0FBFC;
    border: 2px solid #3D5A80;
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
    font-size: 16px;
    color: #293241;
    transition: background-color 0.3s, color 0.3s;
}

.edit-button:hover {
    background-color: #98C1D9;
    color: #EE6C4D;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.save-button {
  margin-right: 10px;
  padding: 10px 20px;
  background-color: #3D5A80;
  border: none;
  color: #E0FBFC;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.save-button:hover {
  background-color: #293241;
  color: #E0FBFC;
}

.logout-button {
  padding: 10px 20px;
  background-color: #EE6C4D;
  border: none;
  color: #E0FBFC;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.logout-button:hover {
  background-color: #D1495B;
  color: #E0FBFC;
}

button:focus {
    outline: none;
}

FormKit {
    margin-bottom: 10px;
    width: 100%;
}

input[type="text"],
input[type="tel"],
input[type="email"] {
    padding: 8px;
    border: 2px solid #3D5A80;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="tel"]:focus,
input[type="email"]:focus {
    border-color: #98C1D9;
    outline: none;
}
</style>
