import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = (future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot) => {
      return future.fragment !== current.fragment && future.url.join('/') === current.url.join('/');
    };
  }
}
