<template>
  <q-card class="camera-preview">
    <q-card-section>
      <video ref="videoElement" autoplay playsinline class="full-width"></video>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Close" color="primary" v-close-popup />
      <q-btn flat label="Capture" color="primary" @click="captureImage" />
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
}
</style>

