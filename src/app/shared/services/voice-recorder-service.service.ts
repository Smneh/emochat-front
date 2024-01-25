import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import * as RecordRTC from "recordrtc";

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class VoiceRecorder {

  private sampleRate:number = 10000;
  private stream:any;
  private recorder:any;
  private interval:any;
  private startTime:any;
  private _recorded = new Subject<RecordedAudioOutput>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<void>();

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    // @ts-ignore
    return this._recordingFailed.asObservable();
  }

  startRecording() {
    if (this.recorder) {
      return;
    }
    this._recordingTime.next("00:00");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(s => {
        this.stream = s;
        this.record();
      })
      .catch(error => {
        this._recordingFailed.next();
      });
  }

  abortRecording() {
    this.stopMedia();
  }

  private record() {
    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: "audio",
      mimeType: "audio/webm",
      desiredSampRate: this.sampleRate,
      numberOfAudioChannels: 1
    });
    this.recorder.record();
    this.startTime = new Date();
    this.interval = setInterval(() => {
      const currentTime = new Date();
      const diffTime = Math.floor((currentTime.getTime() - this.startTime.getTime()) / 1000); // Calculate time difference in seconds
      const minutes = Math.floor(diffTime / 60);
      const seconds = diffTime % 60;
      const time = this.toString(minutes) + ":" + this.toString(seconds);
      this._recordingTime.next(time);
    }, 1000);
  }

  // Helper function to pad single-digit numbers with a leading zero
  private toString(value: number): string {
    return value < 10 ? "0" + value : value.toString();
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stop(
        blob => {
          if (this.startTime) {
            const mp3Name = encodeURIComponent(
              "audio_" + new Date().getTime() + ".mp3"
            );
            this.stopMedia();
            this._recorded.next({ blob: blob, title: mp3Name });
          }
        },
        () => {
          this.stopMedia();
          this._recordingFailed.next();
        }
      );
    }
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }
}
