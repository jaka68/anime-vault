<script setup lang="ts">
import { ref } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";

const { $auth } = useNuxtApp();
const auth = $auth;
const email = ref("");
const password = ref("");
const message = ref("");

async function register() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    message.value = `Uspješna registracija: ${userCredential.user.email}`;
  } catch (error: any) {
    message.value = error.message;
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-2xl shadow-md w-80">
      <h1 class="text-xl font-bold mb-4 text-center">Register</h1>

      <input v-model="email" type="email" placeholder="Email"
             class="w-full mb-3 p-2 border rounded-lg focus:ring focus:ring-blue-300" />

      <input v-model="password" type="password" placeholder="Password"
             class="w-full mb-3 p-2 border rounded-lg focus:ring focus:ring-blue-300" />

      <button @click="register"
              class="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
        Register
      </button>

      <p class="text-sm text-gray-600 mt-3 text-center">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-500 hover:underline">Login</NuxtLink>
      </p>

      <p v-if="message" class="mt-3 text-center text-sm text-red-500">{{ message }}</p>
    </div>
  </div>
</template>
