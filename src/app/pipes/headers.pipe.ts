import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'headers'
})
export class HeadersPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    const re = new RegExp(/<h([1-6])>(.+?)<\/h[1-6]>/gm);

    value = value.replace(re, (match, level, text) => {
      return `<h${level}>${text}</h${level}>`;
    });

    return value;
  }

}
