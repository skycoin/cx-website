import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @ViewChild("dropdownOther", {read: ElementRef}) dropdownOther: ElementRef;
  @ViewChild("dropdownOverview", {read: ElementRef}) dropdownOverview: ElementRef;
  constructor() { }

  ngOnInit() {
  }

  onClickDropdownToggle(nav) {
    if(nav !== 'overview') {
      this.dropdownOther.nativeElement.parentElement.querySelector('.dropdown-menu').classList.toggle("open");
    } else {
      this.dropdownOverview.nativeElement.parentElement.querySelector('.dropdown-menu').classList.toggle("open");
    }
  }

}
