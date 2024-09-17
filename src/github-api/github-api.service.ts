import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { DiscordApiService } from 'src/discord-api/discord-api.service';

@Injectable()
export class GithubApiService {
  constructor(
    private discordAPI: DiscordApiService,
    private config: ConfigService,
  ) {}
  private userId: string = this.config.get('github.userId');
  private githubApi: AxiosInstance;

  private GAME_CARD_WIDTH = 1920 - 100;
  private GAME_CARD_HEIGHT = 350;
  private GAME_CARD_X_POSITION = 50;
  private GAME_CARD_Y_POSITION = 1200;

  onModuleInit() {
    this.githubApi = axios.create({
      baseURL: this.config.get('github.apiUrl'),
    });
  }

  async getUserdata(): Promise<any | null> {
    try {
      const getData = await this.githubApi.get(`/user/${this.userId}`);
      return getData.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async generateGithubBanner() {
    const getUserData = this.discordAPI.getMyUserdata();
    const getGithubData = this.getUserdata();

    const [discordData, githubData] = await Promise.all([
      getUserData,
      getGithubData,
    ]);

    const getActivities = await this.discordAPI.getActivities(discordData.id);

    registerFont(process.cwd() + '/assets/fonts/Inpin.ttf', {
      family: 'Inpin',
    });

    const canvas = createCanvas(
      1920,
      1200 + this.GAME_CARD_HEIGHT * getActivities.length,
    );
    const context = canvas.getContext('2d');

    const coverImage = await loadImage(
      process.cwd() + '/assets/images/github-banner-cover.png',
    );
    const imageLayout = await loadImage(
      process.cwd() + '/assets/images/github-banner-layout.png',
    );

    // const gradientBg = context.createLinearGradient(
    //   canvas.width,
    //   1180,
    //   canvas.width,
    //   canvas.height,
    // );
    // gradientBg.addColorStop(0, '#282828');
    // gradientBg.addColorStop(1, '#000000');
    // context.fillStyle = gradientBg;
    // context.fillRect(0, 1180, canvas.width, canvas.height);
    // context.restore();

    context.save();
    context.beginPath();
    context.fillStyle = 'red';
    context.roundRect(50, 30, 300, 300, 30);
    context.clip();
    context.restore();

    // context.beginPath();
    // context.roundRect(0, 0, canvas.width, 1180, [40, 40, 0, 0]);
    // context.clip();
    // context.drawImage(coverImage, 0, 0, 1920, 1000);
    // context.restore();

    // context.drawImage(imageLayout, 0, 0, 1920, 1180);
    // context.font = '100px Rockwell';
    // context.fillStyle = '#fff';
    // context.fillText(githubData.name, 760, 930);
    // context.font = '80px Rockwell';
    // context.fillText(githubData.bio, 760, 1030);
    // context.restore();

    return canvas.toBuffer();
  }
}
