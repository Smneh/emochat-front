import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Component, Input, OnInit} from '@angular/core';
import {OnlineUsersService} from "../../../../shared/services/online-users.service";
import {UserInfo} from "../../models/user-info";
import {UsersRepositoryService} from "../../services/repositories/users-repository.service";

@Component({
  selector: 'user-info-modal',
  templateUrl: './user-info-modal.html',
  styleUrls: ['./user-info-modal.scss']
})
export class UserInfoModal implements OnInit {
  user:UserInfo;
  constructor(
    private activeModalService: NgbActiveModal,
    public onlineUsersService: OnlineUsersService,
    private userRepositoryService: UsersRepositoryService,
  ) { }

  modalRef: NgbModalRef;
  isLoading: boolean = false;
  @Input() username: string;

  ngOnInit(): void {
    this.userRepositoryService.getUserInfo(this.username).subscribe(res => {
      this.user = res;
    })
  }

  closeModal() {
    this.activeModalService.close();
    this.user = null;
  }

  getWidth(profilePictureId){
    if(profilePictureId && profilePictureId !='' && profilePictureId !='-')
      return '120px';
    else return '80px'
  }
}
