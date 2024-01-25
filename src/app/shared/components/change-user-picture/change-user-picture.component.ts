import {Component, Input, OnInit} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../services/user.service";
import {PictureUploadContainer} from "../picture-upload-container/picture-upload-container.component";

@Component({
  selector: 'app-change-user-picture',
  templateUrl: './change-user-picture.component.html',
  styleUrls: ['./change-user-picture.component.scss']
})
export class ChangeUserPicture implements OnInit {

  @Input() currentProfile: string = '-'
  @Input() username: string;
  @Input() showProfileImage: boolean = true;
  modalRef: NgbModalRef;
  canEdit: boolean = false;
  croppedImage: any = '';
  showCropper = false;
  imageChangedEvent: any = '';
  isImageFile: boolean = true;
  tempFileName: string;
  constructor(
    private modalService: NgbModal,
    public userService: UserService,
  ) {
  }

  ngOnInit() {
    if (this.username && this.username ==this.userService.userData.username) {
      this.canEdit = true;
    }
  }

  showUploadProfileBox(event) {
    event.stopPropagation();
    this.modalRef = this.modalService.open(PictureUploadContainer, {size: 'md', centered: true});
    this.modalRef.componentInstance.imageChangedEvent = event;
    this.modalRef.result.then(res => {
      if (res && res == 'success') {
        this.showProfileImage = false;
        this.userService.onProfilePictureChange.emit('success');
        setTimeout(() => {
          this.showProfileImage = true;
        }, 1000);
      }
    })
  }

  onFileSelected(event: any) {
    if (!event.target.files || event.target.files.length == 0) {
      return;
    } else {
      this.imageChangedEvent = event;
      const file: File = event.target.files[0];

      let lastIndex = file.name.lastIndexOf('.');
      this.tempFileName = file.name.substring(0, lastIndex);

      if (this.isImage(file.type)) {
        this.showCropper = true;
        this.isImageFile = true;
      } else {
        this.isImageFile = false;
      }
      this.showUploadProfileBox(event)
    }
  }

  isImage(type: string): boolean {
    return type.startsWith('image');
  }
}
