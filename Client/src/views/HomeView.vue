<template>
  <q-page paddingn class="notes-page">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-input
          v-model="searchTerm"
          filled
          type="search"
          label="Search notes"
          dark
          class="search-input"
          bg-color="dark-card"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>
      <div class="col-12">
        <q-btn-toggle
          v-model="viewType"
          spread
          no-caps
          toggle-color="primary"
          color="dark-card"
          text-color="grey-4"
          :options="[
            {label: 'Grid', value: 'grid', icon: 'grid_view'},
            {label: 'List', value: 'list', icon: 'view_list'}
          ]"
          class="view-toggle"
        />
      </div>
      <div class="col-12">
        <q-card class="quick-create-area cursor-pointer dark-card" @click="createNote('note')">
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from '../stores/usestore';
import NoteCard from '../components/NoteCard.vue';
import NoteModal from '../components/NoteModal.vue';

const store = useStore();
const searchTerm = ref('');
const selectedNote = ref(null);
const viewType = ref('grid'); // Default view type
const creatingNote = ref(false);

const setDefaultViewType = () => {
  if (window.innerWidth <= 768) { // Adjust the width as needed for mobile
    viewType.value = 'list'; // Set to list view on mobile
  } else {
    viewType.value = 'grid'; // Set to grid view on larger screens
  }
};

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
  setDefaultViewType(); // Set the default view type on mount
  window.addEventListener('resize', setDefaultViewType); // Update on resize
});

// Clean up the event listener when the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('resize', setDefaultViewType);
});
</script>

<style lang="scss" scoped>
.notes-page {
  background-color: #121212;
  min-height: 100vh;
}

.dark-card {
  background-color: #1e1e1e !important;
  color: #e0e0e0;
  border: 1px solid #333;
}

.search-input {
  .q-field__native,
  .q-field__label {
    color: #e0e0e0;
  }
  
  &.q-field--focused {
    .q-field__control {
      box-shadow: 0 0 0 2px rgba(var(--q-primary), 0.4);
    }
  }
}

.view-toggle {
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  
  .q-btn {
    &.q-btn--active {
      font-weight: 500;
    }
  }
}

.quick-create-area {
  transition: all 0.3s ease;
  border-radius: 8px;
  border: 1px dashed #444;
  
  &:hover {
    background-color: #2a2a2a !important;
    border-color: var(--q-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.note-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
  }
}

// Add dark mode CSS variables for your primary color
// Replace with your app's primary color
:root {
  --q-primary: 66, 165, 245; // This is a blue color, adjust as needed
}
</style>