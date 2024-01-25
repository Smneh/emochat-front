import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {SecurityService} from './security.service';
import {HttpService} from './http.service';
import {ConfigsService} from './configs.service';
import {SnackbarMessageService} from './snackbar-message.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  constructor(
    private httpService: HttpService,
    private configurationService: ConfigsService,
    private securityService: SecurityService,
    private SnackbarMessageService: SnackbarMessageService,
  ) {
  }

  private sendRequest(apiRoute: string, parameters: any, method: 'GET' | 'POST' | 'PUT' | 'DELETE'): Observable<any> {
    if (this.securityService.checkTokenExpiration()) {
      this.securityService.logout();
      return of(null);
    }
    // Security
    //   if (this.securityService.CheckSecurityProblem(parameters)) {
    //     this.router.navigate(['SecurityProblem']);
    //     return of(null);
    //   }

    if (this.configurationService.settings.protocol === 'Http') {
      // Http
      const request = method === 'GET' ?
        this.httpService.get(apiRoute, parameters) :
        method === 'POST' ?
          this.httpService.post(apiRoute, parameters) :
          method === 'PUT' ?
            this.httpService.put(apiRoute, parameters) :
            method === 'DELETE' ?
              this.httpService.delete(apiRoute) :
              of(null);

      return request.pipe(
        map((response: any) => {
          if (response) {
            let token = this.securityService.GetToken();
            // Decrypt or process response as needed
            return response;
          }
        })
      );
    } else if (this.configurationService.settings.protocol === 'WebSocket') {
      // WebSocket
      return this.exchangeMessage().pipe();
    }
    // Return an observable indicating an error or no valid response
    return of(null);
  }

  get(apiRoute: string, parameters: any): Observable<any> {
    return this.sendRequest(apiRoute, parameters, 'GET');
  }

  post(apiRoute: string, parameters: any): Observable<any> {
    return this.sendRequest(apiRoute, parameters, 'POST');
  }

  put(apiRoute: string, parameters:any): Observable<any> {
    return this.sendRequest(apiRoute, parameters, 'PUT');
  }

  delete(apiRoute: string, parameters:any): Observable<any> {
    return this.sendRequest(apiRoute, parameters, 'DELETE');
  }

  exchangeMessage(): Observable<Response> {
    return null;
  }
}
