import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent {
  url: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private router: Router,
  ) {
    const editorUrl = router.createUrlTree(['/editor'], { queryParams: { code: data }}).toString();
    this.url = window.location.origin + '/#' + editorUrl;
  }
}
