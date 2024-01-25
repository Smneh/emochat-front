import {catchError} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SecurityService} from 'src/app/shared/services/security.service';
import {StorageService} from 'src/app/shared/services/storage.service';
import {UserService} from 'src/app/shared/services/user.service';
import {of, Subject, tap} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-custom-custom-login',
  templateUrl: './custom-login.component.html',
  styleUrls: ['./custom-login.component.scss'],
})
export class CustomLoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private authService: SecurityService,
    private storageService: StorageService,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.authService.loading) {
      return;
    }

    if (this.loginForm.valid) {
      this.authService.loading = true;

      const username = this.loginForm.get('username').value;
      const password = this.loginForm.get('password').value;

      this.authService
        .Login(username, password)
        .pipe(
          tap((res) => {
            if (res) {
              this.handleLoginSuccess(res);
            }
          }),
          catchError((err) => {
            this.authService.loading = false;
            return of(err);
          })
        )
        .subscribe();
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  handleLoginSuccess(data?: any): void {
    if (data) {
      this.loading = false;
      this.storageService.clear();
      this.storageService.store('accessToken', data.token);
      this.storageService.store('userData', JSON.stringify(data));
      this.userService.loadUserDataFromStorage();
      this.navigateToHome();
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  options: AnimationOptions = {
    path: '/assets/animations/ai.json',
    loop: true,
    autoplay: true,
  };
}
