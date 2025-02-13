import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
export const useStore = defineStore('NoteStore', () => {
  const notes = ref([]);

  async function fetchNotes() {
    const { data } = await axios.get('http://localhost:3000/notes');
    notes.value = data;
  }

  async function addNote(note) {
    const { data: newNote } = await axios.post('http://localhost:3000/notes', note);
    notes.value.push(newNote);
  }

  async function updateNote(id, updatedNote) {
    await axios.patch(`http://localhost:3000/notes/${id}`, updatedNote);
    await fetchNotes();
  }

  async function deleteNote(id) {
    await axios.delete(`http://localhost:3000/notes/${id}`);
    notes.value = notes.value.filter(note => note.id !== id);
    await fetchNotes();
  }

  // New method to upload an image
  async function uploadImage(imageBlob) {
    const formData = new FormData();
    formData.append('image', imageBlob, `note-image-${Date.now()}.jpg`);

    try {
      const { data } = await axios.post('http://localhost:3000/upload', formData);
      return data.filePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  return { notes, fetchNotes, addNote, updateNote, deleteNote, uploadImage };
});
