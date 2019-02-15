import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  executeCode(code: string) {
    return this.http.post(environment.replURL, { Code: code }, { responseType: 'text' });
  }
}
