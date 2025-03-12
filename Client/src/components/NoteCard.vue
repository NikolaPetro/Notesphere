<template>
  <q-card 
    @click="onClick" 
    class="cursor-pointer hover-shadow-lg note-card"
    :class="{ 'row items-center': isListView }"
  >
    <div v-if="isListView" class="row items-center q-pa-md full-width">
      <div class="col">
        <h3 class="text-h6 text-white q-mb-xs">{{ note.title || 'Untitled' }}</h3>
        <p class="text-caption text-grey-5 ellipsis q-mb-none">{{ note.content }}</p>
      </div>
      <q-img 
        v-if="note.image" 
        :src="note.image" 
        class="col-auto q-ml-md" 
        style="width: 48px; height: 58px; border-radius: 4px; object-fit: cover;"
      />
      <q-icon 
        v-if="note.voiceMemo && !note.image" 
        name="audiotrack" 
        color="primary" 
        size="sm" 
        class="col-auto q-ml-md"
      />
    </div>
    <template v-else>
      <q-card-section class="q-pb-xs">
        <div class="text-h6 text-white">{{ note.title || 'Untitled' }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div>
          <p class="ellipsis text-grey-5" style="max-height: 60px; overflow: hidden;">{{ note.content }}</p>
          <q-img 
            v-if="note.image" 
            :src="note.image || '/placeholder.svg'" 
            alt="Note image" 
            class="q-mt-md" 
            style="width: 100%; height: 128px; border-radius: 4px; object-fit: cover;"
          />
          <div v-if="note.voiceMemo" class="q-mt-md audio-preview">
            <q-icon name="audiotrack" color="primary" size="sm" class="q-mr-xs" />
            <span class="text-grey-5 text-caption">Voice memo</span>
          </div>
        </div>
      </q-card-section>
    </template>
  </q-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  note: Object,
  onClick: Function,
  isListView: Boolean
});
</script>

<style scoped>
.text-strike {
  text-decoration: line-through;
}

.note-card {
  background-color: #1e1e1e !important;
  color: #e0e0e0;
  border: 1px solid #333;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-bottom: 12px;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3) !important;
  border-color: rgba(66, 165, 245, 0.4);
}

.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  
}


.audio-preview {
  display: flex;
  align-items: center;
  background-color: #2a2a2a;
  border-radius: 4px;
  padding: 6px 10px;
  display: inline-flex;
}
</style>