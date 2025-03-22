<!-- apps/nuxt-app/pages/users.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useApi } from '~/composables/useApi';

const { getApiService } = useApi();
const users = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const apiService = await getApiService();
    users.value = await apiService.getUsers();
  } catch (error) {
    console.error('Failed to load users:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Users</h1>
    <NuxtLink to="/" class="text-blue-500 underline block mb-4">Back to Home</NuxtLink>
    
    <div v-if="loading">Loading...</div>
    
    <div v-else class="grid gap-4">
      <div v-for="user in users" :key="user.id" class="border p-4 rounded">
        <h2 class="text-xl font-bold">{{ user.name }}</h2>
        <p>{{ user.email }}</p>
        <p>Role: {{ user.role }}</p>
      </div>
    </div>
  </div>
</template>