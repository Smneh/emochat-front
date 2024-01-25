import {EventEmitter, Injectable} from '@angular/core';
import {IConfiguration} from '../models/configs';
import {UserService} from './user.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {
  settings: IConfiguration;
  settingsLoaded$ = new EventEmitter();
  isReady: boolean = false;
  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.userService.loadUserDataFromStorage();
  }

  load(): any {
    this.settings = {
      protocol: 'Http',
      PEAddress: 'http://151.239.254.82:5005',
      maxUploadFileSizeMB: 100,
      PEAddress2: 'http://151.239.254.82:5005'
    };
    this.isReady = true;
    this.settingsLoaded$.emit();
    this.router.navigate(['/'])
  }
}
