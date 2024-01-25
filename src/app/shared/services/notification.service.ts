import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {}

  show(body, title?, icon?, click?) {
    if (Notification.permission === "granted") {
      let notification = new Notification(title, {
        icon: icon,
        body: body
      });
      if (click)
        notification.onclick = click;
    }
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          let notification = new Notification(title, {
            icon: icon,
            body: body
          });
          if (click)
            notification.onclick = click;
        }
      });
    }
  }
}
