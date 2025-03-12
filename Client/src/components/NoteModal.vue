<template>
  <q-dialog
    v-model="showModal"
    @hide="closeModal"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    :maximized="false"
    :style="{ width: '400px', height: '700px', maxWidth: '90%', maxHeight: '90%' }"
  >
    <q-card class="column note-modal-card bg-dark">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-white">{{ editedNote.title || 'Untitled' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup color="grey-5" />
      </q-card-section>

      <q-card-section class="q-pa-sm flex-grow-1 overflow-auto">
        <q-input
          v-model="editedNote.title"
          label="Title"
          dense
          autofocus
          class="q-mb-md dark-input"
          dark
          outlined
          color="primary"
        />

        <q-input
          v-model="editedNote.content"
          type="textarea"
          label="Content"
          autogrow
          dark
          outlined
          color="primary"
          class="dark-input"
        />

        <div v-if="editedNote.image" class="q-mt-md rounded-borders overflow-hidden">
          <q-img
            :src="editedNote.image"
            spinner-color="primary"
            style="max-height: 1000px"
          >
            <div class="absolute-top-right q-mt-xs q-mr-xs">
              <q-btn
                round
                color="negative"
                icon="delete"
                size="sm"
                @click="editedNote.image = null"
              />
            </div>
          </q-img>
        </div>

        <div v-if="editedNote.voiceMemo" class="q-mt-md audio-player">
          <audio :src="editedNote.voiceMemo" controls class="full-width" />
        </div>
      

        <div class="q-mt-md q-mb-md q-ml-auto" position="bottom-left">
          <q-fab
            icon="add"
            direction="right"
            color="primary"
            padding="sm"
          >
            <q-fab-action
              color="primary"
              icon="image"
              @click="triggerFileInput"
            /> 
            <q-fab-action
              color="primary"
              icon="photo_camera"
              @click="showCamera = true"
            />
            <q-fab-action
              :icon="recording ? 'stop' : 'mic'"
              @click="toggleRecording"
              :color="recording ? 'negative' : 'primary'"
            />
          </q-fab>
        </div>
        <q-card-actions position="bottom-right" class="q-mt-auto">
          <q-btn flat color="negative" label="Delete" v-close-popup @click="store.deleteNote(editedNote.id)" />
          <q-btn flat color="primary" label="Save" @click="saveNote" />
        </q-card-actions>
      </q-card-section>
    </q-card>

    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileUpload"
      accept="image/*,audio/*"
    >

    <q-dialog v-model="showCamera">
      <camera-preview
        @capture="handleCameraCapture"
        @close="showCamera = false"
      />
    </q-dialog>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import CameraPreview from '../components/CameraPreview.vue'
import { useStore } from '../stores/usestore.js'

const props = defineProps({
  note: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'delete', 'close'])

const $q = useQuasar()
const showModal = ref(true)
const editedNote = reactive({ ...props.note })
const fileInput = ref(null)
const showCamera = ref(false)
const recording = ref(false)
const mediaRecorder = ref(null)
const audioChunks = ref([])
const store = useStore()

watch(() => props.note, (newNote) => {
  Object.assign(editedNote, newNote)
})

const closeModal = () => {
  if (isNoteEmpty(editedNote)) {
    emit('delete', editedNote.id)
  } else {
    emit('update', editedNote)
  }
  emit('close')
}

const isNoteEmpty = (note) => {
  return (
    note.title.trim() === '' &&
    note.content.trim() === '' &&
    !note.image &&
    !note.voiceMemo &&
    (note.tags !== 'todo' || (note.items && note.items.every(item => item.text.trim() === '')))
  )
}

