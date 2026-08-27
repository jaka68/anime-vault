<script setup lang="ts">
// Koristimo useFetch da pozovemo našu server-side rutu
// Nuxt automatski zna da '/api/anime' cilja na server/api/anime.ts
const { data: animeData, pending, error } = useFetch('/api/anime');

function handleLogout() {
  // Ovdje ćemo kasnije dodati logiku za odjavu
  alert('Logika za odjavu ide ovdje!');
}
</script>

<template>
  <div class="bg-gray-100 min-h-screen font-sans">
    <header class="bg-white shadow-md">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Anime Vault</h1>
        <button @click="handleLogout" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Odjava
        </button>
      </nav>
    </header>

    <main class="container mx-auto px-6 py-8">
      <h2 class="text-3xl font-bold mb-6 text-gray-700">Random Anime koji bi vam se mogli svidjeti</h2>

      <!-- Prikaz poruke dok se podaci učitavaju -->
      <div v-if="pending" class="text-center text-gray-500">
        <p>Učitavanje podataka...</p>
      </div>

      <!-- Prikaz greške ako se dogodi -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong class="font-bold">Greška!</strong>
        <span class="block sm:inline">{{ error.message }}</span>
      </div>

      <!-- Prikaz liste animea -->
      <div v-else-if="animeData && animeData.data" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div
            v-for="item in animeData.data"
            :key="item.node.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300"
        >
          <img :src="item.node.main_picture.large" alt="Anime poster" class="w-full h-72 object-cover">
          <div class="p-4">
            <h3 class="font-bold text-md truncate">{{ item.node.title }}</h3>
            <p class="text-gray-600 text-sm mt-1">Rank: #{{ item.ranking.rank }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
