import {Component, Input, OnInit} from '@angular/core';
import {OnlineUsersService} from 'src/app/shared/services/online-users.service';
import {UserService} from 'src/app/shared/services/user.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SnackbarMessageService} from 'src/app/shared/services/snackbar-message.service';
import {SharedService} from "../../services/groups.service";
import {GroupParticipants} from "../../models/group-participants";
import {GroupsDataRepositoryService} from "../../services/repositories/groups-data-repository.service";
import {ConversationService} from "../../services/conversation.service";
import {AddNewMemberModal} from "../add-new-member-modal/add-new-member-modal";

@Component({
  selector: 'participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class Participants implements OnInit {

  constructor(
    public onlineUsersService: OnlineUsersService,
    public userService: UserService,
    private modalService: NgbModal,
    private _SnackbarMessageService: SnackbarMessageService,
    public sharedService: SharedService,
    public groupRepositoryService:GroupsDataRepositoryService,
    public chatListService:ConversationService
  ) { }

  @Input({ required: true }) set members(val: GroupParticipants[]) {
    if (val) {
      this.groupMembers = val;
    }
  }
  @Input() canModify: boolean = false;
  @Input({ required: true }) groupId:string;

  modalRef: NgbModalRef;
  groupMembers: GroupParticipants[] = [];

  ngOnInit(): void {
  }

  addMember() {
    if (!this.canModify)
      return; //TODO : show error
    this.modalRef = this.modalService.open(AddNewMemberModal, { size: 'sm', centered: true, animation: false })
    this.modalRef.componentInstance.groupId = this.sharedService.groupInfo.groupId
    this.modalRef.componentInstance.multipleSelect = true;
    this.modalRef.componentInstance.canModify = this.canModify;
    this.modalRef.componentInstance.membersChanged.subscribe((e) => {
     this.groupMembers.push(e.member)
    })
  }

  removeMember(username: string, event?: Event) {
    event.stopPropagation();
    if (!this.canModify) {
      this._SnackbarMessageService.error('You cant remove them')
      return;
    }
    this.groupRepositoryService.deleteMember(username,this.groupId).subscribe(() => {
      let index = this.groupMembers.findIndex(u => u.username == username);
      this.groupMembers.splice(
        index,
        1
      );
      this._SnackbarMessageService.success('Removed Successfully')
    })
  }

  addAdmin(username: string, event?: Event) {
    event.stopPropagation();
    if (!this.canModify) {
      this._SnackbarMessageService.error('You can\'t add them to admins')
      return;
    }
    this.groupRepositoryService.addAdmin(username,this.groupId).subscribe(() => {
      let index = this.groupMembers.findIndex(u => u.username == username);
      this.groupMembers[index].isAdmin = true;
    })
  }

  removeAdmin(username: string, event?: Event) {
    event.stopPropagation();
    if (!this.canModify) {
      this._SnackbarMessageService.error('You can\'t remove them from admins')
      return;
    }
    this.groupRepositoryService.removeAdmin(username,this.groupId).subscribe(() => {
      let index = this.groupMembers.findIndex(u => u.username == username);
      this.groupMembers[index].isAdmin = false;
    })
  }
}
