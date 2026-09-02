export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);
    const clientId = config.malClientId;

    const id = getRouterParam(event, "id");

    if (!clientId) {
        throw createError({
            statusCode: 500,
            statusMessage: "MyAnimeList Client ID nije postavljen u runtime konfiguraciji.",
        });
    }

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Nedostaje ID animea.",
        });
    }

    try {
        // sve sto trebamo za stranicu s detaljima
        const fields = [
            "id",
            "title",
            "main_picture",
            "synopsis",
            "mean",
            "rank",
            "popularity",
            "num_episodes",
            "start_season",
            "start_date",
            "end_date",
            "media_type",
            "status",
            "average_episode_duration",
            "source",
            "rating",
            "genres",
            "studios",
        ].join(",");

        const url = `https://api.myanimelist.net/v2/anime/${id}?fields=${fields}`;

        const response = await $fetch(url, {
            headers: {
                "X-MAL-CLIENT-ID": clientId,
            },
        });

        return response;
    } catch (error) {
        console.error("Greška pri dohvaćanju detalja animea:", error);
        throw createError({
            statusCode: 502,
            statusMessage: "Nije uspjelo dohvaćanje detalja animea s MyAnimeList API-ja.",
        });
    }
});
