import {UserService} from '../../services/user.service';
import {UploadVisualizer} from '../upload-visualizer/upload-visualizer.component';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ImageService} from '../../services/image.service';
import {SnackbarMessageService} from '../../services/snackbar-message.service';
import {UploadService} from '../../services/upload.service';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PhotosView} from '../photos-view/photos-view.component';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'new-picture',
  templateUrl: './new-picture.component.html',
  styleUrls: ['./new-picture.component.scss']
})
export class NewPicture implements OnInit {


  loading: boolean = false;
  @Input() accept = "image/*";
  @Input() showProfileImage: boolean = true;
  @Input() currentProfile: string = '-'
  @Input() username: string
  @Input() fromGroup: boolean = false;
  @Output() onUploaded = new EventEmitter<string | any>();
  @Output() onFileSelected = new EventEmitter<File>()
  @Output() uploadProgress = new EventEmitter<number>();

  resized: File[] = [];
  images: File[] = [];
  file: File = <File>{}
  files: File[] = [];
  uniqeId = 0;
  progress: number = 0;
  modalRef: NgbModalRef

  constructor(
    private uploaderService: UploadService,
    private SnackbarMessageService: SnackbarMessageService,
    private imageService: ImageService,
    private modalService: NgbModal,
    public userService: UserService
  ) {
    this.uniqeId = this.getRandomInt(1, 1000);
  }

  ngOnInit(): void {
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  onClick() {
    if (this.username == this.userService.userData.username) {
      document.getElementById("hidden-upload-input" + this.uniqeId).click();
    } else {
      this.openImageModal();
    }
  }

  openImageModal() {
    if (this.currentProfile == '-')
      return
    let attachmentAddress: string = '';
    if (this.currentProfile.includes('.')) {
      attachmentAddress = environment.Web_Api_Url + environment.Download_Path + "?id=" + this.currentProfile.split('.')[0];
    }
    else {
      attachmentAddress = environment.Web_Api_Url + environment.Web_Api_Url + "?id=" + this.currentProfile;
    }
    this.modalRef = this.modalService.open(PhotosView, { size: 'xl', centered: true, animation: false })
    this.modalRef.componentInstance.attachmentAddress = attachmentAddress
  }

  onFileChange(event) {
    if (this.loading)
      return;

    this.reset();
    var files: File[] = [];

    files = Array.from(event.target.files);

    if (files.length > 0) {
      this.imageService.resizeImages(files).then((resizedImages: File[]) => {
        if (resizedImages.length > 0) {
          this.resized = resizedImages;

          if (!this.uploaderService.checkAllowableLimitSize(files, this.resized)) {
            return;
          }

          this.files.push(...this.resized)
          this.file = this.resized[0];
          this.onFileSelected.emit(this.file)
          this.uploadPreview(event);
        }
      })
    }
  }

  urltoFile(url, filename) {
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], filename); })

    );
  }

  uploadPreview(event) {
    this.modalRef = this.modalService.open(UploadVisualizer, { size: 'md', centered: true, keyboard: false, backdrop: 'static' });
    this.modalRef.componentInstance.file = event;
    this.modalRef.componentInstance.uploadFile.subscribe(ev => {
      this.FileConvert(ev);
    })
  }

  FileConvert(url: any) {
    let files: File[] = [];
    this.urltoFile(url.croppedImage, url.fileName)
      .then((file) => {
        files.push(file)
        this.sendToUploaderService(files)
      });

  }

  sendToUploaderService(files) {
    if (!files)
      return;
    this.loading = true;
    this.uploaderService.upload(files).subscribe(result => {
      if (result) {
        if (result.status == 'Done') {
          let format = result.attachments.split('.')[1];
          setTimeout(() => {
            this.currentProfile = `${result.attachments}.${format}`;
          }, 1000);

          if (this.fromGroup) {
            this.onUploaded.emit({ attachments: result.attachments});
          }
          else {
            this.onUploaded.emit(result);
          }

          this.files = []
          this.loading = false;
        }
      }

    });
  }

  reset() {
    this.resized = [];
    this.images = [];
    this.file = <File>{};
    this.uploaderService.uploadFiles = [];
  }
}
