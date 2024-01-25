import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {UploadService} from '../../services/upload.service';

@Component({
  selector: 'upload-visualizer',
  templateUrl: './upload-visualizer.component.html',
  styleUrls: ['./upload-visualizer.component.scss']
})
export class UploadVisualizer implements OnInit {
  @Input() file
  croppedImage: any = '';
  @Output() AllowUpload = new EventEmitter()
  @Output() uploadFile = new EventEmitter<any>()
  _file
  constructor(
    private uploadService: UploadService,
    private activeModalService: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.setFilesToView();
  }

  Upload() {
    let file : any = Array.from(this.file.target.files);
    this.uploadFile.emit({croppedImage: this.croppedImage, fileName: file[0].name})
    this.close('success');
  }

  close(status?:string) {
    this.activeModalService.close(status);
  }

  setFilesToView() {
    let reader = new FileReader();
    reader.onloadend = () => {
      let itemSize = (this.file.size / 1024 / 1024).toFixed(2);
      let itemFormat = this.file.type.split('/')[0]

      let file = {
        name: this.file.name,
        data: reader.result,
        type: this.file.type,
        format: itemFormat,
        size: itemSize
      }
      this._file = file
    }
    reader.readAsDataURL(this.file);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl;
  }
}
