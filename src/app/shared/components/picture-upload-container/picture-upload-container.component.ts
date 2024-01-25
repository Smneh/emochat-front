import {Component, Input, ViewChild} from '@angular/core';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {DomSanitizer} from '@angular/platform-browser';
import {SnackbarMessageService} from "../../services/snackbar-message.service";
import {UploadService} from "../../services/upload.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../services/user.service";
import {StorageService} from "../../services/storage.service";
import {ProfilePictureService} from "../../services/profile-picture.service";

@Component({
  selector: 'picture-upload-container',
  templateUrl: './picture-upload-container.component.html',
  styleUrls: ['./picture-upload-container.component.scss']
})
export class PictureUploadContainer {

  // selectedFile: File | null = null;
  croppedImage: any = '';
  showCropper = false;
  @Input() imageChangedEvent: any;
  isImageFile: boolean = true;
  tempFileName: string;
  croppedBlob: Blob;


  @ViewChild('cropper', {static: false}) cropper: ImageCropperComponent;

  constructor(
    private _uploadService: UploadService,
    private _SnackbarMessageService: SnackbarMessageService,
    public userService: UserService,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    public activeModal: NgbActiveModal,
    private profilePictureService:ProfilePictureService
  ) {
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
    }
  }


  uploadFile() {
    if (this.croppedBlob) {
      const fileType = 'image/jpg';
      const fileName = this.tempFileName + '.jpg';
      const file = new File([this.croppedBlob], fileName, {type: fileType});
      const imageSize = file.size / 1024;
      this._uploadService.uploadUserProfilePicture(file).subscribe((res:any) => {
        if (res && res.body && res.body.result){
          this.userService.userData.profilePictureId = res.body.result;
          this.profilePictureService.updateProfilePictureId(res.body.result)
          this.updateStorageData();
          this.closeAndUpdateImage('success');
        }
      })
    }
  }

  private updateStorageData() {
    this.storageService.store('userData', JSON.stringify(this.userService.userData));
    this.userService.loadUserDataFromStorage();
  }

  closeAndUpdateImage(status:string){
    this.activeModal.close(status)
  }


  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl || event.base64 || '');
    this.croppedBlob = event.blob;
  }

  isImage(type: string): boolean {
    return type.startsWith('image');
  }

  close() {
    this.activeModal.close(status);
  }
}
