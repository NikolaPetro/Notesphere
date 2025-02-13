<script setup>
import { ref } from 'vue';

const drawer = ref(true);
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-secondary">
      <q-toolbar>
        <q-toolbar-title class="text-secondary text-h6">Notesphere</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="drawer" side="left" bordered>
      <div class="q-pa-md column">
        <q-list>
          <q-item clickable v-ripple to="/">

            <q-item-section>Home</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/about">

            <q-item-section>Impressum</q-item-section>
          </q-item>
        </q-list>

      </div>
    </q-drawer>
    
    <q-page-container>
      <q-page class="q-pa-md">
        <router-view />
       
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.q-dialog-plugin {
  width: 250px;
  max-width: 100%;
}
</style>
