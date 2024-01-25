import {Component} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AppUsers} from 'src/app/modules/main-container/components/app-users/app-users.component';
import {SharedService} from '../../services/groups.service';

@Component({
  selector: 'forward-element',
  templateUrl: './forward-element.component.html',
  styleUrls: ['./forward-element.component.scss'],
})
export class ForwardElement {
  modalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    public sharedService: SharedService
  ) { }

  forward() {
    this.modalRef = this.modalService.open(AppUsers, {
      size: 'md',
      centered: true,
      animation: false,
      windowClass:'custom-height'
    });
    this.modalRef.componentInstance.title = 'Select user';
    this.modalRef.componentInstance.selectUser.subscribe((selectedUser) => {
      let users: string[] = [selectedUser.username];
      this.sharedService.forwardMessages(users);
      this.modalRef.close();
    });
  }
}
