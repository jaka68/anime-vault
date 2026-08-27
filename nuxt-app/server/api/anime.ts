export default defineEventHandler(async (event) => {
    // Dohvaćamo konfiguraciju na ispravan Nuxt način
    const config = useRuntimeConfig(event);
    const clientId = config.malClientId;

    // Čitamo 'rankingType' iz URL-a (npr. ?rankingType=airing)
    const query = getQuery(event);
    const rankingType = query.rankingType || 'all'; // 'all' je zadana vrijednost

    // NOVO: Generiramo nasumični pomak (offset) da dobijemo različite rezultate svaki put
    // Dohvaćamo "stranicu" negdje između 1. i 100. mjesta
    const randomOffset = Math.floor(Math.random() * 95);

    if (!clientId) {
        throw createError({
            statusCode: 500,
            statusMessage: 'MyAnimeList Client ID nije postavljen u runtime konfiguraciji.',
        });
    }

    try {
        // Koristimo dinamički rankingType i NOVI nasumični offset u URL-u
        const url = `https://api.myanimelist.net/v2/anime/ranking?ranking_type=${rankingType}&limit=50&offset=${randomOffset}`;

        const response = await $fetch(url, {
            headers: {
                'X-MAL-CLIENT-ID': clientId,
            },
        });

        return response;

    } catch (error) {
        console.error('Greška pri dohvaćanju podataka s MyAnimeList API-ja:', error);
        throw createError({
            statusCode: 502,
            statusMessage: 'Nije uspjelo dohvaćanje podataka s MyAnimeList API-ja.',
        });
    }
});
