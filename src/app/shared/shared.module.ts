import {ProfilePicture} from './components/profile-picture/profile-picture.component';
import {NewMessageInput} from './components/new-message-input/new-message-input.component';
import {VoiceElement} from './components/voice-element/voice-element.component';
import {VideoElement} from './components/video-element/video-element.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PageNotFound} from './components/page-not-found/page-not-found';
import {SnackbarMessage} from './components/snackbar-message/snackbar-message.component';
import {DroppableDirective} from './directive/droppable.directive';
import {FileDropZone} from './components/file-drop-zone/file-drop-zone.component';
import {NgbDropdown, NgbModalModule, NgbModule, NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {DocumentMessage} from './components/document-message/document-message.component';
import {TranslateModule} from '@ngx-translate/core';
import {PhotoElement} from './components/photo-element/photo-element.component';
import {FormatTimePipe} from './pipes/formatTime';
import {CustomTransformPipe} from './pipes/customTransform';
import {UploadVisualizer} from './components/upload-visualizer/upload-visualizer.component';
import {Status} from './components/status/status.component';
import {PhotosView} from './components/photos-view/photos-view.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NewMedia} from './components/new-media/new-media.component';
import {SanitizeEmoji} from './pipes/sanitizeEmoji';
import {NewMediaBox} from './components/new-media-box/new-media-box.component';
import {UploadedFiles} from './components/uploaded-files/uploaded-files.component';
import {NewPicture} from './components/new-picture/new-picture.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {DocumentElement} from './components/document-element/document-element.component';
import {CustomHeader} from './components/custom-header/custom-header.component';
import {MatTabsModule} from '@angular/material/tabs';
import {PictureUploadContainer} from './components/picture-upload-container/picture-upload-container.component';
import {UserAvatar} from './components/user-avatar/user-avatar.component';
import {ChangeUserPicture} from './components/change-user-picture/change-user-picture.component';
import {SignUpComponent} from '../modules/sign-up-page/sign-up';
import {MatIconModule} from "@angular/material/icon";
import {TimeDifferencePipe} from "./pipes/timeDifference";
import {MessageSentTime} from "./pipes/message-sent-time";
import {Participants} from "../modules/main-container/components/participants/participants.component";
import {AddNewMemberModal} from "../modules/main-container/components/add-new-member-modal/add-new-member-modal";
import {FileUploadZone} from "./components/file-upload-zone/file-upload-zone.component";
import {AssistantModule} from "../assistant/assistant.module";
import {VisitTimePipe} from "./pipes/visitTime";
import {LottieComponent} from "ngx-lottie";

@NgModule({
  declarations: [
    PageNotFound,
    SnackbarMessage,
    DroppableDirective,
    FileDropZone,
    PhotoElement,
    DocumentMessage,
    FormatTimePipe,
    CustomTransformPipe,
    UploadVisualizer,
    VideoElement,
    VoiceElement,
    Status,
    PhotosView,
    NewMedia,
    NewMessageInput,
    ProfilePicture,
    UploadedFiles,
    SanitizeEmoji,
    NewMediaBox,
    NewPicture,
    DocumentElement,
    CustomHeader,
    PictureUploadContainer,
    UserAvatar,
    ChangeUserPicture,
    SignUpComponent,
    TimeDifferencePipe,
    MessageSentTime,
    Participants,
    AddNewMemberModal,
    FileUploadZone,
    VisitTimePipe
  ],
  providers: [NgbNav,NgbDropdown],
  exports: [
    PageNotFound,
    SnackbarMessage,
    DroppableDirective,
    FileDropZone,
    PhotoElement,
    NgbModule,
    DocumentMessage,
    TranslateModule,
    FormatTimePipe,
    CustomTransformPipe,
    UploadVisualizer,
    VideoElement,
    VoiceElement,
    Status,
    NewMedia,
    NewMessageInput,
    ProfilePicture,
    UploadedFiles,
    SanitizeEmoji,
    NewPicture,
    CustomHeader,
    MatTabsModule,
    UserAvatar,
    ChangeUserPicture,
    SignUpComponent,
    TimeDifferencePipe,
    MessageSentTime,
    Participants,
    AddNewMemberModal,
    FileUploadZone,
    VisitTimePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModalModule,
    NgbModule,
    TranslateModule,
    DragDropModule,
    ImageCropperModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatIconModule,
    AssistantModule,
    LottieComponent,
  ],
})
export class SharedModule {}
