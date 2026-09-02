export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const clientId = config.malClientId;

    // parametri iz url-a
    const query = getQuery(event);
    const rankingType = query.rankingType || 'all';
    const random = query.random === 'true';
    const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50); // max 50

    if (!clientId) {
        throw createError({
            statusCode: 500,
            statusMessage: 'MyAnimeList Client ID nije postavljen u runtime konfiguraciji.',
        });
    }

    try {
        const fields = 'id,title,main_picture,mean';
        const base = 'https://api.myanimelist.net/v2/anime/ranking';
        const headers = { 'X-MAL-CLIENT-ID': clientId };

        if (random) {
            // uzmi top 500, izmijesaj i vrati par nasumicnih
            const url = `${base}?ranking_type=${rankingType}&limit=500&fields=${fields}`;
            const response = await $fetch<any>(url, { headers });
            const izmijesano = [...(response.data ?? [])]
                .sort(() => Math.random() - 0.5)
                .slice(0, limit);
            return { ...response, data: izmijesano };
        }

        // inace samo top `limit` po redu
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
