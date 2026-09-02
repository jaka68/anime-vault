<script setup lang="ts">
// Jedna sekcija dashboarda: naslov + vodoravni red anime kartica.
const props = defineProps<{
  title: string;
  rankingType?: string;
  limit?: number;
  random?: boolean;
}>();

const { data, pending, error } = useFetch<any>("/api/anime", {
  query: {
    rankingType: props.rankingType ?? "all",
    limit: props.limit ?? 12,
    random: props.random ? "true" : "false",
  },
  key: `anime-section-${props.title}`,
});
</script>

<template>
  <section class="mb-8">
    <h2 class="text-xl font-bold mb-3 text-gray-700">{{ title }}</h2>

    <!-- Učitavanje -->
    <div v-if="pending" class="text-gray-500 text-sm">Učitavanje...</div>

    <!-- Greška -->
    <div v-else-if="error" class="text-red-600 text-sm">
      Greška pri učitavanju sekcije.
    </div>

    <!-- Mreža kartica -->
    <div
      v-else-if="data && data.data"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <NuxtLink
        v-for="item in data.data"
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
          <div class="flex justify-between text-sm text-gray-600 mt-1">
            <span>Rank #{{ item.ranking.rank }}</span>
            <span v-if="item.node.mean">⭐ {{ item.node.mean }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Linija razdvajanja ispod sekcije -->
    <hr class="mt-6 border-gray-300">
  </section>
</template>
