import {EventEmitter, Injectable, Output} from '@angular/core';
import {StorageService} from './storage.service';
import {UserData} from "../models/UserData";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    userData: UserData = <UserData>{};
    onSuccessfulLogout = new EventEmitter<boolean>();
    @Output() onProfilePictureChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(private storageService: StorageService,
    ) {
    }

  loadUserDataFromStorage() {
      this.userData = null;
        const userData = this.storageService.retrieve("userData");
        if (userData) {
            this.userData = JSON.parse(userData);
        }
    }
}
