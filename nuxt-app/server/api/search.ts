export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const clientId = config.malClientId;

    const q = ((getQuery(event).q as string) || "").trim();

    if (!clientId) {
        throw createError({
            statusCode: 500,
            statusMessage: "MyAnimeList Client ID nije postavljen u runtime konfiguraciji.",
        });
    }

    // MAL pretraga traži barem 2 znaka; za kraće vraćamo prazno
    if (q.length < 2) {
        return { data: [] };
    }

    try {
        const fields = "id,title,main_picture,mean";
        const url = `https://api.myanimelist.net/v2/anime?q=${encodeURIComponent(q)}&limit=24&fields=${fields}`;

        return await $fetch<any>(url, {
            headers: { "X-MAL-CLIENT-ID": clientId },
        });
    } catch (error) {
        console.error("Greška pri pretraživanju animea:", error);
        throw createError({
            statusCode: 502,
            statusMessage: "Nije uspjelo pretraživanje s MyAnimeList API-ja.",
        });
    }
});
