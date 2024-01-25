import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../services/groups.service';

@Component({
  selector: 'select-forward-recipient-modal',
  templateUrl: './select-forward-recipient-modal.component.html',
  styleUrls: ['./select-forward-recipient-modal.component.scss']
})
export class SelectForwardRecipientModal implements OnInit {

  constructor(
    private activeModalService: NgbActiveModal,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
  }



  forwardMessageUsers: string[] = [];

  forwardUserList(selectedUser) {


    let index = this.forwardMessageUsers.findIndex(x => x == selectedUser.username);
    if (index > -1) {
      this.forwardMessageUsers.splice(index, 1);
    } else {
      this.forwardMessageUsers.push(selectedUser.username);
    }

  }


  forwardMessage() {
    if (this.forwardMessageUsers.length == 0)
      return

    this.sharedService.forwardMessages(this.forwardMessageUsers, 'SingleMessage');
  }


  close() {
    this.activeModalService.close();
  }
}
