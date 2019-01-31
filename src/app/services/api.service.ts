import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  executeCode(code: string) {
    return this.http.post('/eval', { Code: code }, { responseType: 'text' });
  }
}
