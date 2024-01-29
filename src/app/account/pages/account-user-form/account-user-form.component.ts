import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogService, UIModalNotificationPage } from 'global';
//import { ALLOW_MULTIPLE_PLATFORMS } from '@angular/core/src/application_ref';
import { EncrDecrService } from 'src/app/services/encrDecr/encr-decr.service';
import { AccountUser } from '../../model/accountUser';
import { AccountUserService } from '../../services/accountUser/account-user.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-account-user-form',
  templateUrl: './account-user-form.component.html',
  styleUrls: ['./account-user-form.component.css']
})
export class AccountUserFormComponent implements OnInit, AfterViewInit {

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.userForm.dirty) {
      this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
      // returning false will show a confirm dialog before navigating away
    } else {
      return true; // returning true will navigate without confirmation
    }
    return this.dialogService.navigateAwaySelection$;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  warningFlag: string;

  constructor(private formBuilder: FormBuilder, private accountUserService: AccountUserService, private globalService: globalSharedService,
    private router: Router, private dialogService: DialogService,
    private route: ActivatedRoute,
    private encrDecrService: EncrDecrService) { }

  userForm: FormGroup;
  accountUser: any;
  userId: number;
  addEditText: string;
  userFormViewMode = true;
  userReadModeView = false;
  showLoaderImage = false;
  accountName: any;
  ngOnInit() {
    this.accountName = this.globalService.name;
    this.createUserForm();
    // Form level controls register
    this.userId = this.globalService.selectedId;

    if (this.userId == null || this.userId == undefined) {
      this.addEditText = "Add";
      this.globalService.userDetails.id = null;
      if (this.globalService.userDetails.id == null) {

      } else {
        this.getUserByUserId(this.userId);
      }
    } else {
      this.addEditText = "Edit";
      this.getUserByUserId(this.userId);
    }
  }

  ngAfterViewInit() {
  }

  createUserForm() {
    this.userForm = this.formBuilder.group({
      user: this.formBuilder.group({
        id: [null],
        status: ['Active'],
        isAdmin: [false],
        city: [null],
        countryId: [null],
        countryName: '',
        signonPassword: this.encrDecrService.encryptUsingAES("Password1"),
        stateId: [null],
        stateName: '',
        createdBy: [],
        stateOther: [null],
        street: [null],
        zipcode: [null],
        emailId: [, [Validators.required, Validators.email]],
        firstName: [, [
          Validators.required,
          Validators.pattern(this.globalService.getNamePattern()),
          Validators.maxLength(99)]
        ],
        gender: [null],
        genderName: '',
        dateOfBirth: [null],
        lastName: [, [
          Validators.required,
          Validators.pattern(this.globalService.getNamePattern()),
          Validators.maxLength(99)]
        ],
        middleName: [, [
          Validators.pattern(this.globalService.getNamePattern()),
          Validators.maxLength(99)
        ]
        ],
        mobileNumberPrimary: [,
          [
            Validators.required,
            Validators.pattern("[0-9]*")
          ]
        ],
        mobileNumberSecondary: [,
          [
            Validators.pattern("[0-9]*")
          ]],
        phoneNumberPrimary: [,
          [
            Validators.pattern("[0-9]*")
          ]],
        phoneNumberSecondary: [,
          Validators.pattern("[0-9]*")
        ],
        salutationId: [null],
        salutationName: '',
        userAddress2: [null],
        secretAnswer: [],
        secretQuestionId: 1,
        skypeId: [null],
        isActive: [false],
        isSignonActive: [false]
      })
    });
  }

  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  previewAccountUser() {
    this.userFormViewMode = false;
    this.userReadModeView = true;
    this.accountUser = <AccountUser>this.userForm.value;
    if (this.userForm.value.user.gender == 0) {
      this.userForm.value.user.genderName = '';
    }

    for (const [key, value] of Object.entries(this.userForm.value.user)) {
      this.userForm.value.user[key] = value ? value : null
    }
  }


  saveAccountUserInfo() {
    this.globalService.GettingString(this.accountName);
    this.showLoaderImage = true;
    if (this.userForm.value.user.dateOfBirth == null) {
    } else {
      let dateOfBirth = this.convertObjectToDateString(this.userForm.value.user.dateOfBirth);
      this.userForm.value.user.dateOfBirth = dateOfBirth;
    }

    let createdBy = sessionStorage.getItem("userId");
    this.userForm.value.user.createdBy = createdBy;
    let accountId = sessionStorage.getItem("userOwnerId");


    // Deep copy for to add street based on address 2 added
    let accountUserDetail = JSON.parse(JSON.stringify(this.userForm.value));
    accountUserDetail['accountId'] = Number(accountId);
    // if address 2 line if entered then append the address 2 to street
    if (this.userForm.get(['user', 'userAddress2']).value != null) {
      accountUserDetail['user'].street = accountUserDetail['user'].street + '#' + accountUserDetail['user'].userAddress2;
    }
    if (this.userForm.get('user').value.id == null) {
      this.accountUserService.saveAccountUser(accountUserDetail).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.createUserForm();
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      let updatedBy = sessionStorage.getItem("userId");
      accountUserDetail.user.updatedBy = updatedBy;
      this.accountUserService.updateAccountUser(accountUserDetail).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.createUserForm();
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // save redirectTo
  redirectTo() {
    this.globalService.GettingString(this.accountName);
    this.router.navigate(['../'], { relativeTo: this.route });
  }


  convertObjectToDateString(object: Object) {
    let newDay = this.userForm.value.user.dateOfBirth.day;
    let newMon = this.userForm.value.user.dateOfBirth.month;
    let newYrs = this.userForm.value.user.dateOfBirth.year;
    let reqDateOfBirth = newDay + '-' + newMon + '-' + newYrs;
    return reqDateOfBirth;
  }


  cancelAccountUserForm(event: Event) {
    this.globalService.GettingString(this.accountName);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Reset tenant form
  resetTenantForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  resetAccountUserForm() {
    this.globalService.GettingString(this.accountName);
    this.accountUser = <AccountUser>this.userForm.value;
    if (this.accountUser['user'].id === null) {
      this.createUserForm();
    }
    else {
      this.createUserForm();
      this.getUserByUserId(this.userId);
    }
  }

  getUserByUserId(userId: number) {
    this.accountUserService.getAccountUserByUserId(userId).subscribe(
      (accountUser: AccountUser) => {
        this.accountUser = accountUser;

        if (this.accountUser.street != null || this.accountUser.street != undefined) {
          var streetsAddress: string[] = [];
          var streets = this.accountUser.street.split('#', 2);
          for (let i = 0; i < streets.length; i++) {
            if (streets[i] === "null") {
              streetsAddress[i] = "";
            } else {
              streetsAddress[i] = streets[i];
            }
          }

          this.accountUser.street = streetsAddress[0];
          if (streetsAddress.length != 1) {
            this.accountUser.userAddress2 = streetsAddress[1];
          } else {
            this.accountUser.userAddress2 = null;
          }
        }

        this.editUser(accountUser)
        this.globalService.setUserEmailId(this.accountUser.emailId);
      }
      ,
      (error: any) => { });
  }

  editUser(user: AccountUser) {

    let dateOfBirth = this.convertStringToDateObject(user.dateOfBirth);
    let genderConversion = this.convertGender(user.gender);
    //
    this.userForm.patchValue({
      user: {
        id: user.id,
        countryId: user.countryId || null,
        stateId: user.stateId || null,
        country: user.country,
        state: user.state,
        city: user.city,
        stateOther: user.stateOther,
        street: user.street || null,
        userAddress2: user.userAddress2 || null,
        zipcode: user.zipcode,
        emailId: user.emailId,
        firstName: user.firstName,
        gender: genderConversion,
        genderName: this.genderPopulate(user.gender),
        dateOfBirth: dateOfBirth || null,
        lastName: user.lastName,
        salutationId: user.salutationId || null,
        middleName: user.middleName,
        mobileNumberPrimary: user.mobileNumberPrimary,
        mobileNumberSecondary: user.mobileNumberSecondary,
        phoneNumberPrimary: user.phoneNumberPrimary,
        phoneNumberSecondary: user.phoneNumberSecondary,
        skypeId: user.skypeId,
        status: user.status,
        isAdmin: user.isAdmin,
        isActive:user.isActive,
        isSignonActive:user.isSignonActive
      }
    });
  }

  genderPopulate(gender) {
    return (gender == 'F') ? "Female" : (gender == 'M') ? "Male" : (gender == 'U') ? "Trans-Gender" : ''
  }

  convertGender(gender: string) {
    if (gender === " " || gender === "" || gender === undefined) {
      return null;
    }
    else {
      return gender;
    }
  }

  convertStringToDateObject(formatdateOfBirth: String) {
    if (formatdateOfBirth === "") {
      return null;
    }

    // var dateOfBirth = { year: 2019, month: 9, day: 10 }
    var arr = formatdateOfBirth.split('-');
    let dateOfBirth =
    {
      day: parseInt(arr[0]),
      month: parseInt(arr[1]),
      year: parseInt(arr[2])
    }
    return dateOfBirth;
  }

  // back Button
  backButton(elementId) {
    this.globalService.GettingString(this.accountName);
    this.userFormViewMode = true;
    this.userReadModeView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }
}