const saveNote = async () => {
  try {
    // Upload any pending file data before saving
    if (editedNote.pendingImageFile) {
      const imageUrl = await store.uploadFile(editedNote.pendingImageFile, 'image')
      if (imageUrl) {
        editedNote.image = imageUrl
      }
      delete editedNote.pendingImageFile
    }
    
    if (editedNote.pendingAudioBlob) {
      // Convert blob to File object
      const audioFile = new File(
        [editedNote.pendingAudioBlob], 
        `voice-memo-${Date.now()}.webm`, 
        { type: 'audio/webm' }
      )
      const audioUrl = await store.uploadFile(audioFile, 'audio')
      if (audioUrl) {
        editedNote.voiceMemo = audioUrl
      }
      delete editedNote.pendingAudioBlob
    }
    
    if (editedNote.id) {
      await store.updateNote(editedNote.id, editedNote)
    } else {
      await store.addNote(editedNote)
    }
    showModal.value = false
  } catch (error) {
    console.error('Error saving note:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to save note. Please try again.'
    })
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type.startsWith('image/')) {
      // Store the file object for later upload
      editedNote.pendingImageFile = file
      
      // Create a preview
      const reader = new FileReader()
      reader.onload = (e) => {
        editedNote.image = e.target.result // This is just for preview
      }
      reader.readAsDataURL(file)
    } else if (file.type.startsWith('audio/')) {
      // Store the file for later upload
      const reader = new FileReader()
      reader.onload = (e) => {
        const audioBlob = new Blob([e.target.result], { type: file.type })
        editedNote.pendingAudioBlob = audioBlob
        editedNote.voiceMemo = URL.createObjectURL(audioBlob) // Just for preview
      }
      reader.readAsArrayBuffer(file)
    } else {
      console.log('Uploaded file type not supported for display:', file.type)
    }
  }
}

const handleCameraCapture = async (imageData) => {
  // Convert base64 to blob
  const response = await fetch(imageData)
  const blob = await response.blob()
  
  // Create a File object from the blob
  const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
  
  // Store for upload on save
  editedNote.pendingImageFile = file
  editedNote.image = imageData // For preview
  
  showCamera.value = false
}

const toggleRecording = async () => {
  if (recording.value) {
    stopRecording()
  } else {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.value = new MediaRecorder(stream)
      audioChunks.value = []
      
      mediaRecorder.value.ondataavailable = (event) => {
        audioChunks.value.push(event.data)
      }
      
      mediaRecorder.value.onstop = () => {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' })
        editedNote.pendingAudioBlob = audioBlob
        editedNote.voiceMemo = URL.createObjectURL(audioBlob) // For preview
      }
      
      mediaRecorder.value.start()
      recording.value = true
    } catch (error) {
      console.error('Error accessing microphone:', error)
      $q.notify({
        color: 'negative',
        message: 'Error accessing microphone.'
      })
    }
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop()
    recording.value = false
    
    // Close audio tracks to release the microphone
    if (mediaRecorder.value && mediaRecorder.value.stream) {
      mediaRecorder.value.stream.getTracks().forEach(track => track.stop())
    }
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', stopRecording)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', stopRecording)
  stopRecording()
})
</script>

<style lang="scss" scoped>
.q-dialog__inner > div {
  overflow: hidden;
  max-width: 400px;
  width: 100%;
}


.note-modal-card {
  background-color: #1e1e1e !important;
  border: 1px solid #333;
  border-radius: 8px;
  
  .q-card-section {
    color: #e0e0e0;
  }
}

.dark-input {
  .q-field__control {
    background-color: #2a2a2a !important;
  }
  
  .q-field__native, 
  .q-field__label {
    color: #e0e0e0 !important;
  }
  
  &.q-field--focused {
    .q-field__control {
      box-shadow: 0 0 0 2px rgba(66, 165, 245, 0.4);
    }
  }
}

.audio-player {
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 8px;
  
  audio {
    filter: invert(0.8);
  }
}

:deep(.q-fab) {
  .q-fab__icon-holder {
    transition: all 0.3s ease;
  }
  
  &:hover {
    .q-fab__icon-holder {
      transform: scale(1.05);
    }
  }
}

</style>