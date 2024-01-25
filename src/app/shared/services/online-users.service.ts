import {Injectable} from '@angular/core';
import {SignalrService} from './signalr.service';

export class UserStatus {
  username: string;
  status: string;
  lastActionTime: string;
}

@Injectable({
  providedIn: 'root',
})
export class OnlineUsersService {
  public users: UserStatus[] = [];
  constructor(
    private signalrService: SignalrService,
  ) {
    this.signalrService.onSignalrConnectedBeta.subscribe(() => {
      this.initializeMessages();
    });
  }

  initializeMessages() {
    this.signalrService.onBeta('UserStatus', (data) => {
      let usersNewData = JSON.parse(data);
      for (let i = 0; i < usersNewData.length; i++) {
        let newObject = usersNewData[i];
        let index = this.users.findIndex(obj => obj.username === newObject.username);
        if (index !== -1) {
          this.users[index] = newObject;
        } else {
          this.users.push(newObject);
        }
      }
    });
    this.signalrService.onBeta('UserOffline', (data) => {
      data = JSON.parse(data);
      let userIndex = this.users.findIndex(user => user.username === data.username);
      if (userIndex !== -1) {
        this.users[userIndex].status = 'offline';
      }
    });
  }

  checkOnlineStatus(username: string) {
    if (
      this.users.findIndex(
        (x) => x.status == 'online' && x.username == username
      ) > -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  signalRState() {
    return this.signalrService.getConnetionState().toString()
  }

  getLastActiveTime(username: string) {
    var userIndex = this.users.findIndex(x => x.username == username && x.status == 'offline')
    if (userIndex > -1
    ) {
      return this.users[userIndex].lastActionTime;
    }
    return ''
  }
}
