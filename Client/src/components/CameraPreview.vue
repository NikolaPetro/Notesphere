<template>
  <q-card class="camera-preview bg-dark">
    <q-card-section class="q-pb-none">
      <div class="text-h6 text-white q-mb-md">Camera</div>
      <div class="camera-container">
        <video ref="videoElement" autoplay playsinline class="full-width"></video>
      </div>
    </q-card-section>
    <q-card-actions align="right" class="q-pa-md">
      <q-btn flat label="Close" color="grey-5" v-close-popup class="q-px-md" />
      <q-btn flat label="Capture" color="primary" @click="captureImage" class="q-px-md" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'CameraPreview',
  emits: ['capture', 'close'],
  setup(props, { emit }) {
    const videoElement = ref(null)
    let stream = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        if (videoElement.value) {
          videoElement.value.srcObject = stream
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        emit('close')
      }
    }

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }

    const captureImage = () => {
      const canvas = document.createElement('canvas')
      canvas.width = videoElement.value.videoWidth
      canvas.height = videoElement.value.videoHeight
      canvas.getContext('2d').drawImage(videoElement.value, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg')
      emit('capture', imageData)
      stopCamera()
    }

    onMounted(() => {
      startCamera()
    })

    onUnmounted(() => {
      stopCamera()
    })

    return {
      videoElement,
      captureImage
    }
  }
}
</script>

<style lang="scss" scoped>
.camera-preview {
  width: 100%;
  max-width: 640px;
  background-color: #1e1e1e !important;
  border: 1px solid #333;
  border-radius: 8px;
}

.camera-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #333;
  background-color: #000;
  margin-bottom: 12px;
}

.q-btn {
  border-radius: 4px;
  font-weight: 500;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.bg-dark {
  color: #e0e0e0;
}
</style>