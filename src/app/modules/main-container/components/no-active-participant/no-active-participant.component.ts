import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../services/groups.service';
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'no-active-participant',
  templateUrl: './no-active-participant.component.html',
  styleUrls: ['./no-active-participant.component.scss'],
})
export class NoActiveParticipant implements OnInit {

  constructor(public sharedService: SharedService,
  ) {
  }

  ngOnInit(): void {
    this.sharedService.groupInfo.receiverId = '';
  }

  options: AnimationOptions = {
    path: '/assets/animations/ai.json',
    loop: true,
    autoplay: true,
  };
}
