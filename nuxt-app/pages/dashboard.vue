<script setup lang="ts">
// treba biti prijavljen + layout s menijem
definePageMeta({
  layout: "app",
  middleware: "auth",
});
</script>

<template>
  <div>
    <AnimeSection title="Najbolje rangirani" ranking-type="all" :limit="15" />
    <AnimeSection title="Trenutno se emitira" ranking-type="airing" :limit="15" />
    <AnimeSection title="Najpopularnije" ranking-type="bypopularity" :limit="15" />
    <AnimeSection
      title="Otkrij – možda ti se svidi"
      ranking-type="all"
      :limit="15"
      :random="true" />
  </div>
</template>
