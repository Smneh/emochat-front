import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {UploadService} from '../../services/upload.service';
import {SnackbarMessageService} from '../../services/snackbar-message.service';
import {ModalDismissReasons, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {SharedService} from 'src/app/modules/main-container/services/groups.service';
import {VoiceRecorder} from "../../services/voice-recorder-service.service";

declare var $: any;

@Component({
  selector: 'new-message-input',
  templateUrl: './new-message-input.component.html',
  styleUrls: ['./new-message-input.component.scss'],
})
export class NewMessageInput implements OnInit, OnDestroy {

  text: string = '';
  window = window;
  attachment: string = null;
  recordMode: boolean = false;
  cancelBtnMode: boolean = false
  microphoneConnected: boolean = false
  guid = Date.now().toString();
  min: string = '00'

  tempText: string = '';
  isModalOpen: boolean = false;
  chatModalRef: NgbModalRef;
  recordedTime: any;

  @ViewChild('chatModal') confirmModal;

  @Input() isPrimary = false;
  @Input() showAttachment: boolean = true;
  @Input() encryption: boolean = false;
  @Input() disableSendAsFile: boolean = false;
  @Input() disableRecorderButton: boolean = false;

  @Output() onSendClicked = new EventEmitter();
  @Output() onEncryptSendClicked = new EventEmitter();

  private routerSubscription: Subscription;

  constructor(
    private uploadService: UploadService,
    private elementRef: ElementRef,
    private SnackbarMessageService: SnackbarMessageService,
    private modalService: NgbModal,
    private router: Router,
    public sharedService: SharedService,
    private voiceRecorder: VoiceRecorder,
  ) {
    this.voiceRecorder
      .recordingFailed()
      .subscribe(() => (this.recordMode = false));
    this.voiceRecorder
      .getRecordedTime()
      .subscribe(time => (this.recordedTime = time));
    this.voiceRecorder.getRecordedBlob().subscribe(data => {
      let voiceFile = new File([data.blob], "voice.wav");
      this.uploadService.openUploadAreaModal("messages", [<File>voiceFile]);
    });
  }


  startRecording() {

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {

        if (!this.recordMode) {
          this.recordMode = true;
          this.cancelBtnMode = true;
          this.voiceRecorder.startRecording();
        }
      }).catch(error => {
        this.SnackbarMessageService.error('no device is connected');
        return false;
      });
  }



  checkMicrophone(): Promise<boolean> {
    return navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        return true;
      })
      .catch(error => {
        this.SnackbarMessageService.error('no device is connected');
        return false;
      });
  }


  stopRecording() {
    if (this.recordMode) {
      this.recordMode = false;
      this.recordMode = false;
      this.cancelBtnMode = false;
      this.voiceRecorder.stopRecording();
    }
  }


  cancelRecording() {
    if (this.recordMode) {
      this.recordMode = false;
      this.cancelBtnMode = false;
      this.recordMode = false;
      this.voiceRecorder.abortRecording();
    }
  }


  handlePasteListener() {
    setTimeout(() => {
      let editor = this.elementRef.nativeElement.querySelector(".emojionearea-editor");
      if (editor) {
        editor.addEventListener("paste", (e: any) => {
          // file
          if (e.clipboardData.files && e.clipboardData.files.length > 0) {
            e.preventDefault();
            this.uploadService.openUploadAreaModal("messages", e.clipboardData.files);
          }
        });
      }
    }, 500);
    document.addEventListener("paste", (e: any) => {
      // file
      if (e.clipboardData.files && e.clipboardData.files.length > 0) {
        e.preventDefault();
        this.uploadService.openUploadAreaModal("messages", e.clipboardData.files);
      }
    });
  }

  openFileSelectModal() {
    this.uploadService.openUploadAreaModal("messages");
  }

  ngOnInit(): void {
    this.getRouteChanges();
    this.handlePasteListener();
    setTimeout(() => {
      $("#parentOfEditor" + this.guid + ' .emojionearea-editor').focus();
      $("#editorDiv" + this.guid).emojioneArea();
    }, 50);

    setTimeout(() => {
      $("#parentOfEditor" + this.guid + ' .emojionearea-editor').on("keyup", () => {
        this.text = $("#editorDiv" + this.guid).data("emojioneArea").getText();
      });
    }, 2000);

    setTimeout(() => {
      $("#parentOfEditor" + this.guid + ' .emojioneemoji').on("click", () => {
        setTimeout(() => {
          this.text = $("#editorDiv" + this.guid).data("emojioneArea").getText();
        }, 50);
      });
    }, 350);
  }


  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.cancelRecording();
  }

  getRouteChanges() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.clearContent();
      }
    });
  }

  clearContent() {
    this.text = '';
    $("#parentOfEditor" + this.guid + ' .emojionearea-editor').empty();
  }

  onEnter(): void {
    if (this.recordMode) {
      this.stopRecording();
      return;
    }
    if (!this.text || this.text == '') {
      return;
    }
    this.text = $("#editorDiv" + this.guid).data("emojioneArea").getText();
    this.removeEnterChar();
    this.sendText();
  }

  sendText() {
    this.removeEnterChar();
    setTimeout(() => {
      $("#parentOfEditor" + this.guid + ' .emojionearea-editor').empty();
    }, 20);
    if (this.text.length == 0) {
      return
    }
    this.onSendClicked.emit(this.text);
    this.text = '';
  }

  removeEnterChar() {
    if (this.text.charCodeAt(this.text.length - 1) == 10) {
      this.text = $("#editorDiv" + this.guid).data("emojioneArea").getText().slice(0, -1);
      $("#editorDiv" + this.guid).val(this.text);
    }
  }

  sendTextAsFile() {
    let fileName = 'TextFile' + '(' + Date.now() + ').txt';
    const file = new File([this.tempText], fileName, { type: 'text/plain' });

    const formData = new FormData();
    formData.append(file.name, file);
    this.uploadService.openUploadAreaModal("messages", [<File>file]).then(() => {
      this.text = $("#parentOfEditor" + this.guid + ' .emojionearea-editor').empty();
      this.chatModalRef.close();
      this.isModalOpen = false;
    });
  }

  open(content) {
    this.chatModalRef = this.modalService.open(content, { size: "sm" });

    this.chatModalRef.dismissed.subscribe(
      (reason) => {
        if (reason === ModalDismissReasons.ESC || reason === ModalDismissReasons.BACKDROP_CLICK) {
          this.isModalOpen = false;
        }
      },
    );

    content.focus();
  }

  closeModal(modal) {
    this.isModalOpen = false;
    modal.dismiss();
  }

}
