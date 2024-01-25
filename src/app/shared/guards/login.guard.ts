import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {SecurityService} from '../services/security.service';
import {SignalrService} from '../services/signalr.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private _securityService: SecurityService,
    private signalrService: SignalrService
  ) {}

  canActivate() {
    const status = this._securityService.checkTokenExpiration();
    if (status) {
      this._securityService.logout();
      this.signalrService.disconnect();
      return false;
    } else {
      return true;
    }
  }
}
