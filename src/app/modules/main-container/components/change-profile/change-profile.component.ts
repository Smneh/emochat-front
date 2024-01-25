import {StorageService} from '../../../../shared/services/storage.service';
import {UserService} from 'src/app/shared/services/user.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserDetail} from '../../models/user-detail';
import {UserInfoApiService} from '../../services/user-info.api.service';
import {finalize, Subject, tap} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ConfigsService} from "../../../../shared/services/configs.service";

@Component({
  selector: 'change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.scss']
})
export class ChangeProfile implements OnInit {

  isUpdatingProfile: boolean = false;
  @ViewChild('newName') newNameInput: ElementRef;
  userProfilePictureId: any;
  updatedFullname: string;
  temporaryFullname = '';
  canEditProfile: boolean = true;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private activeModal: NgbActiveModal,
    public userService: UserService,
    private dataService: UserInfoApiService,
    private storageService: StorageService,
    public configurationService: ConfigsService,
  ) {
    this.temporaryFullname = this.userService.userData.fullname || this.userService.userData.fullName;
    this.userProfilePictureId = this.userService.userData.profilePictureId;
    this.updatedFullname = this.userService.userData.fullname || this.userService.userData.fullName;
  }

  ngOnInit(): void {
  }

  updateProfileInfo() {
    if (this.isUpdatingProfile) {
      return;
    }

    if (this.updatedFullname === this.userService.userData.fullname) {
      this.closeModal();
      return;
    }

    this.isUpdatingProfile = true;
    let user: UserDetail = new UserDetail();
    user.fullName = this.updatedFullname;

    this.dataService.updateUserInfo(user).pipe(
      takeUntil(this.destroy$),
      tap((res) => {
        this.userService.userData.fullname = this.updatedFullname;
        this.userService.userData.fullName = this.updatedFullname;
        this.updateStorageData();
        this.closeModal('success');
      }),
      finalize(() => {
        this.isUpdatingProfile = false;
      })
    ).subscribe();
  }

  closeModal(result?: string) {
    this.activeModal.close(result);
  }

  private updateStorageData() {
    this.storageService.store('userData', JSON.stringify(this.userService.userData));
    this.userService.loadUserDataFromStorage();
  }
}
