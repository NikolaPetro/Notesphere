<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-input
          v-model="searchTerm"
          filled
          type="search"
          label="Search notes"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12">
        <q-btn-toggle
          v-model="viewType"
          spread
          no-caps
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="[
            {label: 'Grid', value: 'grid', icon: 'grid_view'},
            {label: 'List', value: 'list', icon: 'view_list'}
          ]"
        />
      </div>
      <div class="col-12">
        <q-card class="quick-create-area cursor-pointer" @click="createNote('note')">
    <q-card-section>
      <div class="row items-center">
        <q-icon name="add" size="sm" color="primary" />
        <div class="text-primary q-ml-sm">Click to create...</div>
      </div>
    </q-card-section>
  </q-card>
      </div>
      <template v-for="note in filteredNotes" :key="note.id">
        <div :class="{'col-12': viewType === 'list', 'col-12 col-md-6 col-lg-4': viewType === 'grid'}">
          <note-card
            :note="note"
            :is-list-view="viewType === 'list'"
            @click="selectedNote = note"
          />
        </div>
      </template>
    </div>

    <note-modal
      v-if="selectedNote"
      :note="selectedNote"
      @close="selectedNote = null"
      @update="store.updateNote($event.id, $event)"
      @delete="store.deleteNote($event)"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from '../stores/usestore';
import NoteCard from '../components/NoteCard.vue';
import NoteModal from '../components/NoteModal.vue';

const store = useStore();
const searchTerm = ref('');
const selectedNote = ref(null);
const viewType = ref('grid');
const creatingNote = ref(false);

const filteredNotes = computed(() => {
  const searchRegex = new RegExp(searchTerm.value, 'i');
  return store.notes.filter(note =>
    searchRegex.test(note.title) || searchRegex.test(note.content)
  );
});

const createNote = async (type) => {
  if (creatingNote.value) return;
  creatingNote.value = true;

  const newNote = {
    id: Date.now(),
    title: '',
    content: '',
    type,
    ...(type === 'todo' ? { items: [] } : {})
  };
  await store.addNote(newNote);
  selectedNote.value = newNote;

  creatingNote.value = false;
};

onMounted(() => {
  store.fetchNotes();
});
</script>

<style lang="scss" scoped>
.quick-create-area {
  transition: all 0.3s ease;

  &:hover {
    background-color: $grey-2;
  }
}
</style>