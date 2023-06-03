import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAppEventBlocker]',
})
export class AppEventBlockerDirective {
  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  handleEvent = (event: Event) => {
    event.preventDefault();
  };
}
