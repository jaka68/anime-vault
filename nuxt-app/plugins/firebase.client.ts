import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
    // Ovdje unesite svoju Firebase konfiguraciju
    const firebaseConfig = {
        apiKey: "AIzaSyCgA7PtlVOh2RZWg_zR3VeQ3ePPfLbYpPU",
        authDomain: "your-project-id.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project-id.appspot.com",
        messagingSenderId: "...",
        appId: "...",
    };

    // Inicijalizacija Firebase aplikacije
    const app = initializeApp(firebaseConfig);

    // Inicijalizacija Firebase usluga
    const auth = getAuth(app);

    // Omogućavanje pristupa Firebase uslugama u cijeloj aplikaciji
    return {
        provide: {
            auth: auth,
        },
    };
});
