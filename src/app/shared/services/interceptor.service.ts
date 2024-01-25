import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of, Subject, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {SecurityService} from './security.service';
import {SnackbarMessageService} from "./snackbar-message.service";

@Injectable()
export class InterceptorService implements HttpInterceptor {
  refreshingToken = false;
  requests: HttpRequest<any>[] = [];
  private subject: Subject<void> = new Subject<void>();

  constructor(
    private _securityService: SecurityService,
    private SnackbarMessageService: SnackbarMessageService,
  ) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.includes(environment.Upload_Path) && !req.url.includes('/api/111')
      && !req.url.includes(environment.Upload_Profile_Picture_Path)
      && !req.url.includes('/assets/')) {
      req = this.setHeaders(req);
    }
    this.subject.subscribe(() => {
      this.handleQueue(next);
    });
    return next.handle(req).pipe(
      catchError((error) => {
        return this.handleErrors(error, req, next);
      })
    );
  }

  handleErrors(error, req, next): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('Client side error: ', error.error.message);
      return of(null);
    } else {
      switch (error.status) {
        case 400:
          this.SnackbarMessageService.error(error.error.Message);
          break;
        case 401:
          this._securityService.showLoginErrorMessage();
          if (!this.refreshingToken) return this.refreshToken(req, next);
          else this.requests.push(req);
          return null;
        case 500:
          break;
        default:
          console.error(
            'Backend - ' +
            `status: ${error.status}, ` +
            `statusText: ${error.statusText}, `
          );
          break;
      }
      return of(null);
    }
  }

  refreshToken(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.refreshingToken = true;
    return this._securityService.refreshToken().pipe(
      map((res) => {
        if (res) {
          this.refreshingToken = false;
          this.requests.push(req);
          this.subject.next();
        } else {
          this._securityService.logout();
          return null;
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  handleQueue(next: HttpHandler) {
    this.requests.forEach((req) => {
      req = this.setHeaders(req);
      let r = req.clone({
        headers: req.headers,
        body: req.body,
      });
      next.handle(r);
      let index = this.requests.findIndex((x) => x == req);
      this.requests.splice(index, 1);
    });
  }

  setHeaders(req: HttpRequest<any>) {
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: 'Bearer ' + this._securityService.GetToken(),
      },
    });

    return req;
  }
}
