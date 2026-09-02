<script setup lang="ts">
import { ref, computed } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const message = ref("");

// Provjera jačine lozinke (uvjeti iz skripte 3)
const hasMinLength = computed(() => password.value.length >= 8);
const hasUpper = computed(() => /[A-Z]/.test(password.value));
const hasNumber = computed(() => /[0-9]/.test(password.value));
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(password.value));

// Broj ispunjenih uvjeta (0-4)
const strength = computed(
  () =>
    [hasMinLength, hasUpper, hasNumber, hasSpecial].filter((c) => c.value).length
);

const strengthColor = computed(
  () =>
    ["bg-red-500", "bg-red-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"][
      strength.value
    ]
);

const passwordsMatch = computed(
  () => confirmPassword.value.length > 0 && password.value === confirmPassword.value
);

// Forma je ispravna kada su svi uvjeti ispunjeni i lozinke se podudaraju
const isValid = computed(() => strength.value === 4 && passwordsMatch.value);

function firebaseGreska(code: string) {
  const poruke: Record<string, string> = {
    "auth/email-already-in-use": "Ovaj email je već registriran.",
    "auth/invalid-email": "Neispravna email adresa.",
    "auth/weak-password": "Lozinka je preslaba.",
  };
  return poruke[code] ?? "Greška pri registraciji. Pokušajte ponovno.";
}

async function register() {
  if (!isValid.value) return;
  try {
    const { $auth } = useNuxtApp();
    await createUserWithEmailAndPassword($auth, email.value, password.value);
    // Nakon registracije Firebase automatski prijavi korisnika
    navigateTo("/dashboard");
  } catch (error: any) {
    message.value = firebaseGreska(error.code);
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-2xl shadow-md w-96">
      <h1 class="text-xl font-bold mb-4 text-center">Register</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full mb-3 p-2 border rounded-lg focus:ring focus:ring-blue-300" />

      <!-- Lozinka + prikaži/sakrij -->
      <div class="relative mb-3">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          class="w-full p-2 pr-16 border rounded-lg focus:ring focus:ring-blue-300" />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:underline">
          {{ showPassword ? "Sakrij" : "Prikaži" }}
        </button>
      </div>

      <!-- Potvrda lozinke -->
      <input
        v-model="confirmPassword"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Ponovi lozinku"
        class="w-full mb-3 p-2 border rounded-lg focus:ring focus:ring-blue-300" />

      <!-- Indikator jačine lozinke -->
      <div v-if="password" class="mb-3">
        <div class="h-2 rounded bg-gray-200 overflow-hidden mb-2">
          <div
            class="h-full transition-all duration-300"
            :class="strengthColor"
            :style="{ width: (strength / 4) * 100 + '%' }"></div>
        </div>
        <ul class="text-xs space-y-1">
          <li :class="hasMinLength ? 'text-green-600' : 'text-gray-400'">
            {{ hasMinLength ? "✓" : "•" }} Najmanje 8 znakova
          </li>
          <li :class="hasUpper ? 'text-green-600' : 'text-gray-400'">
            {{ hasUpper ? "✓" : "•" }} Veliko slovo
          </li>
          <li :class="hasNumber ? 'text-green-600' : 'text-gray-400'">
            {{ hasNumber ? "✓" : "•" }} Broj
          </li>
          <li :class="hasSpecial ? 'text-green-600' : 'text-gray-400'">
            {{ hasSpecial ? "✓" : "•" }} Specijalni znak
          </li>
          <li :class="passwordsMatch ? 'text-green-600' : 'text-gray-400'">
            {{ passwordsMatch ? "✓" : "•" }} Lozinke se podudaraju
          </li>
        </ul>
      </div>

      <button
        @click="register"
        :disabled="!isValid"
        class="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
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
