export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      APP_SECRET: string;
      DISCORD_API_URL: string;
      DISCORD_AUTH_TOKEN: string;
      DISCORD_USER_ID: string;
      DISCORD_AUTH_URL: string;
      DISCORD_CLIENT_SECRET: string;
      DISCORD_BOT_TOKEN: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_AUTH_CALLBACK_URI: string;
      DISCORD_GUILD_ID: string;
      GITHUB_API_URL: string;
      GITHUB_USER_ID: string;
      JWT_SECRET: string;
    }
  }
}
