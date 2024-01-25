import {EventEmitter, Injectable} from '@angular/core';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import {environment} from 'src/environments/environment';
import {ConfigsService} from './configs.service';
import {SecurityService} from './security.service';

declare var $: any;

@Injectable({ providedIn: 'root' })
export class SignalrService {
  private hubConnection: HubConnection;
  public onSignalrConnected = new EventEmitter();
  private connection: any;
  private proxy: any;
  private hubConnectionBeta: HubConnection;
  public onSignalrConnectedBeta = new EventEmitter();

  constructor(
    private securityService: SecurityService,
    private configurationService: ConfigsService,
  ) { }

  on(messageTitle: string, callback: (...args: any[]) => void) {
    if (this.hubConnection) this.hubConnection.on(messageTitle, callback);
  }

  onBeta(messageTitle: string, callback: (...args: any[]) => void) {
    if (this.hubConnectionBeta) this.hubConnectionBeta.on(messageTitle, callback);
  }

  async createConnectionBeta(): Promise<void> {
    if (this.hubConnectionBeta != undefined) {
      await this.disconnect();
      this.hubConnectionBeta = undefined;
    }
    const token = this.securityService.GetToken() || '';
    let hubUrl =
      this.configurationService.settings.PEAddress +
      environment.SignalR2;
    if (token) {
      hubUrl += '/?access_token' + '=' + token;
    }
    this.hubConnectionBeta = new HubConnectionBuilder()
      .withUrl(
        hubUrl,
        HttpTransportType.WebSockets | HttpTransportType.LongPolling | HttpTransportType.ServerSentEvents
      )
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  async startConnectionBeta(): Promise<void> {
    if (this.hubConnectionBeta.state === HubConnectionState.Connected || this.hubConnectionBeta.state == HubConnectionState.Disconnecting) {
      return;
    }

    await this.hubConnectionBeta.start().then(
      () => {
        this.onSignalrConnectedBeta.emit();

        this.hubConnectionBeta.onclose((error) => {
          console.log('Connection closed due to error: ', error);
        });

      },
      (error) => console.error(error)
    );
  }

  async disconnect(): Promise<void> {
    if (this.hubConnectionBeta) {
      await this.hubConnectionBeta.stop();
    }
  }

  getConnetionState() {
    return this.hubConnectionBeta.state
  }
}
