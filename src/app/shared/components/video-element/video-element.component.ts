import {Component, Input, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'video-element',
  templateUrl: './video-element.component.html',
  styleUrls: ['./video-element.component.scss']
})
export class VideoElement implements OnInit {
  @Input() attachmentId;
  disableVideoTag = false;
  uniqueId: string;
  videoSrc = environment.Web_Api_Url + environment.Download_Path;
  constructor(
  ) { }
  ngOnInit() {
    let i = this.attachmentId.lastIndexOf(".");
    this.uniqueId = this.attachmentId.substring(0, i);
    setTimeout(() => {
      var video: any = document.getElementById(this.uniqueId);
      setTimeout(() => {
        if (video.readyState === 4) {
          // it's loaded
        } else {
          this.disableVideoTag = true;
        }
      }, 200);
    }, 100);
  }
}
