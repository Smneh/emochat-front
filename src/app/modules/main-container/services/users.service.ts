import {Injectable} from '@angular/core';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: User[] = [];
  members: User[] = [];
  constructor() { }
}
