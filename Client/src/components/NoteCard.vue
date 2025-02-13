<template>
  <q-card @click="onClick" class="cursor-pointer hover-shadow-lg bg-card text-card-foreground" :class="{ 'row items-center': isListView }">
    <div v-if="isListView" class="row items-center q-pa-md">
      <div class="col">
        <h3 class="text-h6">{{ note.title || 'Untitled' }}</h3>

        <p class="text-caption text-muted-foreground ellipsis">{{ note.content }}</p>
      </div>
      <q-img v-if="note.image" :src="note.image" class="col-auto q-ml-md" style="width: 48px; height: 58px; border-radius: 4px; object-fit: cover;" />
    </div>
    <template v-else>
      <q-card-section>
        <div class="text-h6">{{ note.title || 'Untitled' }}</div>
      </q-card-section>
      <q-card-section>
        <div>
          <p class="ellipsis">{{ note.content }}</p>
          <q-img v-if="note.image" :src="note.image || '/placeholder.svg'" alt="Note image" class="q-mt-md" style="width: 100%; height: 128px; border-radius: 4px; object-fit: cover;" />
          <q-audio v-if="note.voiceMemo" :src="note.voiceMemo" controls class="q-mt-md" />
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
</style>
