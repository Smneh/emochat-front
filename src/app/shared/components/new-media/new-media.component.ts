import {UploadService} from 'src/app/shared/services/upload.service';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'new-media',
  templateUrl: './new-media.component.html',
  styleUrls: ['./new-media.component.scss', './responsive.scss']
})

export class NewMedia implements OnInit, OnDestroy {

  _file = []
  _files: File[] = []
  @Input() mode: string = 'simple'
  @Input() chat: boolean = false;
  progress: number = 0;

  @Input() set files(value: File[]) {
    this._files = [];
    this._files = value;
    if (this._files.length > 0) {
      this.setFilesToView(this._files);
    }
  }

  @Output() EmptyFileList = new EventEmitter();
  @Output() deleteFile = new EventEmitter();

  constructor(
    public uploadService: UploadService,
  ) {
    this.uploadService.onUploadProgress.subscribe((progress: number) => {
      this.progress = progress;
    });
  }

  ngOnDestroy(): void {
    this.progress = 0
  }

  ngOnInit(): void {
  }

  extentions = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'audio/mpeg',
    'audio/ogg',
    'audio/x-realaudio',
    'video/3gpp',
    'video/3gpp',
    'video/mpeg',
    'video/mpeg',
    'video/quicktime',
    'video/x-flv',
    'video/x-mng',
    'video/x-ms-asf',
    'video/x-ms-asf',
    'video/x-ms-wmv',
    'video/x-msvideo',
    'video/mp4',
    'video/mp4',
  ]
  mimeTypes: { [key: string]: string } = {
    'gif': 'image/gif',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'tif': 'image/tiff',
    'tiff': 'image/tiff',
    'bmp': 'image/x-ms-bmp',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'zip': 'application/zip',
    'rar': 'application/rar',
    'mp3': 'audio/mpeg',
    'ogg': 'audio/ogg',
    'ra': 'audio/x-realaudio',
    '3gpp': 'video/3gpp',
    '3gp': 'video/3gpp',
    'mpeg': 'video/mpeg',
    'mpg': 'video/mpeg',
    'mov': 'video/quicktime',
    'flv': 'video/x-flv',
    'mng': 'video/x-mng',
    'asx': 'video/x-ms-asf',
    'asf': 'video/x-ms-asf',
    'wmv': 'video/x-ms-wmv',
    'avi': 'video/x-msvideo',
    'm4v': 'video/mp4',
    'mp4': 'video/mp4',
  };

  setFilesToView(res) {
    this._file = [];
    for (let item of res) {
      let reader = new FileReader();
      reader.onloadend = () => {
        let itemSize = (item.size / 1024 / 1024).toFixed(2);
        let itemFormat = item.type.split('/')[0]
        if (this.extentions.includes(item.type)) {
          let file = {
            name: item.name,
            data: reader.result,
            type: item.type,
            format: itemFormat,
            size: itemSize
          }
          this._file.push(file)
        }
        else {
          let file = {
            name: item.name,
            data: reader.result,
            type: item.type,
            format: 'other',
            size: itemSize
          }
          this._file.push(file)
        }
      }
      reader.readAsDataURL(item);
    }
  }

  delete(index: number, event) {
    event.stopPropagation();
    this._file.splice(index, 1);
    this.uploadService.uploadFiles.splice(index, 1);
    this.deleteFile.emit(index);
    if (this._file.length == 0)
      this.EmptyFileList.emit();
  }
}
