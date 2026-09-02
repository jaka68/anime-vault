<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "app",
  middleware: "auth",
});

const route = useRoute();

// detalji animea s nase server rute
const { data: anime, pending, error } = useFetch<any>(`/api/anime/${route.params.id}`);

// lista gledanja
const { add, remove, has } = useWatchlist();
const inList = ref(false);
const saving = ref(false);

// moja lista (ocjena)
const myList = useMyList();
const inMyList = ref(false);
const myRating = ref(1);
const savingMyList = ref(false);

onMounted(async () => {
  inList.value = await has(route.params.id as string);
  const rec = await myList.get(route.params.id as string);
  if (rec) {
    inMyList.value = true;
    myRating.value = rec.rating ?? 1;
  }
});

async function toggleWatchlist() {
  if (!anime.value) return;
  saving.value = true;
  try {
    if (inList.value) {
      await remove(anime.value.id);
      inList.value = false;
    } else {
      await add(anime.value);
      inList.value = true;
    }
  } finally {
    saving.value = false;
  }
}

async function toggleMyList() {
  if (!anime.value) return;
  savingMyList.value = true;
  try {
    if (inMyList.value) {
      await myList.remove(anime.value.id);
      inMyList.value = false;
    } else {
      await myList.add(anime.value, myRating.value);
      inMyList.value = true;
    }
  } finally {
    savingMyList.value = false;
  }
}

// ako je vec u listi, promjena ocjene se odmah sprema
async function onRatingChange() {
  if (inMyList.value && anime.value) {
    await myList.setRating(anime.value.id, myRating.value);
  }
}

// za ljepsi prikaz statusa/sezone/tipa
const statusi: Record<string, string> = {
  finished_airing: "Završeno",
  currently_airing: "Emitira se",
  not_yet_aired: "Najavljeno",
};
const sezone: Record<string, string> = {
  winter: "Zima",
  spring: "Proljeće",
  summer: "Ljeto",
  fall: "Jesen",
};
const tipovi: Record<string, string> = {
  tv: "TV",
  movie: "Film",
  ova: "OVA",
  ona: "ONA",
  special: "Special",
  music: "Music",
};

function formatSezona(s?: { year: number; season: string }) {
  if (!s) return "—";
  return `${sezone[s.season] ?? s.season} ${s.year}`;
}
function formatTrajanje(sekunde?: number) {
  if (!sekunde) return "—";
  return `${Math.round(sekunde / 60)} min`;
}
</script>

<template>
  <div>
    <NuxtLink to="/dashboard" class="text-blue-600 hover:underline text-sm">
      ← Natrag na popis
    </NuxtLink>

    <div v-if="pending" class="text-center text-gray-500 mt-8">
      <p>Učitavanje detalja...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
      <strong class="font-bold">Greška! </strong>
      <span>{{ error.message }}</span>
    </div>

    <div v-else-if="anime" class="bg-white rounded-lg shadow mt-4 p-6">
      <div class="flex flex-col md:flex-row gap-6">
        <img
          :src="anime.main_picture?.large"
          :alt="anime.title"
          class="w-48 rounded-lg object-cover self-start mx-auto md:mx-0">

        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-800">{{ anime.title }}</h1>

          <div class="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
            <span><b>Ocjena:</b> ⭐ {{ anime.mean ?? "—" }}</span>
            <span><b>Rank:</b> #{{ anime.rank ?? "—" }}</span>
            <span><b>Tip:</b> {{ tipovi[anime.media_type] ?? anime.media_type }}</span>
            <span><b>Epizode:</b> {{ anime.num_episodes || "—" }}</span>
            <span><b>Trajanje:</b> {{ formatTrajanje(anime.average_episode_duration) }}</span>
            <span><b>Sezona:</b> {{ formatSezona(anime.start_season) }}</span>
            <span><b>Status:</b> {{ statusi[anime.status] ?? anime.status }}</span>
            <span v-if="anime.studios?.length">
              <b>Studio:</b> {{ anime.studios.map((s: any) => s.name).join(", ") }}
            </span>
          </div>

          <!-- zanrovi -->
          <div v-if="anime.genres?.length" class="flex flex-wrap gap-2 mt-4">
            <span
              v-for="zanr in anime.genres"
              :key="zanr.id"
              class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {{ zanr.name }}
            </span>
          </div>

          <!-- gumbi za liste -->
          <div class="mt-5 flex flex-col gap-3">
            <button
              @click="toggleWatchlist"
              :disabled="saving"
              class="w-fit font-bold py-2 px-4 rounded text-white transition disabled:opacity-50"
              :class="inList ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'">
              {{ inList ? "✓ Ukloni iz liste gledanja" : "+ Dodaj u listu gledanja" }}
            </button>

            <!-- ocjena + dodavanje u moju listu -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-700">Moja ocjena:</label>
              <select
                v-model.number="myRating"
                @change="onRatingChange"
                class="border rounded p-1 text-sm">
                <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
              </select>
              <button
                @click="toggleMyList"
                :disabled="savingMyList"
                class="font-bold py-2 px-4 rounded text-white transition disabled:opacity-50"
                :class="inMyList ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'">
                {{ inMyList ? "✓ Ukloni iz moje liste" : "+ Dodaj u moju listu" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- opis -->
      <div class="mt-6">
        <h2 class="text-lg font-bold text-gray-700 mb-2">Opis</h2>
        <p class="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
          {{ anime.synopsis || "Nema dostupnog opisa." }}
        </p>
      </div>
    </div>
  </div>
</template>
