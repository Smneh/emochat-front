import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomButtonComponent} from './components/app-custom-button/custom-button.component';
import {CustomInputComponent} from './components/app-custom-input/custom-input.component';
import {CustomLoaderComponent} from './components/app-custom-loader/custom-loader.component';
import {NgbDropdownModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {CustomProgressBarComponent} from './components/app-custom-progress-bar/custom-progress-bar.component';

@NgModule({
  declarations: [CustomButtonComponent, CustomInputComponent, CustomLoaderComponent, CustomProgressBarComponent],
  imports: [CommonModule, NgbDropdownModule, NgbProgressbarModule],

    exports: [CustomButtonComponent, CustomInputComponent, CustomLoaderComponent, CustomProgressBarComponent],


})
export class AssistantModule { }
