import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Navbar} from './components/navbar/navbar';
import {ChatAppWrapper} from './components/chat-app-wrapper/chat-app-wrapper.component';
import {SharedModule} from 'src/app/shared/shared.module';
import {RouterModule} from '@angular/router';
import {Container} from './components/container/container';
import {AssistantModule} from 'src/app/assistant/assistant.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ChangePassword} from './components/change-password/change-password';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SmallNavbar} from './components/smll-nav/small-navbar.component';
import {CustomLinkifyPipe} from 'src/app/shared/pipes/customLinkify';
import {SearchMessages} from './components/search-messages/search-messages.component';
import {CustomChatComponent} from './components/app-chat/custom-chat.component';
import {NewGroupButton} from './components/new-group-button/new-group-button.component';
import {ConversationRecord} from './components/conversation-record/conversation-record';
import {SideBar} from './components/side-bar/side-bar';
import {
  SelectForwardRecipientModal
} from './components/select-forward-recipient-modal/select-forward-recipient-modal.component';
import {ForwardElement} from './components/forward-element/forward-element.component';
import {ConversationInfoModal} from './components/conversation-info-modal/conversation-info-modal.component';
import {ConversationInfo} from './components/conversation-info/conversation-info';
import {NewGroupModal} from './components/new-group-modal/new-group-modal';
import {NoActiveParticipant} from './components/no-active-participant/no-active-participant.component';
import {Message} from './components/message/message.component';
import {VisitorsElement} from './components/visitors-element/visitors-element.component';
import {MessageListComponent} from "./components/messages-list/messages-list";
import {MatIconModule} from "@angular/material/icon";
import {ChangeProfile} from "./components/change-profile/change-profile.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AppUsers} from "./components/app-users/app-users.component";
import {UserInfoModal} from "./components/user-info-modal/user-info-modal";
import {LottieComponent} from "ngx-lottie";

@NgModule({
  declarations: [
    Navbar,
    ChatAppWrapper,
    Container,
    ChangePassword,
    SmallNavbar,
    SideBar,
    CustomChatComponent,
    Message,
    ConversationInfo,
    ConversationRecord,
    ConversationInfoModal,
    NoActiveParticipant,
    ForwardElement,
    NewGroupButton,
    SelectForwardRecipientModal,
    NewGroupModal,
    SearchMessages,
    VisitorsElement,
    CustomLinkifyPipe,
    MessageListComponent,
    ChangeProfile,
    AppUsers,
    UserInfoModal
  ],

    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        SharedModule,
        AssistantModule,
        InfiniteScrollModule,
        DragDropModule,
        MatIconModule,
        MatProgressSpinnerModule,
        LottieComponent,
    ],
  exports: [CustomChatComponent,MessageListComponent],
})
export class ContainerModule {}
