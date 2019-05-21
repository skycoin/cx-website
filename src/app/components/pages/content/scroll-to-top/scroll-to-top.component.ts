import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent {
  show = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.show = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
