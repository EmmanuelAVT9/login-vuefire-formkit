import { ref } from 'vue';

export function useImageUpload() {
  const imageFile = ref<File | null>(null);
  const imagePreview = ref<string | null>(null);

  const selectImage = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      imageFile.value = file;
      imagePreview.value = URL.createObjectURL(file);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Aquí puedes capturar la foto y guardarla en `imageFile`
    } catch (error) {
      console.error("No se pudo acceder a la cámara", error);
    }
  };

  return { imageFile, imagePreview, selectImage, openCamera };
}
