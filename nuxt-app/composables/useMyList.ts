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

// moja lista = odgledani animei s mojom ocjenom
// sprema se u firestore (users/uid/mylist/animeId), sortira po ocjeni
export function useMyList() {
  const { $db, $auth } = useNuxtApp();

  function uid(): string | null {
    return $auth.currentUser?.uid ?? null;
  }

  // dodaj anime s ocjenom
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

  // promijeni ocjenu
  async function setRating(animeId: number | string, rating: number) {
    const id = uid();
    if (!id) return;
    await updateDoc(doc($db, "users", id, "mylist", String(animeId)), { rating });
  }

  async function remove(animeId: number | string) {
    const id = uid();
    if (!id) return;
    await deleteDoc(doc($db, "users", id, "mylist", String(animeId)));
  }

  async function get(animeId: number | string): Promise<any | null> {
    const id = uid();
    if (!id) return null;
    const snap = await getDoc(doc($db, "users", id, "mylist", String(animeId)));
    return snap.exists() ? snap.data() : null;
  }

  // dohvati sve, najbolje ocijenjeni prvi
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
