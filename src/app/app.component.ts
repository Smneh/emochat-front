import {Component, OnDestroy, OnInit} from '@angular/core';
import {SignalrService} from './shared/services/signalr.service';
import {ConfigsService} from "./shared/services/configs.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private signalrService: SignalrService,
    private configurationService: ConfigsService,
  ) {
  }

  async ngOnDestroy(): Promise<void> {
    await this.signalrService.disconnect();
  }

  async ngOnInit(): Promise<void> {
    this.configurationService.load();
    window.addEventListener("beforeunload", async (e) => {
      await this.signalrService.disconnect();
    });
  }
}
