import { Injectable } from '@angular/core';
import { createFFmpeg } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
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
}
