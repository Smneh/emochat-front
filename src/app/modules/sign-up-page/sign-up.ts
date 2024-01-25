import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {catchError, of, Subject, tap} from 'rxjs';
import {SecurityService} from 'src/app/shared/services/security.service';
import {StorageService} from 'src/app/shared/services/storage.service';
import {UserService} from 'src/app/shared/services/user.service';
import {SignUpDto} from './models/SignUpDto';
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss', './responsive.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  signUpDto: SignUpDto = {
    username: '',
    password: '',
    fullname: '',
    email: '',
  };
  loading = false;
  showPassword = false;
  signupForm: FormGroup;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    public securityService: SecurityService,
    private userService: UserService,
    private router: Router,
    public storageService: StorageService
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.securityService.loading) {
      return;
    }
    if (this.signupForm.valid) {
      this.securityService.loading = true;
      this.signUpDto.password = this.signupForm.get('password').value;
      this.signUpDto.username = this.signupForm.get('username').value;
      this.signUpDto.fullname = this.signupForm.get('fullname').value;
      this.signUpDto.email = this.signupForm.get('email').value;
      this.securityService
        .SignUp(this.signUpDto)
        .pipe(
          tap((res) => {
            if (res) {
              this.continueSignUpResult(res);
            }
          }),
          catchError((err) => {
            this.securityService.loading = false;
            return of(err);
          })
        )
        .subscribe(); //TODO
    } else {
      this.markFormGroupTouched(this.signupForm);
    }
    if (this.signupForm.valid) {
      console.log('Form submitted:', this.signupForm.value);
    } else {
      this.markFormGroupTouched(this.signupForm);
    }
  }

  continueSignUpResult(data?: any) {
    if (data) {
      this.loading = false;
      this.storageService.store('accessToken', data.token);
      this.storageService.store('userData',JSON.stringify(data));
      this.routeHome();
    }
  }

  routeHome() {
    this.router.navigate(['/']);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.signupForm.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  options: AnimationOptions = {
    path: '/assets/animations/ai.json',
    loop: true,
    autoplay: true,
  };
}
