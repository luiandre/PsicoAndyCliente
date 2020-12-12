import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TestAutoestima } from '../models/testAutoestima.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TestAutoestimaService {

  constructor(  private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  crearTest(test: TestAutoestima) {
    const url = `${ base_url }/testautoestima`;
    return this.http.post(url, test, this.headers);
  }

  getTest(id: string) {
    const url = `${ base_url }/testautoestima/${ id }`;
    return this.http.get(url, this.headers).pipe(
      map( (resp: any) => resp = resp.tests)
    );
  }
}
