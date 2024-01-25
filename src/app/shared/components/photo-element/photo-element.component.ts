import {PhotosView} from '../photos-view/photos-view.component';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Component, Input} from '@angular/core';
import {environment} from 'src/environments/environment';
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'photo-element',
  templateUrl: './photo-element.component.html',
  styleUrls: ['./photo-element.component.scss']
})
export class PhotoElement {

  modalRef: NgbModalRef
  _attachmenAddress: string = "";
  previewAddress: string = "";
  imageLoaded = false;

  @Input() isForGroup: boolean = false;
  @Input() isThumbnail = false;
  @Input() isGuid = false;

  constructor(
    private modalService: NgbModal,
    private storageService: StorageService
  ) {
    setTimeout(() => {
      this.showPlaceholder = false;
    }, 2000);
  }

  @Input() showPlaceholder = false;
  @Input() set attachmentId(value: string) {
    if (value == "-" || value == undefined || value == "") {
      // this._attachmenAddress = 'assets/images/app-users/user-avatar.svg'
      this._attachmenAddress = null;
    } else {

        let params = value.split('.')[0] + '?token='+ this.storageService.retrieve('accessToken') + '&inLine=true';
        this._attachmenAddress = environment.Web_Api_Url + environment.Download_Path + params;
        this.previewAddress = environment.Web_Api_Url + environment.Download_Path + params;

    }
  }

  filePreview() {
    this.modalRef = this.modalService.open(PhotosView, { size: 'xl', centered: true, animation: false, windowClass: "image-modal" })
    this.modalRef.componentInstance.attachmentAddress = this.previewAddress
  }

  onloaded() {
    this.imageLoaded = true;
  }

}
