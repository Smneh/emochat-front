import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {finalize, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {StorageService} from './storage.service';
import {catchError, map, tap} from 'rxjs/operators';
import {SnackbarMessageService} from "./snackbar-message.service";
import {SignUpDto} from 'src/app/modules/sign-up-page/models/SignUpDto';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private _SnackbarMessageService: SnackbarMessageService,
    private storageService: StorageService
  ) {}

  Login(username:string, password:string) {
    let url = `${environment.Web_Api_Url}${environment.Login_Path}`;
    return this.http.post(url, {username:username,password:password}).pipe(
      tap((res: any) => {
        return res;
      }),
      finalize(() => {
        this.loading = false;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  SignUp(signUpDto: SignUpDto) {
    let url = `${environment.Web_Api_Url}${environment.SignUp_Path}`;
    return this.http.post(url, signUpDto).pipe(
      tap((res: any) => {
        return res;
      }),
      finalize(() => {
        this.loading = false;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  GetToken(): any {
    return this.storageService.retrieve('accessToken');
  }

  SetToken(token) {
    this.storageService.store('accessToken', token);
  }

  // @ts-ignore
  GetUsername() {
    let tokenInfo: any = this.GetDecodedToken(
      this.GetToken()
    );
    if (tokenInfo) {
      return tokenInfo.UN;
    }
  }

  checkTokenExpiration() {
    let decoded: any = this.GetDecodedToken(this.GetToken());
    const now = Date.now().valueOf() / 1000;
    if (decoded) {
      if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  refreshToken() {
    let tokenInfo: any = this.GetDecodedToken(
      this.GetToken()
    );
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    let url = `${environment.Web_Api_Url}/api/Token/Refresh`;
    let body = { username: this.GetUsername(), sessionId: tokenInfo.SI };
    return this.http.post(url, body, { headers: header }).pipe(
      map((res: any) => {
        if (res.status && res.status == 'ERROR') {
          this.logout();
          return null;
        } else {
          this.SetToken(res.tokenList);
          this.storageService.storeObject(res.userData);
          return res;
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      console.error('Client side network error occurred:', error.error.message);
    } else {
      console.error(
        'Backend - ' +
          `status: ${error.status}, ` +
          `statusText: ${error.statusText}, ` +
          `message: ${error.error.message}`
      );
    }
    return throwError(error || 'server error');
  }

  logout(url?: string) {
    if (!url) url = '/custom-login';
    if (this.GetToken() == '' || !this.GetToken()) {
      this.ResetTokenData();
      this.storageService.clear();
      this.router.navigate([url]);
      return;
    }
    let logoutUrl = `${environment.Web_Api_Url}${environment.Logout_Path}`;
    let headers = new HttpHeaders({
      Authorization: `${this.GetToken()}`,
    });
    this.http
      .post(logoutUrl, null, { headers: headers })
      .pipe(
        tap((res: any) => {
          var jsonParsed = JSON.parse(res);
          if (jsonParsed.isSuccess) {
            this.ResetTokenData();
            this.storageService.clear();
          }
        }),
        catchError((error) => this.handleError(error)),
        finalize(() => {
          this.ResetTokenData();
          this.storageService.clear();
          this.router.navigate([url]);
        })
      )
      .subscribe();
  }

  public ResetTokenData() {
    this.storageService.store('accessToken', '');
  }

  showLoginErrorMessage() {
    this._SnackbarMessageService.error('Username Or Password Is Incorrect!');
    this.loading = false;
  }

  GetDecodedToken(token: string) {
    try {
      return jwt_decode(token);
    } catch (error) {
      return null;
    }
  }
}
