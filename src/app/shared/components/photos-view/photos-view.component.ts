import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'photos-view',
  templateUrl: './photos-view.component.html',
  styleUrls: ['./photos-view.component.scss', './responsive.scss'],
})
export class PhotosView {
  @Input() attachmentAddress;

  constructor(private activeModalService: NgbActiveModal) {
  }

  close() {
    this.activeModalService.close();
  }
}
