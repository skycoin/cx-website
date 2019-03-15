import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  book;

  readonly books = [
    {
      title: 'CX Programming Language',
      route: 'cx-programming-language',
      file: 'cx-programming-language.pdf'
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      const book = this.books.find(b => b.route === map.get('book'));

      if (!book) {
        this.router.navigate(['/']);
      } else {
        this.book = book;
      }
    });
  }

  path(file: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`../../../../assets/books/${file}`);
  }
}
