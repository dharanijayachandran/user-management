import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UpdatePassword } from 'src/app/model/UserData';
import { DialogService, UIModalNotificationPage } from 'global';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EncrDecrService } from 'src/app/services/encrDecr/encr-decr.service';
import { LogoutService } from 'src/app/services/logout/logout.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  userMailId: string;
  resetPasswordForm: FormGroup;
  updatePassword: UpdatePassword = new UpdatePassword();
  signonPassword: string;
  @ViewChild(UIModalNotificationPage) modelNotification;
  candeactivate=false;

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.resetPasswordForm.dirty) {
      if(this.candeactivate){
        this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
      }
      // returning false will show a confirm dialog before navigating away
    } else {
      return true; // returning true will navigate without confirmation
    }
    return this.dialogService.navigateAwaySelection$;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here
  constructor(private router: Router, private route: ActivatedRoute, private auth: AuthService, private formBuilder: FormBuilder, private globalService: globalSharedService, private dialogService: DialogService,
    private encrDecrService: EncrDecrService,private logoutService: LogoutService) {
    this.resetPasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20})")]],
      confirmPassword: ['', Validators.required],
    },
    {validator: this.ConfirmedValidator('password', 'confirmPassword')});
  }

  ngOnInit(): void {
    this.userMailId = sessionStorage.getItem("userName");
    this.getCurrentPassword();
  }



  getCurrentPassword() {
    let userId = sessionStorage.getItem('userId')
    this.auth.getCurrentPassword(userId).subscribe(response => {
      this.signonPassword = response.signonPassword;
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

  resetUserPassword() {
    this.updatePassword.signonPassword = this.resetPasswordForm.get('password').value;
    this.updatePassword.signonPassword = this.encrDecrService.encryptUsingAES(this.updatePassword.signonPassword);
    this.updatePassword.id = sessionStorage.getItem('userId');
      this.auth.changePasswordProcess(this.updatePassword).subscribe(
        res => {
          this.logout();
          this.candeactivate=false;
          this.modelNotification.alertMessage(res['messageType'], res['message']);

        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  resetChangePasswordForm() {
    this.resetPasswordForm.reset();
  }
  redirectTo() {
    this.router.navigate(['/welcome']);
  }
  focusOutFunction() {

    let newEncryptPassword = this.encrDecrService.encryptUsingAES(this.resetPasswordForm.get('currentPassword').value);
    if (newEncryptPassword === this.signonPassword) {
      this.resetPasswordForm.get('currentPassword').clearValidators();
      this.resetPasswordForm.get('currentPassword').updateValueAndValidity();
      this.resetPasswordForm.get('currentPassword').setErrors(null)
    } else {
      this.resetPasswordForm.get('currentPassword').markAsTouched();
      this.resetPasswordForm.get('currentPassword').updateValueAndValidity();
      this.resetPasswordForm.get('currentPassword').setErrors({
        'required': true
      })
    }
  }
  //New password and Confirm password check.
  /* newandConfirmPasswordMatch(group:FormGroup){
    if(group.get('password').value!=group.get('confirmPassword').value){
      group.get('confirmPassword').setErrors({
        'notMatched': true
      })
    }else{
      group.get('confirmPassword').setErrors({
        'notMatched': false
      })
      group.get('confirmPassword').updateValueAndValidity();
    }
  } */
  gotoWelcomPage() {
    window.location.href = '/#/';
  }
  resetPassworForm() {
    this.candeactivate=true;
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }
  //Old and new password check
  passwordMatch(event: Event) {
    if (this.resetPasswordForm.value.currentPassword == this.resetPasswordForm.value.password) {
      this.resetPasswordForm.get('password').setErrors({
        'forbiddenName': true
      })
    } else {
      this.resetPasswordForm.get('password').setErrors({
        'forbiddenName': false
      })
      this.resetPasswordForm.get('password').updateValueAndValidity();
    }
  }

  logout() {
		this.logoutService.logout().subscribe(response => {
			localStorage.clear();
			localStorage.removeItem('pagemenu');
			sessionStorage.clear();
			sessionStorage.removeItem('userId');
			sessionStorage.removeItem('userName');
		},
			error => {
				console.log(error);
			}
		);
  }
  ConfirmedValidator(controlName: string, matchingControlName: string){
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

}
