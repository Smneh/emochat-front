import {NewGroupModal} from '../new-group-modal/new-group-modal';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Component, Input, OnInit} from '@angular/core';
import {AppUsers} from 'src/app/modules/main-container/components/app-users/app-users.component';
import {SharedService} from '../../services/groups.service';
import {ChatRowRecord} from "../../models/conversation-record";
import {StorageService} from '../../../../shared/services/storage.service';

@Component({
  selector: 'new-group-button',
  templateUrl: './new-group-button.component.html',
  styleUrls: ['./new-group-button.component.scss']
})
export class NewGroupButton implements OnInit {
  numberOfImages = 20;
  @Input() selectedTab:string;
  modalRef: NgbModalRef

  constructor(
    private modalService: NgbModal,
    public sharedService: SharedService,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
  }

  createChat() {
    this.modalRef = this.modalService.open(AppUsers, { size: 'md', centered: true, animation: false, windowClass:'custom-height' })
    this.modalRef.componentInstance.title = 'Start a new Chat';
    this.modalRef.componentInstance.selectUser.subscribe((selectedUser) => {
      let chatRowRecord : ChatRowRecord ={
        title: selectedUser.fullname,
        firstUser: this.storageService.retrieve("userData").username,
        secondUser: selectedUser.username,
        username: this.storageService.retrieve("userData").username,
        fullname: selectedUser.fullname,
        profilePictureId: selectedUser.profilePictureId,
        groupId: '-',
        type: 'User',
        regDateTime: '',
        content: '',
        isDeletedChat: false,
        isSeen: false,
        attachments: '-',
        regUser: this.storageService.retrieve("userData").username,
        unReadMessages: '',
        lastMessageId: 0,
        owner: this.storageService.retrieve("userData").username,
        timestamp: '',
        firstMessageId: '0',
        receiverId: selectedUser.username,
        typeTitle: 'User',
        unreadCount: 0,
        contentId: 0,
        id: 0,
      }
      this.sharedService.selectedChat = chatRowRecord;
      this.sharedService.setCurrentChatReceiver(selectedUser);
      this.sharedService.randomWallpaperIndex = Math.floor(Math.random() * this.numberOfImages) + 1;
      this.modalRef.close()
    })
  }

  createGroup() {
    this.modalRef = this.modalService.open(NewGroupModal, { size: 'md', centered: true })
  }
}
