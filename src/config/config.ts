export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  appSecret: process.env.APP_SECRET,
  discord: {
    apiUrl: process.env.DISCORD_API_URL,
    apiToken: process.env.DISCORD_AUTH_TOKEN,
    userId: process.env.DISCORD_USER_ID,
    authURL: process.env.DISCORD_AUTH_URL,
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    botToken: process.env.DISCORD_BOT_TOKEN,
    guildId: process.env.DISCORD_GUILD_ID,
  },
  auth: {
    discordCallbackURI: process.env.DISCORD_AUTH_CALLBACK_URI,
  },
  github: {
    apiUrl: process.env.GITHUB_API_URL,
    userId: process.env.GITHUB_USER_ID,
  },
});
