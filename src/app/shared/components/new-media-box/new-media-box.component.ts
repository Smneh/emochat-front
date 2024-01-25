import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'new-media-box',
  templateUrl: './new-media-box.component.html',
  styleUrls: ['./new-media-box.component.scss']
})
export class NewMediaBox {
  loading: boolean = false;
  allowUpload = false;
  previewFiles: File[] = [];
  compression: boolean = true;
  @Output() onUploaded = new EventEmitter<string>();
  @Input() multiple: boolean = true;
  @Input() accept: string = '*';
  @Input() compressBox: boolean = true;
  @Input() fromProfilePicture: boolean = false
  constructor(
    private activemodalService: NgbActiveModal,
  ) {
  }

  sendToView(ev) {
    this.allowUpload = false;
    this.previewFiles = ev;
  }

  uploaded(event) {
    this.onUploaded.emit(event)
    this.close();
  }

  upload() {
    this.allowUpload = true;
  }

  clearList() {
    this.previewFiles = [];
  }

  close() {
    this.activemodalService.close();
  }
}
