<script setup>
import { ref } from 'vue';

const drawer = ref(true);
</script>

<template>
  <q-layout view="hHh lpR fFf" class="app-layout">
    <q-header elevated class="app-header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawer = !drawer"
          class="q-mr-sm"
        />
        <q-toolbar-title class="text-white text-h6">
          <span class="app-logo">Notesphere</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    
    <q-drawer
      show-if-above
      v-model="drawer"
      side="left"
      bordered
      class="app-drawer bg-dark"
    >
      <div class="q-pa-md column">
        <q-list separator dark>
          <q-item-label header class="text-grey-5">Menu</q-item-label>
          
          <q-item clickable v-ripple to="/" exact active-class="drawer-link-active">
            <q-item-section avatar>
              <q-icon name="home" color="primary" />
            </q-item-section>
            <q-item-section class="text-white">Home</q-item-section>
          </q-item>
          
          <q-item clickable v-ripple to="/about" active-class="drawer-link-active">
            <q-item-section avatar>
              <q-icon name="info" color="primary" />
            </q-item-section>
            <q-item-section class="text-white">Impressum</q-item-section>
          </q-item>
        </q-list>
        <q-space />
      </div>
    </q-drawer>
    
    <q-page-container>
      <q-page class="q-pa-md app-background">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.app-layout {
  background-color: #121212;
}

.app-header {
  background-color: #1a1a1a !important;
  border-bottom: 1px solid #333;
  
  .q-toolbar {
    height: 64px;
  }
  
  .app-logo {
    font-weight: 600;
    letter-spacing: 0.5px;
  }
}

.app-drawer {
  background-color: #1e1e1e !important;
  border-color: #333 !important;
  
  .q-drawer__content {
    background-color: #1e1e1e;
  }
  
  .q-item {
    border-radius: 8px;
    margin-bottom: 4px;
    color: #e0e0e0;
    transition: background-color 0.3s ease, transform 0.2s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.07);
    }
    
    &:active {
      transform: translateY(1px);
    }
  }
  
  .drawer-link-active {
    background-color: rgba(66, 165, 245, 0.15) !important;
    
    .q-item__section--main {
      font-weight: 500;
      color: white;
    }
  }
  
  .q-list--separator > .q-item-type + .q-item-type, 
  .q-list--separator > .q-virtual-scroll__content > .q-item-type + .q-item-type {
    border-top-color: #333;
  }
  
  .q-item__label--header {
    padding: 16px 8px 8px 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
}

.app-background {
  background-color: #121212;
  min-height: 100vh;
}

.app-version {
  opacity: 0.7;
  text-align: center;
}

.q-dialog-plugin {
  width: 250px;
  max-width: 100%;
  background-color: #1e1e1e;
}
</style>