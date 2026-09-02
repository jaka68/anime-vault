<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "app",
  middleware: "auth",
});

const { all, remove } = useWatchlist();
const items = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  items.value = await all();
  loading.value = false;
});

async function ukloni(animeId: number) {
  await remove(animeId);
  items.value = items.value.filter((a) => a.animeId !== animeId);
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-gray-700">Lista gledanja</h2>

    <!-- Učitavanje -->
    <div v-if="loading" class="text-center text-gray-500">
      <p>Učitavanje...</p>
    </div>

    <!-- Prazna lista -->
    <div v-else-if="items.length === 0" class="bg-white rounded-lg shadow p-6 text-gray-600">
      <p>Lista gledanja je prazna.</p>
      <NuxtLink to="/dashboard" class="text-blue-600 hover:underline text-sm">
        Pregledaj animee →
      </NuxtLink>
    </div>

    <!-- Popis -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div
        v-for="anime in items"
        :key="anime.animeId"
        class="bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <NuxtLink :to="`/anime-info/${anime.animeId}`" class="block">
          <img
            :src="anime.image"
            :alt="anime.title"
            class="w-full h-64 object-cover">
          <div class="p-3">
            <h3 class="font-bold text-sm truncate" :title="anime.title">
              {{ anime.title }}
            </h3>
            <span v-if="anime.mean" class="text-sm text-gray-600">⭐ {{ anime.mean }}</span>
          </div>
        </NuxtLink>
        <button
          @click="ukloni(anime.animeId)"
          class="m-3 mt-0 bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1.5 px-3 rounded">
          Ukloni
        </button>
      </div>
    </div>
  </div>
</template>
