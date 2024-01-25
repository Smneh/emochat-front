import {ImageService} from '../../services/image.service';
import {UploadService} from '../../services/upload.service';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'file-upload-zone',
  templateUrl: './file-upload-zone.component.html',
  styleUrls: ['./file-upload-zone.component.scss']
})
export class FileUploadZone implements OnInit {
  loading = false;
  resized: File[] = [];
  images: File[] = [];
  files: File[] = [];
  uniqeId = 0;
  addItem: boolean = false;
  progress: number = 0;
  @Input() multiple = true;
  @Input() accept = "*";
  @Output() onUploaded = new EventEmitter<string>();
  @Output() onFileSelected = new EventEmitter<File[]>()
  @Output() uploadProgress = new EventEmitter<number>();

  constructor(
    private uploaderService: UploadService,
    private imageService: ImageService
  ) {
  }

  ngOnInit(): void {
  }

  onFileChange(event, fileDropped: boolean = false) {
    if (this.loading)
      return;
    this.reset();
    var files: File[] = [];
    if (fileDropped) {
      files = Array.from(event)
    } else {
      files = Array.from(event.target.files);
    }
    if (files.length > 0) {
      this.seprateSelectedFiles(files);

      if (this.images.length > 0) {
        this.imageService.resizeImages(this.images).then((resizedImages: File[]) => {
          if (resizedImages.length > 0) {
            this.resized = resizedImages;
            if (!this.uploaderService.checkAllowableLimitSize(this.files, this.resized)) {
              return;
            }
            if (this.addItem == true) {
              this.uploaderService.uploadFiles.push(...this.resized)
            }
            else {
              this.files.push(...this.resized);
              this.uploaderService.uploadFiles = this.files
            }
            this.onFileSelected.emit(this.uploaderService.uploadFiles)
          }

        })

      } else {

        if (!this.uploaderService.checkAllowableLimitSize(this.files, [])) {
          return;
        }
        if (this.addItem == true) {
          this.uploaderService.uploadFiles.push(this.files[0]);
        } else {
          this.uploaderService.uploadFiles = this.files
        }

        this.onFileSelected.emit(this.uploaderService.uploadFiles)

      }
    }
  }

  onClick() {
    this.reset()
    document.getElementById("hidden-upload-input" + this.uniqeId).click();
  }

  seprateSelectedFiles(files: File[]) {
    var imageTypes = ["image/gif", "image/jpeg", "image/png"];

    files.forEach(file => {
      if (imageTypes.findIndex(x => x == file.type) > -1)
        this.images.push(file);
      else
        this.files.push(file);
    });


  }

  reset() {
    this.resized = [];
    this.images = [];
    this.files = [];
    this.uploaderService.uploadFiles = []

  }

}
