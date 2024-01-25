import {Group} from '../../models/group';
import {UserService} from '../../../../shared/services/user.service';
import {ConversationService} from '../../services/conversation.service';
import {SnackbarMessageService} from '../../../../shared/services/snackbar-message.service';
import {SecurityService} from '../../../../shared/services/security.service';
import {GroupsDataRepositoryService} from '../../services/repositories/groups-data-repository.service';
import {Participants} from '../../models/participants';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {SharedService} from '../../services/groups.service';

@Component({
  selector: 'conversation-info-modal',
  templateUrl: './conversation-info-modal.component.html',
  styleUrls: ['./conversation-info-modal.component.scss']
})
export class ConversationInfoModal implements OnInit {
  toastSubscription: Subscription;
  constructor(
    private activeModalService: NgbActiveModal,
    private groupRepositoryService: GroupsDataRepositoryService,
    public securityService: SecurityService,
    private SnackbarMessageService: SnackbarMessageService,
    private chatListService: ConversationService,
    private userService: UserService,
    private sharedService: SharedService,
  ) {

    this.toastSubscription = this.SnackbarMessageService.onConfirmResult.subscribe(confirmResult => {
      if (confirmResult) {
        if (this.hasLeftGroup && !this.hasDeletedGroup) {
          this.leaveGroupAction();
        } else if (!this.hasLeftGroup && this.hasDeletedGroup) {
          this.deleteGroupAction();
        }
      }
    });
  }

  modalRef: NgbModalRef;
  hasLeftGroup: boolean = false;
  hasDeletedGroup: boolean = false;
  isLoading: boolean = false;
  @Input() groupType: string;
  @Input() set groupReceiverId(receiverId: string) {
    this.isLoading = true;
    if (this.groupType === 'Group') {
      this.fetchGroupInfo(receiverId);
    }
  }
  @Input() isEditable: boolean = false;
  @Output() editGroupInfo = new EventEmitter<{
    title: string;
    profilePictureId: string;
  }>();
  groupInfo: Group = new Group();

  ngOnInit(): void {
  }

  closeModal() {
    this.activeModalService.close();
  }

  fetchGroupInfo(receiverId: string) {
    this.groupRepositoryService.getGroupById(receiverId).subscribe(group => {
      this.groupInfo = group;
      this.groupInfo.isCreator = this.userService.userData.username === this.groupInfo.creator;
      this.groupInfo.isAdmin = this.groupInfo.admins.some(admin => admin === this.userService.userData.username);
      this.groupInfo.isPrivate = this.groupInfo.typeId === 2;
      this.isLoading = false;
    });
  }

  updateGroupInfo() {
    let receiver: Participants = new Participants();
    receiver.groupId = this.groupInfo.groupId;
    receiver.title = this.groupInfo.title;
    receiver.description = this.groupInfo.description;
    receiver.profilePictureId = this.groupInfo.profilePictureId;

    this.groupRepositoryService.edit(receiver).subscribe(() => {
      this.editGroupInfo.emit({
        title: this.groupInfo.title,
        profilePictureId: this.groupInfo.profilePictureId
      });
      this.SnackbarMessageService.success('Group info updated successfully');
      this.isEditable = false;
      this.sharedService.selectedChat.title = this.groupInfo.title;
      this.sharedService.selectedChat.profilePictureId = this.groupInfo.profilePictureId;
    });
  }

  toggleEditMode() {
    this.isEditable = !this.isEditable;
  }

  leaveGroupConfirm() {
    this.SnackbarMessageService.onConfirm.emit('Are you sure?');
    this.hasLeftGroup = true;
  }

  leaveGroupAction() {
    this.groupRepositoryService.deleteMember(this.userService.userData.username, this.groupInfo.groupId).subscribe(() => {
      const index = this.chatListService.chatFeeds.findIndex(chat => chat.receiverId === this.groupInfo.groupId);
      this.chatListService.chatFeeds.splice(index, 1);
      this.hasLeftGroup = false;
      this.closeModal();
      this.SnackbarMessageService.success('You left the group successfully');
    });
  }

  deleteGroupConfirm() {
    this.SnackbarMessageService.onConfirm.emit('Are you sure?');
    this.hasDeletedGroup = true;
  }

  deleteGroupAction() {
    this.groupRepositoryService.delete(this.groupInfo.groupId).subscribe(() => {
      const index = this.chatListService.chatFeeds.findIndex(chat => chat.receiverId === this.groupInfo.groupId);
      this.chatListService.chatFeeds.splice(index, 1);
      this.closeModal();
      this.hasDeletedGroup = false;
      this.SnackbarMessageService.success('Group deleted successfully');
    });
  }

  handleProfileImageChange(event) {
    this.groupInfo.profilePictureId = event.attachments;
  }
}
