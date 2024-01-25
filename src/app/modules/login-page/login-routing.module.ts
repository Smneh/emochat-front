import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomLoginComponent} from './components/custom-login/custom-login.component';

const routes: Routes = [
  { path: '', component: CustomLoginComponent },
  { path: ':uniqueId', component: CustomLoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
