import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild("dropdownOther", {read: ElementRef}) dropdownOther: ElementRef;
  @ViewChild("dropdownOverview", {read: ElementRef}) dropdownOverview: ElementRef;
  constructor() { }

  ngOnInit() {
  }

  toggleMenu(menuVisible) {
    console.log(menuVisible);
    if (menuVisible) {
      $('.menu-overlay').show();
      $('.nav-inner').addClass('visible');
      $('body').css('overflow', 'hidden');
    } else {
      $('.menu-overlay').hide();
      $('.nav-inner').removeClass('visible');
      $('body').css('overflow', 'auto');
    }
  }

  onClickDropdownToggle(nav) {
    if(nav !== 'overview') {
      this.dropdownOther.nativeElement.parentElement.querySelector('.dropdown-menu').classList.toggle("open");
    } else {
      this.dropdownOverview.nativeElement.parentElement.querySelector('.dropdown-menu').classList.toggle("open");
    }
  }

}
