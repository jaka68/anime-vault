import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
    // Konfiguracija se čita iz runtime configa (vidi nuxt.config.ts + .env)
    const config = useRuntimeConfig();

    // Inicijalizacija Firebase aplikacije
    const app = initializeApp(config.public.firebase);

    // Inicijalizacija Firebase usluga
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Omogućavanje pristupa Firebase uslugama u cijeloj aplikaciji
    return {
        provide: {
            auth,
            db,
        },
    };
});
