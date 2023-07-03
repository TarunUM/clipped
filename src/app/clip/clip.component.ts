import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
})
export class ClipComponent implements OnInit {
  id = '';
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  players?: videojs.Player;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    console.log(this.target);
    this.players = videojs(this.target?.nativeElement);
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
  }
}
