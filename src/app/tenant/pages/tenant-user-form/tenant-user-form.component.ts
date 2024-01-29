import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogService, UIModalNotificationPage } from 'global';
// Guard dialog box
import { EncrDecrService } from 'src/app/services/encrDecr/encr-decr.service';
import { TenantUser } from '../../model/tenantUser';
import { TenantUserService } from '../../services/tenantUser/tenant-user.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-tenant-user-form',
  templateUrl: './tenant-user-form.component.html',
  styleUrls: ['./tenant-user-form.component.css']
})
export class TenantUserFormComponent implements OnInit, AfterViewInit {

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

  userForm: FormGroup;
  public tenantUser: TenantUser;
  userId: number;
  userFormViewMode = true;
  userReadModeView = false;
  tenantUserDetail: any;
  addEditText: string;
  warningFlag: string;
  showLoaderImage = false;
  tenantName: any;
  constructor(private formBuilder: FormBuilder, private tenantUserService: TenantUserService,
    private globalService: globalSharedService, private router: Router,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private encrDecrService: EncrDecrService) { }

  ngOnInit() {
    this.tenantName = this.globalService.name;
    this.createUserForm();
    // Form level controls register
    this.userId = this.globalService.selectedId;

    if (this.userId == null || this.userId == undefined) {
      this.addEditText = "Add";
      this.globalService.userDetails.id = null;
      if (this.globalService.userDetails.id == null) {
        this.createUserForm();
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

  // Form level controls register
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
        middleName: [null, [
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


  previewTenentUser() {
    this.globalService.GettingString(this.tenantName);
    this.userFormViewMode = false;
    this.userReadModeView = true;
    this.tenantUser = <TenantUser>this.userForm.value;
    // this.userForm.value.user.countryId = Number(this.userForm.value.user.countryId);
    // this.userForm.value.user.stateId = Number(this.userForm.value.user.stateId);
    if (this.userForm.value.user.gender == 0) {
      this.userForm.value.user.genderName = '';
    }

    this.tenantUser.addresses = [];

    for (const [key, value] of Object.entries(this.userForm.value.user)) {
      this.userForm.value.user[key] = value ? value : null
    }

    // /* this.tenant.address = <Address>this.tenantForm.get('address').value; */
    // this.tenantUser.addresses.push(this.tenantUser.address);
  }

  saveTenantUserInfo() {
    this.showLoaderImage = true;
    this.globalService.GettingString(this.tenantName);
    if (this.userForm.value.user.dateOfBirth == null) {
    } else {
      let dateOfBirth = this.convertObjectToDateString(this.userForm.value.user.dateOfBirth);
      this.userForm.value.user.dateOfBirth = dateOfBirth;
    }
    let createdBy = sessionStorage.getItem("userId");
    this.userForm.value.user.createdBy = createdBy;
    let tenantId = sessionStorage.getItem("userOwnerId");
    // Deep copy for to add street based on address 2 added
    let tenantUserDetail = JSON.parse(JSON.stringify(this.userForm.value));
    tenantUserDetail['tenantId'] = Number(tenantId);
    // if address 2 line if entered then append the address 2 to street
    if (tenantUserDetail['user']['userAddress2'] != null) {
      tenantUserDetail['user'].street = tenantUserDetail['user'].street + '#' + tenantUserDetail['user'].userAddress2;
    }


    if (this.userForm.get('user').value.id == null) {
      this.tenantUserService.saveTenantUser(tenantUserDetail).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.createUserForm();
        this.globalService.GettingString(this.tenantName);
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
          this.globalService.GettingString(this.tenantName);

        }
      );
    }
    else {
      let updatedBy = sessionStorage.getItem("userId");
      tenantUserDetail.user.updatedBy = updatedBy;
      this.tenantUserService.updateTenantUser(tenantUserDetail).subscribe((res) => {
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
    this.globalService.GettingString(this.tenantName);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  convertObjectToDateString(object: Object) {
    let newDay = this.userForm.value.user.dateOfBirth.day;
    let newMon = this.userForm.value.user.dateOfBirth.month;
    let newYrs = this.userForm.value.user.dateOfBirth.year;
    let reqDateOfBirth = newDay + '-' + newMon + '-' + newYrs;
    return reqDateOfBirth;
  }

  cancelTenantUserForm() {
    this.globalService.GettingString(this.tenantName);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  resetTenantUserForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  resetAccountUserForm() {
    this.tenantUser = <TenantUser>this.userForm.value;
    if (this.tenantUser['user'].id === null) {
      // this.userForm.reset();
      this.createUserForm();
    }
    else {
      this.createUserForm();
      this.getUserByUserId(this.userId);
    }
  }

  getUserByUserId(userId: number) {
    this.tenantUserService.getTenantUserByUserId(userId).subscribe(
      (tenantUser: TenantUser) => {
        this.tenantUser = tenantUser;
        if (this.tenantUser.street != null || this.tenantUser.street != undefined) {
          var streetsAddress: string[] = [];
          var streets = this.tenantUser.street.split('#', 2);
          for (let i = 0; i < streets.length; i++) {
            if (streets[i] === "null") {
              streetsAddress[i] = "";
            } else {
              streetsAddress[i] = streets[i];
            }
          }

          this.tenantUser.street = streetsAddress[0];
          if (streetsAddress.length != 1) {
            this.tenantUser.userAddress2 = streetsAddress[1];
          } else {
            this.tenantUser.userAddress2 = null;
          }
        }

        this.globalService.setUserEmailId(this.tenantUser.emailId);
        this.editUser(tenantUser);
      },
      (error: any) => { }
    );
  }

  updateTenantUserFormView(userId: number) {
    this.userId = userId;
    this.createUserForm();
    this.getUserByUserId(userId);
  }

  editUser(user: TenantUser) {
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
        isAdmin: user.isAdmin,
        isActive:user.isActive,
        isSignonActive: user.isSignonActive
      }
    });
  }
  convertGender(gender: string) {
    if (gender === " " || gender === "" || gender === undefined) {
      return null;
    }
    else {
      return gender;
    }
  }

  genderPopulate(gender) {
    return (gender == 'F') ? "Female" : (gender == 'M') ? "Male" : (gender == 'U') ? "Trans-Gender" : ''
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
    this.globalService.GettingString(this.tenantName);
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
