<script setup lang="ts">
// pocetna ruta nista ne prikazuje, samo preusmjerava korisnika
// firebase radi samo na klijentu pa cekamo mount
const { $auth } = useNuxtApp();

onMounted(async () => {
  // cekamo da firebase provjeri je li user vec prijavljen
  await $auth.authStateReady();

  if ($auth.currentUser) {
    navigateTo("/dashboard", { replace: true });
  } else {
    navigateTo("/login", { replace: true });
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-indigo-900 text-white">
    <p>Učitavanje...</p>
  </div>
</template>
