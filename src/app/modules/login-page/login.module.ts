import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginRoutingModule} from './login-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomLoginComponent} from './components/custom-login/custom-login.component';
import {SharedModule} from 'src/app/shared/shared.module';
import {AssistantModule} from 'src/app/assistant/assistant.module';
import {LottieModule} from 'ngx-lottie';
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [CustomLoginComponent],
    imports: [
        CommonModule,
        SharedModule,
        LoginRoutingModule,
        FormsModule,
        AssistantModule,
        LottieModule,
        ReactiveFormsModule,
        MatIconModule,
    ],
})
export class LoginModule {}
