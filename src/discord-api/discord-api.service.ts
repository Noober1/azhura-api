import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class DiscordApiService implements OnModuleInit {
  constructor(private config: ConfigService) {}
  private userId: string = this.config.get('discord.userId');
  private discordAPI: AxiosInstance;

  onModuleInit() {
    this.discordAPI = axios.create({
      baseURL: this.config.get('discord.apiUrl'),
      headers: {
        Authorization: this.config.get('discord.apiToken'),
      },
    });
  }

  async getMyUserdata(): ReturnType<typeof this.getUserdata> {
    return this.getUserdata(this.userId);
  }

  async getUserdata(userId: string): Promise<any | null> {
    try {
      const data = await this.discordAPI.get(`/users/${userId}`);
      return data.data;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  async getUserActivity(userId: string) {
    try {
      const getActivity = await this.discordAPI.get(
        `/content-inventory/users/${userId}/outbox`,
      );
      return getActivity.data;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  async getAppsInfo(appIds: string[]) {
    const query = new URLSearchParams();
    appIds.forEach((value) => {
      query.append('application_ids', value);
    });

    try {
      const getAppInfo = await this.discordAPI.get(
        `/applications/public?${query}`,
      );
      return getAppInfo.data.length == 1 ? getAppInfo.data[0] : getAppInfo.data;
    } catch (error) {
      console.error(error);
    }
  }

  async getActivities(userId: string) {
    try {
      const activity = await this.getUserActivity(userId);
      if (!activity) {
        throw new Error('No activity data');
      }

      const getAppIcon = activity.entries.map(
        (item) => item.extra.application_id,
      );
      const appsInfo = await this.getAppsInfo(getAppIcon);

      return appsInfo;
    } catch (error) {
      console.error(error);
    }
  }
}
