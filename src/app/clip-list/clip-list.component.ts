import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip-list',
  templateUrl: './clip-list.component.html',
  styleUrls: ['./clip-list.component.css'],
  providers: [DatePipe],
})
export class ClipListComponent implements OnInit, OnDestroy {
  @Input() scrollable: boolean = true;

  ngOnInit() {
    if (this.scrollable) {
      window.addEventListener('scroll', this.handleScroll);
    }
    console.log(process.env['API_KEY']);
  }

  ngOnDestroy() {
    if (this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll);
    }

    this.clipService.pageClips = [];
  }

  constructor(public clipService: ClipService) {
    this.clipService.getAllClips();
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    const botttomOfWindow =
      Math.round(scrollTop) + innerHeight === offsetHeight;
    if (botttomOfWindow) {
      this.clipService.getAllClips();
    }
  };
}
