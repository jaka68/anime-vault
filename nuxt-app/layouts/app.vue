<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";

const isOpen = ref(false);

// pretraga iz gornje trake
const searchQuery = ref("");
function submitSearch() {
  if (!searchQuery.value.trim()) return;
  navigateTo({ path: "/search", query: { q: searchQuery.value } });
}

// email prijavljenog usera ($auth radi samo na klijentu)
const userEmail = ref<string>("");

onMounted(() => {
  const { $auth } = useNuxtApp();
  userEmail.value = $auth.currentUser?.email ?? "";
  onAuthStateChanged($auth, (user) => {
    userEmail.value = user?.email ?? "";
  });
});

async function handleLogout() {
  const { $auth } = useNuxtApp();
  await signOut($auth);
  navigateTo("/login");
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- gornja traka -->
    <header class="bg-white shadow">
      <div class="container mx-auto px-6 py-4 flex items-center gap-4">
        <button
          @click="isOpen = true"
          class="text-2xl text-gray-700 hover:text-gray-900 cursor-pointer"
          aria-label="Otvori izbornik">
          ☰
        </button>
        <h1 class="text-2xl font-bold text-gray-800">Anime Vault</h1>

        <!-- trazilica -->
        <form @submit.prevent="submitSearch" class="ml-auto flex gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Pretraži anime..."
            class="w-40 sm:w-64 p-2 border rounded-lg text-sm focus:ring focus:ring-blue-300" />
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 px-3 rounded-lg">
            Traži
          </button>
        </form>
      </div>
    </header>

    <!-- zatamnjenje kad je meni otvoren -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 bg-black/50 z-20"></div>

    <!-- bocni meni -->
    <aside
      class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'">
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between p-4 border-b">
          <span class="text-lg font-bold text-gray-800">Izbornik</span>
          <button
            @click="isOpen = false"
            class="text-2xl text-gray-500 hover:text-gray-800 cursor-pointer"
            aria-label="Zatvori izbornik">
            ×
          </button>
        </div>

        <nav class="flex flex-col p-4 gap-1">
          <NuxtLink
            to="/dashboard"
            @click="isOpen = false"
            active-class="bg-gray-200 font-semibold text-gray-900"
            class="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">
            Početna
          </NuxtLink>
          <NuxtLink
            to="/moja-lista"
            @click="isOpen = false"
            active-class="bg-gray-200 font-semibold text-gray-900"
            class="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">
            Moja anime lista
          </NuxtLink>
          <NuxtLink
            to="/lista-gledanja"
            @click="isOpen = false"
            active-class="bg-gray-200 font-semibold text-gray-900"
            class="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">
            Lista gledanja
          </NuxtLink>
        </nav>

        <div class="mt-auto p-4 border-t">
          <p v-if="userEmail" class="text-sm text-gray-600 mb-2 truncate">
            {{ userEmail }}
          </p>
          <button
            @click="handleLogout"
            class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Odjava
          </button>
        </div>
      </div>
    </aside>

    <!-- ovdje ide sadrzaj stranice -->
    <main class="container mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>
