import {ApiCallService} from '../../../shared/services/apiCall.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserDetail} from '../models/user-detail';
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserInfoApiService {

  constructor(
    private apiCallService: ApiCallService,
  ) { }

  updateUserInfo(userInfo: UserDetail): Observable<any> {
    const parameters: any = {
      fullname: userInfo.fullName
    }
    return this.apiCallService.put(environment.Users_Path+'Update', parameters)
  }

  updatePassword(username: string, password: string, newPassword: string, lastModifyDate: number): Observable<any> {
    const parameters: any = {
      password: password ,
      newPassword: newPassword ,
    }
    return this.apiCallService.put('UpdatePassword', parameters)
  }
}
