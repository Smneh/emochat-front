import {SnackbarMessageService} from '../../services/snackbar-message.service';
import {UploadService} from '../../services/upload.service';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'uploaded-files',
  templateUrl: './uploaded-files.component.html',
  styleUrls: ['./uploaded-files.component.scss']
})
export class UploadedFiles implements OnInit, OnDestroy {
  sendtoUpload = new EventEmitter();
  loading: boolean = false;
  @Input() multiple = true;
  @Input() accept = "*";
  @Input() compression: boolean = true;
  @Output() onUploaded = new EventEmitter<any>();
  @Output() onFileSelected = new EventEmitter<File[]>()
  @Output() uploadProgress = new EventEmitter<number>();

  @Input() set allowUpload(val) {
    if (val) {
      this.sendToUploaderService(this.files);
    }
  }
  @Input() fromProfilePicture: boolean = false
  resized: File[] = [];
  images: File[] = [];
  files: File[] = [];
  fileToUpload: File[] = [];
  uniqeId = 0;
  progress: number = 0;
  dropSubscription: Subscription;

  constructor(
    private uploaderService: UploadService,
    private SnackbarMessageService: SnackbarMessageService,
    private router: Router
  ) {
    this.uniqeId = this.getRandomInt(1, 1000);
    this.uploaderService.onDrop = new EventEmitter();
    this.dropSubscription = this.uploaderService.onDrop.subscribe((event: any) => {
      this.onFileChange(event, true);
    });
    this.uploaderService.onPaste = new EventEmitter();
    this.uploaderService.onPaste.subscribe(res => {
      this.onFileChange(res)
    })
    this.sendtoUpload.subscribe(res => {
      if (res) {
        this.sendToUploaderService(this.files)
      }
    });
    this.uploaderService.onUploadProgress.subscribe((progress: number) => {
      this.progress = progress;
      this.uploadProgress.emit(progress)
      if (progress == 100) {
        setTimeout(() => {
          this.progress = 0;
        }, 2000);
      }
    });
  }
  ngOnDestroy(): void {

    if (this.dropSubscription)
      this.dropSubscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  onFileChange(event, fileDropped: boolean = false) {
    if (this.loading)
      return;
    this.reset();
    var files: File[] = [];
    if (fileDropped)
      files = Array.from(event)
    else
      files = Array.from(event.target.files);
    if (files.length > 0) {
      if (!this.uploaderService.checkAllowableLimitSize(this.files, this.resized)) {
        return;
      }
      this.files.push(...files)
      if (fileDropped) {
      }
      this.onFileSelected.emit(this.files)
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  onClick() {
    document.getElementById("hidden-upload-input" + this.uniqeId).click();
  }

  sendToUploaderService(files) {
    if (!files || files.length == 0)
      return;
    this.loading = true;
    this.fileToUpload = files;
    this.uploadFile(this.fileToUpload);
  }

  uploadFile(files) {
    this.uploaderService.upload(files).subscribe(result => {
      if (result) {
        if (result.status == 'Done') {
          this.onUploaded.emit(result);
          if (!this.fromProfilePicture) {
            this.SnackbarMessageService.success('file uploaded successfully')
          }
          this.files = [];
          this.loading = false;
        }
      }

    });
  }

  reset() {
    this.resized = [];
    this.images = [];
    this.files = [];
  }
}
