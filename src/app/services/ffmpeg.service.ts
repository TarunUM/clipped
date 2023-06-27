import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  isRunning = false;
  isReady = false;
  private _ffmpeg;

  constructor() {
    this._ffmpeg = createFFmpeg({
      log: true,
    });
  }

  async init() {
    if (this.isReady) {
      return;
    }

    await this._ffmpeg.load();

    this.isReady = true;
  }

  async getScreenshots(file: File) {
    this.isRunning = true;
    const data = await fetchFile(file);
    this._ffmpeg.FS('writeFile', file.name, data);

    const seconds = [1, 2, 3];

    const commands: string[] = [];

    seconds.forEach((second) => {
      commands.push(
        // Input
        '-i',
        file.name,
        // Output Options
        '-ss',
        `00:00:0${second * 3}`,
        // ---
        '-frames:v',
        '1',
        // ---
        '-filter:v',
        'scale=510:-1',
        // Output
        `output_0${second}.png`
      );
    });

    await this._ffmpeg.run(...commands);

    const screenshots: string[] = [];
    seconds.forEach((second) => {
      const screenshotFile = this._ffmpeg.FS(
        'readFile',
        `output_0${second}.png`
      );

      const screenshotBlob = new Blob([screenshotFile], {
        type: 'image/png',
      });

      const screenshotUrl = URL.createObjectURL(screenshotBlob);

      screenshots.push(screenshotUrl);
    });
    this.isRunning = false;

    return screenshots;
  }

  async blobFromUrl(url: string) {
    const response = await fetch(url);
    return await response.blob();
  }
}
