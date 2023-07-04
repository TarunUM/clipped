import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { type } from 'os';
import videojs from 'video.js';
import IClip from '../models/iclip.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class ClipComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  players?: videojs.Player;
  clip?: IClip;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.players = videojs(this.target?.nativeElement);
    this.route.params.subscribe((params: Params) => {
      this.route.data.subscribe((data) => {
        console.log(data);
        this.clip = data['clip'] as IClip;

        this.players?.src({
          src: this.clip.url,
          type: 'video/mp4',
        });
      });
    });
  }
}
