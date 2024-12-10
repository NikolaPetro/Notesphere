<script setup>
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>

        <q-toolbar-title>
          <q-avatar>
            <img src="../public/logo.png" />
          </q-avatar>
          Notesphere
        </q-toolbar-title>

      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Home" />
        <q-route-tab to="/about" label="Impressum" />
      </q-tabs>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/Montserrat/Montserrat-Regular.ttf') format('truetype');
}

* {
  font-family: 'Montserrat';
}
</style>
