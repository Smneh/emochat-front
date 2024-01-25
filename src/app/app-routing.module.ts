import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Container} from './modules/main-container/components/container/container';
import {ChatAppWrapper} from './modules/main-container/components/chat-app-wrapper/chat-app-wrapper.component';
import {PageNotFound} from './shared/components/page-not-found/page-not-found';
import {LoginGuard} from './shared/guards/login.guard';
import {SignUpComponent} from './modules/sign-up-page/sign-up';

const routes: Routes = [
  {
    path: '',
    component: ChatAppWrapper,
    children: [
      { path: '', canActivate: [LoginGuard], component: Container },
    ],
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'custom-login',
    loadChildren: () =>
      import('./modules/login-page/login.module').then((m) => m.LoginModule),
  },
  { path: 'not-found', component: PageNotFound },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
