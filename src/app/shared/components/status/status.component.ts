import {Component, Input} from '@angular/core';
import {OnlineUsersService} from '../../services/online-users.service';

@Component({
  selector: 'status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class Status {
  _username = '';
  constructor(public onlineUsersService: OnlineUsersService) { }
  @Input() set username(value: string) {
    this._username = value;
  }
}
