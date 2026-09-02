<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "app",
  middleware: "auth",
});

const { all, remove, setRating } = useMyList();
const items = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  items.value = await all();
  loading.value = false;
});

// promijeni ocjenu pa opet poslozi listu
async function promijeniOcjenu(anime: any) {
  await setRating(anime.animeId, anime.rating);
  items.value.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

async function ukloni(animeId: number) {
  await remove(animeId);
  items.value = items.value.filter((a) => a.animeId !== animeId);
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-gray-700">Moja anime lista</h2>

    <div v-if="loading" class="text-center text-gray-500">
      <p>Učitavanje...</p>
    </div>

    <!-- ako je prazno -->
    <div v-else-if="items.length === 0" class="bg-white rounded-lg shadow p-6 text-gray-600">
      <p>Još nisi ocijenio nijedan anime.</p>
      <NuxtLink to="/dashboard" class="text-blue-600 hover:underline text-sm">
        Pregledaj animee →
      </NuxtLink>
    </div>

    <!-- lista poslozena po ocjeni -->
    <div v-else class="flex flex-col gap-3">
      <div
        v-for="(anime, index) in items"
        :key="anime.animeId"
        class="bg-white rounded-lg shadow flex items-center gap-4 p-3">
        <!-- broj u rangu -->
        <div class="text-2xl font-bold text-gray-400 w-10 text-center">
          {{ index + 1 }}.
        </div>

        <NuxtLink :to="`/anime-info/${anime.animeId}`" class="flex items-center gap-3 flex-1 min-w-0">
          <img :src="anime.image" :alt="anime.title" class="w-12 h-16 object-cover rounded">
          <div class="min-w-0">
            <h3 class="font-bold text-sm truncate" :title="anime.title">{{ anime.title }}</h3>
            <span v-if="anime.mean" class="text-xs text-gray-500">MAL ⭐ {{ anime.mean }}</span>
          </div>
        </NuxtLink>

        <!-- moja ocjena -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Ocjena:</label>
          <select
            v-model.number="anime.rating"
            @change="promijeniOcjenu(anime)"
            class="border rounded p-1 text-sm">
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <button
          @click="ukloni(anime.animeId)"
          class="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1.5 px-3 rounded">
          Ukloni
        </button>
      </div>
    </div>
  </div>
</template>
