<!-- apps/nuxt-app/pages/index.vue -->
<script setup>
const backendType = process.env.NUXT_PUBLIC_BACKEND_TYPE || 'express';
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Nuxt.js Demo</h1>
    <p class="mb-4">Backend: {{ backendType }}</p>
    <NuxtLink to="/users" class="text-blue-500 underline">
      View Users
    </NuxtLink>
  </div>
</template>