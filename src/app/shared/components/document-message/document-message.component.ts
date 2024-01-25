import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

interface documentFile {
  id: string,
  fileName: string,
  fileType: string
}

@Component({
  selector: 'document-message',
  templateUrl: './document-message.component.html',
  styleUrls: ['./document-message.component.scss']
})
export class DocumentMessage implements OnInit {
  constructor() {}

  modalRef: NgbModalRef
  files: any[] = [];
  @Output() onDeleteAttachment = new EventEmitter();
  @Input() allowDelete: boolean = false;
  @Input() showMode: string = 'default'
  @Input() creator: boolean = true;
  @Input() isReply: boolean = false;
  @Input() isGuid = false;
  @Input() set attachment(attachments) {

    this.files = [];
    if (attachments == '' || attachments == '-' || !attachments) {
      return;
    }
    let attachment = attachments.split(',');
    this.files = attachment;
  }

  ngOnInit(): void {
  }
}
