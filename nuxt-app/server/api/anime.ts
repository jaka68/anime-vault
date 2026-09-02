export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const clientId = config.malClientId;

    // Parametri iz URL-a
    const query = getQuery(event);
    const rankingType = query.rankingType || 'all';      // vrsta ljestvice
    const random = query.random === 'true';              // izmiješati ili ne
    // Broj animea (ograničen na 1-50 radi sigurnosti)
    const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50);

    if (!clientId) {
        throw createError({
            statusCode: 500,
            statusMessage: 'MyAnimeList Client ID nije postavljen u runtime konfiguraciji.',
        });
    }

    try {
        // Polja koja koristimo na karticama dashboarda
        const fields = 'id,title,main_picture,mean';
        const base = 'https://api.myanimelist.net/v2/anime/ranking';
        const headers = { 'X-MAL-CLIENT-ID': clientId };

        if (random) {
            // Dohvati veći bazen (top 500), izmiješaj i vrati nasumičnih `limit`
            const url = `${base}?ranking_type=${rankingType}&limit=500&fields=${fields}`;
            const response = await $fetch<any>(url, { headers });
            const izmijesano = [...(response.data ?? [])]
                .sort(() => Math.random() - 0.5)
                .slice(0, limit);
            return { ...response, data: izmijesano };
        }

        // Inače vrati top `limit` u redoslijedu ranga
        const url = `${base}?ranking_type=${rankingType}&limit=${limit}&fields=${fields}`;
        return await $fetch<any>(url, { headers });

    } catch (error) {
        console.error('Greška pri dohvaćanju podataka s MyAnimeList API-ja:', error);
        throw createError({
            statusCode: 502,
            statusMessage: 'Nije uspjelo dohvaćanje podataka s MyAnimeList API-ja.',
        });
    }
});
