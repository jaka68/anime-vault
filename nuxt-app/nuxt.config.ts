// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // DODAJ OVAJ DIO
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // Ovaj dio već imaš, ostavi ga kako jest
  runtimeConfig: {
    malClientId: process.env.MAL_CLIENT_ID,
  },
})
