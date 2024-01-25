import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from 'src/environments/environment';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  private buildHeaders(contentType: string = 'application/json'): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private buildParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.set(key, params[key]);
        }
      }
    }
    return httpParams;
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    let url = `${environment.Web_Api_Url}${endpoint}`;
    const headers = this.buildHeaders();
    const httpParams = this.buildParams(params);

    return this.http.get<T>(url, {headers, params: httpParams});
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    let url = `${environment.Web_Api_Url}${endpoint}`;

    const headers = this.buildHeaders();

    return this.http.post<T>(url, data, {headers});
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    let url = `${environment.Web_Api_Url}${endpoint}`;

    const headers = this.buildHeaders();

    return this.http.put<T>(url, data, {headers});
  }

  delete<T>(endpoint: string): Observable<T> {
    let url = `${environment.Web_Api_Url}${endpoint}`;

    const headers = this.buildHeaders();

    return this.http.delete<T>(url, {headers});
  }
}
