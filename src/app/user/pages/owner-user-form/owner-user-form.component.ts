import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, UIModalNotificationPage } from 'global';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { EncrDecrService } from 'src/app/services/encrDecr/encr-decr.service';
import { OwnerUserService } from '../../services/ownerUser/owner-user.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

export class Roles {
  id: number;
}

@Component({
  selector: 'app-owner-user-form',
  templateUrl: './owner-user-form.component.html',
  styleUrls: ['./owner-user-form.component.css']
})
export class OwnerUserFormComponent implements OnInit, AfterViewInit {

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

  constructor(private formBuilder: FormBuilder, private ownerUserService: OwnerUserService,
    private globalService: globalSharedService, private router: Router,
    private dialogService: DialogService, private route: ActivatedRoute,
    private encrDecrService: EncrDecrService) { }
  userForm: FormGroup;
  userId: number;
  addEditText = "Add";
  userFormViewMode = true;
  userReadModeView = false;
  showLoaderImage = false
  public user: User;
  ngOnInit() {
    this.createUserForm();
    // Form level controls register
    this.userId = this.globalService.selectedId;

    if (this.userId == null || this.userId == undefined) {
      this.addEditText = "Add";
      this.globalService.userDetails.id = null;
      if (this.globalService.userDetails.id == null) {

      } else {
        this.getUserByUserId(this.userId);
        // this.editUser(this.globalService.userDetails);
      }
    } else {
      this.addEditText = "Edit";
      // this.tenantUserDetail= this.globalService.userDetails;
      // this.editUser(this.tenantUserDetail);
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
        isActive:[false],
        isSignonActive:[false]
      })
    });
  }

  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  //Review and Save method
  previewUser() {
    this.userFormViewMode = false;
    this.user = <User>this.userForm.value;
    /* this.userForm.value.user.countryId = Number(this.userForm.value.user.countryId);
    this.userForm.value.user.stateId = Number(this.userForm.value.user.stateId); */
    if (this.userForm.value.user.gender == 0) {
      this.userForm.value.user.genderName = '';
    }

    this.userReadModeView = true;

    for (const [key, value] of Object.entries(this.userForm.value.user)) {
      this.userForm.value.user[key] = value ? value : null
    }

    // this.user.addresses = [];
    // this.user.address.street = this.user.address.addressLine1 + '#' + this.user.address.addressLine2;
    // this.user.addresses.push(this.user.address);
  }


  createUser() {
    this.userFormViewMode = false;
    this.userReadModeView = true;
    this.user = <User>this.userForm.value;

  }


  saveUserInfo() {
    this.showLoaderImage = true;
    if (this.userForm.value.user.dateOfBirth == null) {
    } else {
      let dateOfBirth = this.convertObjectToDateString(this.userForm.value.user.dateOfBirth);
      this.userForm.value.user.dateOfBirth = dateOfBirth;
    }
    let id = sessionStorage.getItem("beId");
    this.userForm.value.user.organizationId = Number(id);
    // Deep copy for to add street based on address 2 added
    let ownerUserDetail = JSON.parse(JSON.stringify(this.userForm.value));
    console.log(ownerUserDetail.user)
    // if address 2 line if entered then append the address 2 to street
    if (this.userForm.get(['user', 'userAddress2']).value != null) {
      ownerUserDetail['user'].street = ownerUserDetail['user'].street + '#' + ownerUserDetail['user'].userAddress2;
    }
    if (this.user['user'].id === null) {
      let createdBy = sessionStorage.getItem("userId");
      let beType = sessionStorage.getItem("beType");
      ownerUserDetail.user.createdBy = createdBy;
      this.ownerUserService.saveUser(ownerUserDetail, beType, Number(id)).subscribe((res) => {
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
      ownerUserDetail.user.updatedBy = updatedBy;
      this.ownerUserService.updateUser(ownerUserDetail).subscribe((res) => {
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
    this.router.navigate(['../'], { relativeTo: this.route });
  }


  convertObjectToDateString(object: Object) {
    let newDay = this.userForm.value.user.dateOfBirth.day;
    let newMon = this.userForm.value.user.dateOfBirth.month;
    let newYrs = this.userForm.value.user.dateOfBirth.year;
    let reqDateOfBirth = newDay + '-' + newMon + '-' + newYrs;
    return reqDateOfBirth;
  }

  cancelUserForm() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  resetUserForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  resetAccountUserForm() {
    this.user = <User>this.userForm.value;
    if (this.user['user'].id === null) {
      this.createUserForm();
    }
    else {
      this.createUserForm();
      this.getUserByUserId(this.userId);
    }
  }

  // back Button
  backButton(elementId) {
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


  getUserByUserId(userId: number) {
    this.ownerUserService.getUserByUserId(userId).subscribe(
      (user: User) => {
        this.user = user;
        if (this.user.street != null || this.user.street != undefined) {
          var streetsAddress: string[] = [];
          var streets = this.user.street.split('#', 2);
          for (let i = 0; i < streets.length; i++) {
            if (streets[i] === "null") {
              streetsAddress[i] = "";
            } else {
              streetsAddress[i] = streets[i];
            }
          }

          this.user.street = streetsAddress[0];
          if (streetsAddress.length != 1) {
            this.user.userAddress2 = streetsAddress[1];
          } else {
            this.user.userAddress2 = '';
          }
        }

        this.editUser(user)
        this.globalService.setUserEmailId(this.user.emailId);
      }
      ,
      (error: any) => { }
    );
  }
  editUser(user: User) {
    let dateOfBirth = this.convertStringToDateObject(user.dateOfBirth);
    let genderConversion = this.convertGender(user.gender);
    //
    this.userForm.patchValue({
      user: {
        id: user.id,
        countryId: user.countryId || null,
        stateId: user.stateId || null,
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
        isActive: user.isActive,
        isAdmin: user.isAdmin,
        isSignonActive: user.isSignonActive
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

}
