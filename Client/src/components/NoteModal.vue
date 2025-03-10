<template>
  <q-dialog
    v-model="showModal"
    @hide="closeModal"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    :maximized="false"
    :style="{ width: '400px',height: '700px', maxWidth: '90%', maxHeight: '90%' }"
  >
    <q-card class="column" style="max-width: 400px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ editedNote.title || 'Untitled' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-sm flex-grow-1 overflow-auto">
        <q-input
          v-model="editedNote.title"
          label="Title"
          dense
          autofocus
          class="q-mb-md"
        />

          <q-input
            v-model="editedNote.content"
            type="textarea"
            label="Content"
            autogrow
          />

        <div v-if="editedNote.image" class="q-mt-md">
          <q-img
            :src="editedNote.image"
            spinner-color="primary"
            style="max-height: 1000px"
          >
            <div class="absolute-top-right">
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

        <div v-if="editedNote.voiceMemo" class="q-mt-md">
          <audio :src="editedNote.voiceMemo" controls class="full-width" />
        </div>
      

        <div class="q-mt-md q-mb-md q-ml-auto" position="bottom-left">
            <q-fab
              icon="add"
              direction="right"
              color="primary"
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
                color="primary"
                :icon="recording ? 'stop' : 'mic'"
                @click="toggleRecording"
              />
            </q-fab>
          </div>
        <q-card-actions position="bottom-right">
         
     
          <q-btn flat color="negative" label="Delete" v-close-popup @click="store.deleteNote(editedNote.id)"  />
          <q-btn flat color="primary" label="Save" @click="saveNote" />
          
        </q-card-actions>
      </q-card-section>
    </q-card>

    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileUpload"
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
    (note.type !== 'todo' || (note.items && note.items.every(item => item.text.trim() === '')))
  )
}

const saveNote = async () => {
  if (editedNote.id) {
    await store.updateNote(editedNote.id, editedNote)
  } else {
    await store.addNote(editedNote)
  }
  showModal.value = false
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const fileData = e.target.result
      if (file.type.startsWith('image/')) {
        editedNote.image = fileData 
      } else if (file.type.startsWith('audio/')) {
        const audioBlob = new Blob([fileData], { type: file.type })
        editedNote.voiceMemo = URL.createObjectURL(audioBlob)
      } else {
        console.log('Uploaded file type not supported for display:', file.type)
      }
    }
    reader.readAsDataURL(file)
  }
}

const handleCameraCapture = (imageData) => {
  editedNote.image = imageData
  showCamera.value = false
}

const toggleRecording = async () => {
  if (recording.value) {
    stopRecording()
  } else {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.value = new MediaRecorder(stream)
      mediaRecorder.value.ondataavailable = (event) => {
        audioChunks.value.push(event.data)
      }
      mediaRecorder.value.onstop = () => {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' })
        editedNote.voiceMemo = URL.createObjectURL(audioBlob)
        audioChunks.value = []
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
</style>

