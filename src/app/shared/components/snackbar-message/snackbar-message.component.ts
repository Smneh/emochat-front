import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SnackbarMessageService} from '../../services/snackbar-message.service';

declare var gsap: any;

@Component({
  selector: 'snackbar-message',
  templateUrl: './snackbar-message.component.html',
  styleUrls: ['./snackbar-message.component.scss', './responsive.scss']
})
export class SnackbarMessage implements OnInit, OnDestroy {
  constructor(public SnackbarMessageService: SnackbarMessageService) {
  }

  ngOnDestroy(): void {
    if (this.toastSubscription)
      this.toastSubscription.forEach(element => {
        element.unsubscribe;
      });

    if (this.confirmSubscription)
      this.confirmSubscription.unsubscribe();

  }

  showToast = false;
  ToastMessage = false;
  ToastType: string = "info";
  showConfirm = false;
  showOkBtn = true;
  id = 0;
  toasts: any[] = [];
  confirmSubscription: Subscription;
  toastSubscription: Subscription[] = [];
  image = null;
  fullname = null;
  onClick = null;
  username: string;

  ngOnInit(): void {
    this.confirmSubscription = this.SnackbarMessageService.onConfirm.subscribe(res => {
      this.ToastMessage = res;
      this.showToast = true;
      this.showConfirm = true;
      this.ToastType = "info";
    })

    this.toastSubscription.push(this.SnackbarMessageService.onToast.subscribe(res => {
        let toast = {
          show: true,
          message: res.text,
          type: res.type
        }
        if (res["image"]) {
          this.image = res.image;
        } else {
          this.image = '';
        }
        if (res["username"]) {
          this.username = res.username;
        }
        if (res["fullname"]) {
          this.fullname = res.fullname;
        } else {
          this.fullname = null;
        }
        if (res.click) {
          this.onClick = res.click;
        } else {
          this.onClick = null;
        }
        this.toasts.push(toast);
        this.showToast = true;
        this.ToastMessage = res.text;
        this.ToastType = res.type;
        if (res.showOkBtn != undefined)
          this.showOkBtn = res.showOkBtn;
        let timeSecond = 5000;
        if (res.time) {
          timeSecond = res.time
        }
        setTimeout(() => {
          this.showToast = false;
          this.ToastType = "info";
          this.image = null;
          this.fullname = null;
          this.toastSubscription.forEach(element => {
            element.unsubscribe;
          });
          this.toasts.pop();
        }, timeSecond);
      })
    )

    this.toastSubscription.push(this.SnackbarMessageService.onClose.subscribe((res) => {
      this.closeOnLeave();
    }))
  }

  emitConfirmResult(status) {
    this.SnackbarMessageService.onConfirmResult.emit(status);
    this.showConfirm = false;
    this.showToast = false;
    this.image = null;
    this.fullname = null;
  }

  closeOnLeave() {
    this.showConfirm = false;
    this.showToast = false;
  }

  toastClick() {
    if (this.onClick) {
      this.onClick();
    }

  }
}
