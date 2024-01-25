import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from 'src/environments/environment';
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'voice',
  templateUrl: './voice-element.component.html',
  styleUrls: ['./voice-element.component.scss']
})
export class VoiceElement implements OnInit, AfterViewInit {
  @ViewChild('audioElement') audioElement: ElementRef;
  length:string = '00:00';
  volumePercentage:string;
  muted:boolean = false;
  isPlaying:boolean = false;
  progressValue:string;
  currentValue:string='00:00';
  playBtn :Element;
  audio :HTMLAudioElement;
  @Input() attachmentId
  audioSrc = null
  constructor(private domSanitizer: DomSanitizer,
              private storageService: StorageService) { }

  ngOnInit(){
    let params = this.attachmentId.split('.')[0] + '?token='+ this.storageService.retrieve('accessToken') + '&inLine=true';
    this.audioSrc = this.domSanitizer.bypassSecurityTrustUrl(environment.Web_Api_Url + environment.Download_Path + params);
  }

  ngAfterViewInit() {
    this.audio = this.audioElement.nativeElement;
    setInterval(() => {
      this.progressValue = this.audio.currentTime / this.audio.duration * 100 + "%";
      this.currentValue = this.getTimeCodeFromNum(this.audio.currentTime);
    }, 500);
  }

  getTimeCodeFromNum(num: number): string {
    let seconds = parseInt(String(num));
    let minutes = parseInt(String(seconds / 60)); // Convert to string here
    seconds -= minutes * 60;
    const hours = parseInt(String(minutes / 60)); // Convert to string here
    minutes -= hours * 60;
    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
    return `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  play(){
    this.audio = this.audioElement.nativeElement;
    this.length = this.getTimeCodeFromNum(this.audio.duration);
    if (this.audio.paused) {
      this.isPlaying = true;
      this.audio.play();
    } else {
      this.isPlaying = false;
      this.audio.pause();
    }
  }

  voiceDataLoaded(){
    this.length = this.getTimeCodeFromNum(this.audio.duration);
    this.audio.volume = .75;
  }

  timeLineClicked(event){
    const timelineWidth = window.getComputedStyle(event.target).width;
    const timeToSeek = (event as MouseEvent).offsetX / parseInt(timelineWidth) * this.audio.duration;
    this.audio.currentTime = timeToSeek;
  }

  sliderClicked(event){
    const sliderWidth = window.getComputedStyle(event.target).width;
    const newVolume = (event as MouseEvent).offsetX / parseInt(sliderWidth);
    this.audio.volume = newVolume;
    this.volumePercentage = newVolume * 100 + '%';
  }

  volumeButtonClicked(){
    this.audio.muted = !this.audio.muted;
    this.muted = this.audio.muted;
  }

  voiceEnded(){
    this.isPlaying = false;
  }
}
