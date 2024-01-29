import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import pageSettings from 'src/app/model/page-settings';
import { ResetPassword } from 'src/app/model/resetPassword';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EncrDecrService } from 'src/app/services/encrDecr/encr-decr.service';
import { environment } from 'src/environments/environment';
import { CanDeactivate } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  pageSettings = pageSettings;
  // @ViewChild('userName') userNameTextBox: ElementRef;
  username;
  resetToken: string;
  isValidToken: Boolean;

  resetPasswordForm: FormGroup;
  resetPassword: ResetPassword = new ResetPassword();
  userMailId: string;
  apiurl = environment.environmentUrl;
  constructor(private router: Router, private route: ActivatedRoute, private auth: AuthService, private formBuilder: FormBuilder,
    private encrDecrService: EncrDecrService, private elementRef: ElementRef) {
    this.pageSettings.pageEmpty = true;
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {

    this.resetPasswordFormPage();
    this.userMailId = sessionStorage.getItem("userName");

    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      this.getUserDetailsByToken(this.resetToken);
    });
  }

  resetPasswordFormPage() {
    this.resetPasswordForm = this.formBuilder.group({
      username: [null],
      password: [null, [Validators.required, Validators.pattern("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20})")]],
      confirmPassword: [null, Validators.required],
    },
      { validator: this.ConfirmedValidator('password', 'confirmPassword') });
  }
  ngAfterViewInit() {
    // this.userNameTextBox.nativeElement.innerText = "keeth22@gmail.com";//sessionStorage.getItem("userName");
  }


  resetUserPassword() {
    let selectedLan = sessionStorage.getItem("selectedLan");
    this.resetPassword = <ResetPassword>this.resetPasswordForm.value;
    if (this.resetPassword.password === this.resetPassword.confirmPassword) {
      this.resetPassword.password = this.encrDecrService.encryptUsingAES(this.resetPassword.password);
      this.resetPassword.confirmPassword = this.encrDecrService.encryptUsingAES(this.resetPassword.confirmPassword);
      this.resetPassword.authToken = this.resetToken;
      console.log("password onject::::::" + JSON.stringify(this.resetPassword));
      this.auth.resetPasswordProcess(this.resetPassword).subscribe(
        res => {
          sessionStorage.setItem('resetpassword', 'yes');
          //bind emailId and signOnId   =====refer JSP page.
          // 
          sessionStorage.setItem("passwordChange", "Your password changed successfully !!");
          //this.auth.setSuccessMessage('Your password changed successfully !!');
          if (selectedLan == null) {
            window.location.href = this.apiurl;
          }
          else {
            window.location.href = this.apiurl + selectedLan;
          }
          //this.router.navigate(['../']);
        },
        error => {
          // alert(JSON.stringify(error.error.message));
          // sessionStorage.removeItem('resetpassword');
        });
    }
    else {
      alert("Password and Confirm Password does not match");
    }
  }
  getUserDetailsByToken(token: string) {
    this.auth.ValidateResetToken(token)
      .subscribe(
        res => {
          this.isValidToken = true;
          this.resetPasswordForm.controls['username'].setValue(res['username']);
        },
        error => {

          if (error.status === 400) {
            this.auth.setFailureMessage(error.error);
          }
          else {
            this.auth.setFailureMessage('Unknown error, Please try again');
          }
          this.router.navigate(['']);
        });
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem('resetpassword');
  }

}
/* function matchPassword(group: AbstractControl): { [key: string]: any } | null {
  const passwordControl = group.get('password');
  const confirmPasswordControl = group.get('confirmPassword');

  if (passwordControl.value === confirmPasswordControl.value || confirmPasswordControl.pristine) {
    return null;
  } else {
    return { 'passwordMismatch': true };
  }
} */