import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserService} from "../../../../shared/services/user.service";

@Component({
  selector: 'container',
  templateUrl: './container.html',
  styleUrls: ['./container.scss', './responsive.scss'],
})
export class Container implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  subscription: Subscription;
  constructor(
    public userService: UserService
  ) {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
  }
}
