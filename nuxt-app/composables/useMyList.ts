import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// Composable za "Moju anime listu" - odgledani animei koje korisnik ocjenjuje.
// Podaci: users/{uid}/mylist/{animeId}. Lista se sortira po ocjeni (silazno).
// Koristi se samo na klijentu (Firebase $db/$auth su klijentski).
export function useMyList() {
  const { $db, $auth } = useNuxtApp();

  function uid(): string | null {
    return $auth.currentUser?.uid ?? null;
  }

  // Dodaj (odgledani) anime s ocjenom
  async function add(anime: any, rating: number) {
    const id = uid();
    if (!id) return;
    await setDoc(doc($db, "users", id, "mylist", String(anime.id)), {
      animeId: anime.id,
      title: anime.title,
      image: anime.main_picture?.large ?? anime.main_picture?.medium ?? "",
      mean: anime.mean ?? null,
      rating: rating,
      addedAt: serverTimestamp(),
    });
  }

  // Promijeni ocjenu postojećeg animea
  async function setRating(animeId: number | string, rating: number) {
    const id = uid();
    if (!id) return;
    await updateDoc(doc($db, "users", id, "mylist", String(animeId)), { rating });
  }

  // Ukloni anime iz liste
  async function remove(animeId: number | string) {
    const id = uid();
    if (!id) return;
    await deleteDoc(doc($db, "users", id, "mylist", String(animeId)));
  }

  // Dohvati jedan zapis (ili null ako ne postoji)
  async function get(animeId: number | string): Promise<any | null> {
    const id = uid();
    if (!id) return null;
    const snap = await getDoc(doc($db, "users", id, "mylist", String(animeId)));
    return snap.exists() ? snap.data() : null;
  }

  // Dohvati cijelu listu, sortiranu po ocjeni (najbolji prvi)
  async function all(): Promise<any[]> {
    const id = uid();
    if (!id) return [];
    const snap = await getDocs(collection($db, "users", id, "mylist"));
    return snap.docs
      .map((d) => d.data())
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  return { add, setRating, remove, get, all };
}
