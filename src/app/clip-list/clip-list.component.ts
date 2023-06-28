import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-clip-list',
  templateUrl: './clip-list.component.html',
  styleUrls: ['./clip-list.component.css'],
})
export class ClipListComponent implements OnInit, OnDestroy {
  ngOnInit() {
    window.addEventListener('scroll', this.handleScroll);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    const botttomOfWindow =
      Math.round(scrollTop) + innerHeight === offsetHeight;
    if (botttomOfWindow) {
      console.log('botttom of window');
    }
  };
}
