import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useStore = defineStore('NoteStore', () => {
  const notes = ref([]);
  const apiUrl = 'http://localhost:3000';
  
  async function fetchNotes() {
    try {
      const { data } = await axios.get(`${apiUrl}/notes`);
      notes.value = data;
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }
  
  async function addNote(note) {
    try {
      const noteToSave = { ...note };
      // Change type to tags to match the backend model
      if (noteToSave.type) {
        noteToSave.tags = noteToSave.type;
        delete noteToSave.type;
      }
      
      const { data: newNote } = await axios.post(`${apiUrl}/notes`, noteToSave);
      notes.value.unshift(newNote);
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      return null;
    }
  }
  
  async function updateNote(id, updatedNote) {
    try {
      const noteToUpdate = { ...updatedNote };
      // Change type to tags to match the backend model
      if (noteToUpdate.type) {
        noteToUpdate.tags = noteToUpdate.type;
        delete noteToUpdate.type;
      }
      
      const { data } = await axios.patch(`${apiUrl}/notes/${id}`, noteToUpdate);
      
      // Update local state without fetching all notes again
      const index = notes.value.findIndex(note => note.id === id);
      if (index !== -1) {
        notes.value[index] = data;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      return false;
    }
  }
  
  async function deleteNote(id) {
    try {
      await axios.delete(`${apiUrl}/notes/${id}`);
      notes.value = notes.value.filter(note => note.id !== id);
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }


  async function uploadImage(imageBlob) {
    const formData = new FormData();
    formData.append('image', imageBlob, `note-image-${Date.now()}.jpg`);
    
    // Add a specific path parameter to tell the server where to save the image
    formData.append('uploadPath', '/public/images');
    
    try {
      const formData = new FormData();
      formData.append('file', file, `note-${type}-${Date.now()}.${file.name.split('.').pop()}`);
      
      const { data } = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return `${apiUrl}/${data.filePath}`;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      return null;
    }
  }


  return { notes, fetchNotes, addNote, updateNote, deleteNote, uploadImage };
});