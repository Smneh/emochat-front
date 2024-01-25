import {HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {NewMediaBox} from '../components/new-media-box/new-media-box.component';
import {ConfigsService} from './configs.service';
import {SecurityService} from './security.service';
import {SnackbarMessageService} from './snackbar-message.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  onDrop = new EventEmitter()
  onPaste = new EventEmitter<File>();
  onUploaded = new EventEmitter<any>();
  maxUploadSize: number;
  uploadFiles = [];
  modalRef: NgbModalRef;
  singleImageToUpload:any;
  onUploadProgress = new EventEmitter<number>();

  constructor(private SnackbarMessageService: SnackbarMessageService,
              private securityService: SecurityService,
              private http: HttpClient,
              private modalService: NgbModal,
              private configurationService: ConfigsService) {}

  openUploadAreaModal(source, dropedFiles = null): Promise<any> {
    const isAnyModalOpened = this.modalRef;
    return new Promise((resolve, reject) => {
      if (isAnyModalOpened){
        return;
      }
      this.modalRef = this.modalService.open(NewMediaBox, {size: 'md', centered: true});
      if (dropedFiles)
        this.onDrop.emit(dropedFiles);
      this.modalRef.componentInstance.onUploaded.subscribe(ev => {
        const res = {attachments: ev.attachments, source: source};
        resolve(res);
        this.onUploaded.emit(res);
      });
      this.modalRef.dismissed.subscribe(_=>{
        this.modalRef = null;
      })
      this.modalRef.result.then(_=>{
        this.modalRef = null;
      })
    });
  }

  upload(files: File[]) {
    const expired = this.securityService.checkTokenExpiration()
    if (expired) {
      return null;
    }
    const token = this.securityService.GetToken();
    const username = this.securityService.GetUsername();
    const url = environment.Web_Api_Url + environment.FileHandler_Path + 'Upload';
    let headers: HttpHeaders = new HttpHeaders({'ngsw-bypass': 'true'});
    headers.append('Content-Type', 'multipart/form-data').append('Accept', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + token);
    headers = headers.append('Username', username);
    var formData = new FormData();
    var filesArray = Array.prototype.slice.call(files);
    filesArray.forEach(file => {
      formData.append('files', file, file.name);

    });
    const options = {headers: headers, reportProgress: true};
    return this.http.request(new HttpRequest('POST', url, formData, options)).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round((100 / event.total) * event.loaded);
          this.onUploadProgress.emit(progress);
          return {status: 'InProgress', percent: progress};
        } else if (event instanceof HttpResponse) {
          this.onUploadProgress.emit(100);
          return {status: 'Done', attachments: event.body['attachments']};
        }
        return {status: 'Unknown'};
      }));
  }

  calculateFilesTotalSize(files: File[]) {
    let totalSize = 0;
    files.forEach((file: File) => {
      totalSize += file.size;
    });
    return totalSize;
  }

  calculateImageTotalSize(images: File[]) {
    let totalSize = 0;
    images.forEach((file: File) => {
      totalSize += file.size;
    });
    return totalSize;
  }

  checkAllowableLimitSize(files, images) {
    const filesTotalSize = this.calculateFilesTotalSize(files);
    const imagesTotalSize = this.calculateImageTotalSize(images);
    const totalSize = filesTotalSize + imagesTotalSize;
    this.maxUploadSize = +this.configurationService.settings.maxUploadFileSizeMB * 1024 * 1024;
    if (totalSize > this.maxUploadSize) {
      this.SnackbarMessageService.error('file is too large');
      return false;
    }
    return true;
  }

  uploadUserProfilePicture(image:File){
    this.singleImageToUpload = image;
    const expired = this.securityService.checkTokenExpiration()
    if (expired) {
      return null;
    }
    const token = this.securityService.GetToken();
    const username = this.securityService.GetUsername();
    const url = environment.Web_Api_Url + environment.Upload_Profile_Picture_Path;
    let headers: HttpHeaders = new HttpHeaders({'ngsw-bypass': 'true'});
    headers.append('Content-Type', 'multipart/form-data').append('Accept', 'application/json');
    headers = headers.append('Authorization', 'bearer ' + token);
    headers = headers.append('Username', username);
    const formData = new FormData();
    formData.append('profilePicture', this.singleImageToUpload, this.singleImageToUpload.name);
    const options = {headers: headers, reportProgress: true};
    return this.http.request(new HttpRequest('PUT', url, formData, options));
  }
}
