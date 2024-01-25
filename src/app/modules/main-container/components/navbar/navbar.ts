import {ChangePassword} from '../change-password/change-password';
import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {ConfigsService} from 'src/app/shared/services/configs.service';
import {SecurityService} from 'src/app/shared/services/security.service';
import {SignalrService} from 'src/app/shared/services/signalr.service';
import {UserService} from 'src/app/shared/services/user.service';
import {ChangeProfile} from "../change-profile/change-profile.component";
import {Subscription} from "rxjs";
import {SnackbarMessageService} from "../../../../shared/services/snackbar-message.service";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss', './responsive.scss']
})
export class Navbar implements OnInit {
  window = window;
  modalRef: NgbModalRef;
  toastSubscription: Subscription;

  constructor(private securityService: SecurityService,
              public configurationService: ConfigsService,
              public translate: TranslateService,
              public userService: UserService,
              public signalrService: SignalrService,
              public modalService: NgbModal,
              private SnackbarMessageService: SnackbarMessageService,
  ) {
    this.toastSubscription = this.SnackbarMessageService.onConfirmResult.subscribe(confirmResult => {
      if (confirmResult) {
        this.logout();
      }
    });
  }

  ngOnInit(): void {}

  logoutConfirm() {
    this.SnackbarMessageService.onConfirm.emit('Are you sure?');
  }

  logout() {
    this.securityService.logout();
    this.signalrService.disconnect();
    this.userService.onSuccessfulLogout.emit(true);
  }

  changePassword() {
    this.modalRef = this.modalService.open(ChangePassword, { centered: true, size: 'md' })
  }

  changeProfile(){
    this.modalRef = this.modalService.open(ChangeProfile, { centered: true, size: 'md' })
  }
}
