<script setup lang="ts">
import { computed } from "vue";

definePageMeta({
  layout: "app",
  middleware: "auth",
});

const route = useRoute();
const pojam = computed(() => (route.query.q as string) || "");

// Reaktivni useFetch - automatski se ponovno pokrene kad se ?q= promijeni
const { data, pending, error } = useFetch<any>("/api/search", {
  query: { q: pojam },
  key: "search",
});

const results = computed(() => data.value?.data ?? []);
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-gray-700">
      Pretraga animea
      <span v-if="pojam" class="text-gray-400 font-normal text-lg">— "{{ pojam }}"</span>
    </h2>

    <!-- Stanja -->
    <div v-if="!pojam" class="text-gray-600">
      Upiši naziv animea u tražilicu gore.
    </div>
    <div v-else-if="pending" class="text-gray-500">Pretraživanje...</div>
    <div v-else-if="error" class="text-red-600">Greška pri pretraživanju.</div>
    <div v-else-if="results.length === 0" class="text-gray-600">
      Nema rezultata za "{{ pojam }}".
    </div>

    <!-- Rezultati -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <NuxtLink
        v-for="item in results"
        :key="item.node.id"
        :to="`/anime-info/${item.node.id}`"
        class="bg-white rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition block">
        <img
          :src="item.node.main_picture?.large"
          :alt="item.node.title"
          class="w-full h-64 object-cover rounded-t-lg">
        <div class="p-3">
          <h3 class="font-bold text-sm truncate" :title="item.node.title">
            {{ item.node.title }}
          </h3>
          <span v-if="item.node.mean" class="text-sm text-gray-600">
            ⭐ {{ item.node.mean }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
