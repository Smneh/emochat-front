import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {ApiCallService} from '../../services/apiCall.service';
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'document-element',
  templateUrl: './document-element.component.html',
  styleUrls: ['./document-element.component.scss']
})
export class DocumentElement implements OnInit {
  files: File[] = []
  fileName: string = ''
  @Input() attachmentId
  @Input() isReply: boolean = false;
  @Input() isGuid: boolean = false;
  constructor(
    private apiCallService: ApiCallService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.getInfo(this.attachmentId.split('.')[0]).subscribe(res => {
      if (res) {
        this.fileName = this.getListFileName(res[0].fileName);
      }
    })
  }

  getListFileName(fileName: string) {
    if (fileName.length > 15) {
      return fileName.substring(0, 15) + '...' + fileName.substring(fileName.length - 5)
    }
    else {
      return fileName
    }
  }

  download() {
    let fileUniqueId = this.attachmentId.split('.')[0];
    var objectUrl: string = '';
    let params = fileUniqueId + '?token='+ this.storageService.retrieve('accessToken') + '&inLine=true';
    objectUrl = environment.Web_Api_Url + environment.Download_Path + params;
    var a: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
    a.target = '_blank';
    a.href = objectUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  getInfo(uniqueIds): Observable<any[]> {
    return this.apiCallService.get(environment.FileHandler_Path +'GetInfo/'+ uniqueIds,null)
  }
}
