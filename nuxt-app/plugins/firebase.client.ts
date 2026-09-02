import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
    // config se cita iz .env (preko nuxt.config.ts)
    const config = useRuntimeConfig();

    const app = initializeApp(config.public.firebase);

    // auth za prijavu, db za bazu
    const auth = getAuth(app);
    const db = getFirestore(app);

    // da im mozemo pristupati svugdje preko $auth i $db
    return {
        provide: {
            auth,
            db,
        },
    };
});
