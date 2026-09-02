import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// Composable za rad s "listom gledanja" trenutnog korisnika.
// Podaci se spremaju u Firestore pod: users/{uid}/watchlist/{animeId}
// Napomena: koristi se samo na klijentu (Firebase $db/$auth su klijentski).
export function useWatchlist() {
  const { $db, $auth } = useNuxtApp();

  function uid(): string | null {
    return $auth.currentUser?.uid ?? null;
  }

  // Dodaj anime u listu gledanja
  async function add(anime: any) {
    const id = uid();
    if (!id) return;
    await setDoc(doc($db, "users", id, "watchlist", String(anime.id)), {
      animeId: anime.id,
      title: anime.title,
      image: anime.main_picture?.large ?? anime.main_picture?.medium ?? "",
      mean: anime.mean ?? null,
      addedAt: serverTimestamp(),
    });
  }

  // Ukloni anime iz liste gledanja
  async function remove(animeId: number | string) {
    const id = uid();
    if (!id) return;
    await deleteDoc(doc($db, "users", id, "watchlist", String(animeId)));
  }

  // Provjeri je li anime već u listi
  async function has(animeId: number | string): Promise<boolean> {
    const id = uid();
    if (!id) return false;
    const snap = await getDoc(doc($db, "users", id, "watchlist", String(animeId)));
    return snap.exists();
  }

  // Dohvati cijelu listu gledanja
  async function all(): Promise<any[]> {
    const id = uid();
    if (!id) return [];
    const snap = await getDocs(collection($db, "users", id, "watchlist"));
    return snap.docs.map((d) => d.data());
  }

  return { add, remove, has, all };
}
