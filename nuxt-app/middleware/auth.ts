// Zaštita ruta: propušta samo prijavljene korisnike.
// Firebase se inicijalizira samo na klijentu (firebase.client.ts),
// pa provjeru radimo tek na klijentskoj strani.
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;

  const { $auth } = useNuxtApp();

  // Pričekaj da Firebase obnovi sesiju (npr. nakon osvježavanja stranice)
  await $auth.authStateReady();

  if (!$auth.currentUser) {
    // Puni redirect (ne klijentska zamjena) da se /login učita čisto,
    // jednako kao kad ga korisnik otvori izravno.
    window.location.replace("/login");
    return abortNavigation();
  }
});
