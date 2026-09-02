// ako user nije prijavljen, baci ga na login
// firebase radi samo na klijentu pa provjeravamo tek tamo
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;

  const { $auth } = useNuxtApp();

  // cekamo da firebase provjeri je li user jos prijavljen (npr. nakon refresha)
  await $auth.authStateReady();

  if (!$auth.currentUser) {
    window.location.replace("/login");
    return abortNavigation();
  }
});
