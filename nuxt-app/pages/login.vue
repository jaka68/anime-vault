<script setup lang="ts">
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";

const { $auth } = useNuxtApp();
const auth = $auth;

const email = ref("");
const password = ref("");
const message = ref("");
const error = ref(false);

async function login() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    navigateTo('/dashboard');
  } catch (err: any) {
    message.value = "Pogrešan e-mail ili lozinka.";
    error.value = true;
  }
}
</script>

<template>
  <div class="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center" style="background-image: url('https://wallpapercave.com/wp/wp6775494.jpg');">
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <div class="relative bg-indigo-800 bg-opacity-80 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white backdrop-blur-sm">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold">Prijava na račun</h1>
        <p class="text-indigo-200">Dobrodošli natrag u AnimeVault</p>
      </div>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block mb-2 text-sm font-medium text-indigo-200">Unesite e-mail adresu:</label>
          <input v-model="email" type="email" id="email" class="w-full px-4 py-3 bg-indigo-700 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition" placeholder="vas.email@primjer.com" required>
        </div>
        <div class="mb-6">
          <label for="password" class="block mb-2 text-sm font-medium text-indigo-200">Unesite lozinku:</label>
          <input v-model="password" type="password" id="password" class="w-full px-4 py-3 bg-indigo-700 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition" placeholder="••••••••" required>
        </div>

        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
          Prijavi me
        </button>

        <p v-if="message && error" class="mt-4 text-center text-red-300">{{ message }}</p>

        <div class="mt-6 text-center">
          <p class="text-indigo-200">Nemate račun?
            <NuxtLink to="/register" class="font-bold hover:underline">Registrirajte se</NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
