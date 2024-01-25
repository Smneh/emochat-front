import {Injectable} from '@angular/core';
import {SignalrService} from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrHubService {

  constructor(private signalrService: SignalrService,
  ) {
    this.signalrService.onSignalrConnected.subscribe(() => {});
    this.signalrService.onSignalrConnectedBeta.subscribe(() => {});
  }
}
