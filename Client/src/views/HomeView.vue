<template>
  <q-page-container class="q-pa-xl">
    <q-table :rows="dataa" :columns="columns" row-key="id" flat bordered>
      <template v-slot:body-cell-image="props">
        <q-img
          :src="`http://localhost:3000/public/${props.row.image}`"
          style="max-width: 100px; max-height: 60px"
        />
      </template>
      <template v-slot:body-cell-created_at="props">
        {{ new Date(props.row.created_at).toLocaleDateString() }}
      </template>
    </q-table>
  </q-page-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const dataa = ref([]);

const getData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/');
    dataa.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

onMounted(() => {
  getData();
});

const columns = [
  { name: 'image', label: 'Image', field: 'image', align: 'center' },
  { name: 'title', label: 'Title', field: 'title', align: 'left' },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'created_at', label: 'Created At', field: 'created_at', align: 'center' },
  { name: 'tags', label: 'Tags', field: 'tags', align: 'left' },
];
</script>

<style>
body {
  font-family: 'Poppins', sans-serif;
  font-weight: 200;
}
</style>
