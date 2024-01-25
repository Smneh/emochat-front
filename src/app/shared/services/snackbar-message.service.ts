import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarMessageService {

  constructor() {
  }
  onToast: EventEmitter<any> = new EventEmitter();
  onConfirm: EventEmitter<any> = new EventEmitter();
  onClose: EventEmitter<any> = new  EventEmitter();
  onConfirmResult: EventEmitter<boolean> = new EventEmitter<boolean>();

  public info(message: string) {
    this.onToast.emit({ text: message, type: "info" });
  }

  public success(message: string, time?: number, showOkBtn?: boolean) {
    this.onToast.emit({ text: message, type: "success", time: time, showOkBtn: showOkBtn });
  }

  public warning(message: string) {
    this.onToast.emit({ text: message, type: "warning" });
  }

  public error(message: string) {
    this.onToast.emit({ text: message, type: "error" });
  }

  show(message, time?) {
    this.onToast.emit({ text: message, time: time, showOkBtn: false });
  }

  chat(fullName:string, username:string, content:string, image , func) {
    this.onToast.emit({ text: content, fullname: fullName, username:username, showOkBtn: false, image: image, type: "chat", click : func });
  }
}
