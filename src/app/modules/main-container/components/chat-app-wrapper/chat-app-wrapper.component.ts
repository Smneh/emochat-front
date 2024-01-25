import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigsService} from 'src/app/shared/services/configs.service';
import {SignalrService} from 'src/app/shared/services/signalr.service';
import {UserService} from "../../../../shared/services/user.service";

@Component({
  selector: 'chat-app-wrapper',
  templateUrl: './chat-app-wrapper.component.html',
  styleUrls: ['./chat-app-wrapper.component.scss', './responsive.scss'],
})
export class ChatAppWrapper implements OnInit, OnDestroy {
  window = window;
  marginTop: number = 0;
  modalRef: NgbModalRef;
  subscription: any;

  constructor(
    private signalrService: SignalrService,
    public configurationService: ConfigsService,
    private userService:UserService
  ) {
  };

  async ngOnDestroy(): Promise<void> {
    await this.signalrService.disconnect();
  }

  async ngOnInit(): Promise<void> {
    await this.checkPushEngine();
    this.userService.loadUserDataFromStorage()
  }

  async checkPushEngine(): Promise<void> {
    await this.signalrService.createConnectionBeta();
    await this.signalrService.startConnectionBeta();
  }
}
