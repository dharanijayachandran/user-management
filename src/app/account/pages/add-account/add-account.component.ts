import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogService, UIModalNotificationPage } from 'global';
import { Account } from '../../model/account';
import { AccountService } from '../../services/account/account.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { Address } from 'src/app/Shared/model/Address';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit, AfterViewInit {
  reminingUser: number;
  maxUserCheck:boolean;
  maxUsers: number;
  systemAdmin: string;
  maxUserCheckDisabled=true;
  reminingUserForEdit: number;
  isMaxUsers = true;
  MaxUserCheckToolTip = "Click to enable/Disable";


  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.accountForm.dirty) {
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

  addEditText = 'Add';
  accountFormView = true;
  accountReadModeView = false;
  accountForm: FormGroup;
  dynamicRedirection: any;
  public account: Account;
  serviceMessage: string;
  warningFlag: string;
  numberOfUserForCheck: any;
  userList = [1,2,3,4,5,10,15,20];
  showLoaderImage = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private accountService: AccountService,
    private globalService: globalSharedService, private dialogService: DialogService,
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.createAccountForm();
    this.systemAdmin=(sessionStorage.getItem('isSystemAdmin'));
     // Getting URL id
     if (this.globalService.hasOwnProperty('listOfRow')) {
      if (this.globalService.listOfRow.hasOwnProperty('id')) {
        let id = this.globalService.listOfRow.id;
        if (id != null) {
          this.reminingUserForEdit=this.globalService.reminingUser;
          this.maxUsers = this.globalService.maxUsers;
          this.numberOfUserForCheck = this.globalService.listOfRow.numberOfUsers;
          this.getAccountDetailByAccId(id);
          this.addEditText = "Edit";
          this.validateReminingUser();
        }
      }else{
        this.addAccount();
      }
    } else {
       this.addAccount();
    }
  }
  addAccount(){
    this.numberOfUserForCheck = 0;
    this.addEditText = 'Add';
    this.reminingUser = this.globalService.reminingUser;
    this.maxUsers = this.globalService.maxUsers;
    if (this.systemAdmin == "true" || this.maxUsers == undefined) {
      this.maxUserCheckDisabled = false;
      this.maxUserCheck = false;
      this.accountForm.get('numberOfUsers').disable();
    } else {
      this.maxUserCheck=true;
      this.isMaxUsers = false;
    }
  }
  validateReminingUser() {
    this.reminingUser = this.globalService.reminingUser + this.numberOfUserForCheck;
  }

  ngOnDestroy() {
    if (this.globalService.hasOwnProperty('listOfRow')) {
      if (this.globalService.listOfRow.hasOwnProperty('id')) {
        if (this.globalService.listOfRow.id != null) {
          delete this.globalService.listOfRow;
        }
      }
    }
    this.maxUserCheck = false;
  }

  ngAfterViewInit() {
  }


  // form builder JSON and Validation
  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.pattern(this.globalService.getNamePattern())]],
      description: [''],
      numberOfUsers: [null, [Validators.required, Validators.pattern("[0-9]*")]],
      emaild: ['', [Validators.required, Validators.email]],
      webSite: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      faxNumber: ['', [Validators.pattern("[0-9]*")]],
      skypeId: ['',],
      mobileNumberPrimary: ['', [Validators.required, Validators.pattern("[0-9]*")]],
      mobileNumberSecondary: ['', [Validators.pattern("[0-9]*")]],
      phoneNumberPrimary: ['', [Validators.required, Validators.pattern("[0-9]*")]],
      phoneNumberSecondary: ['', [Validators.pattern("[0-9]*")]],
      status: ['Active'],
      address: this.formBuilder.group({
        addressLine1: [''],
        addressLine2: [''],
        zipCode: [''],
        city: [''],
        countryId: [null],
        countryName: '',
        stateId: [null],
        stateName: ''
      })
    });
  }

  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  //Review and Save method
  createAccount(): void {
    this.accountFormView = false;
    this.accountReadModeView = true;
    this.account = <Account>this.accountForm.value;
    this.account.addresses = [];
    this.account.address.street = this.account.address.addressLine1 + '#' + this.account.address.addressLine2;
    this.account.addresses.push(this.account.address);
  }


  // Cancel button
  cancelButton() {
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  // Reset Account form
  resetAccountForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.account = <Account>this.accountForm.value;
    if (this.account.id === null) {
      this.createAccountForm();
    }
    else {
      this.createAccountForm();
      this.getAccountDetailByAccId(this.account.id);
    }
  }


  getAccountDetailByAccId(id: number) {
    this.accountService.getAccountDetailByAccId(id)
      .subscribe(data => {
        let addressData: Address;
        var addressLine: any[] = [];
        if (data.addresses.length != 0) {
          addressData = data.addresses[0];
          addressLine = addressData.street.split('#', 2);
        }
        if (data.numberOfUsers) {
          this.maxUserCheck = true;
          this.isMaxUsers = false;
        } else if (data.numberOfUsers == undefined) {
          this.maxUserCheckDisabled = false;
          this.maxUserCheck = false;
          this.accountForm.get('numberOfUsers').disable();
        }
        else {
          this.maxUserCheck = false;
          this.accountForm.get('numberOfUsers').disable();
        }
        this.accountForm.patchValue({
          id: data.id,
          name: data.name,
          description: data.description,
          numberOfUsers: data.numberOfUsers || [0],
          emaild: data.emaild,
          createdBy: data.createdBy,
          webSite: data.webSite,
          faxNumber: data.faxNumber,
          skypeId: data.skypeId,
          mobileNumberPrimary: data.mobileNumberPrimary,
          mobileNumberSecondary: data.mobileNumberSecondary,
          phoneNumberPrimary: data.phoneNumberPrimary,
          phoneNumberSecondary: data.phoneNumberSecondary,
          status: data.status,
          address: {
            addressLine1: addressLine[0],
            addressLine2: addressLine[1],
            zipCode: addressData.zipCode,
            city: addressData.city,
            countryId: addressData.countryId,
            countryName: addressData.country,
            stateId: addressData.stateId,
            stateName: addressData.state
          }
        });
      });
  }

  // back Button
  backButton(elementId) {
    this.accountFormView = true;
    this.accountReadModeView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  // Save Account Information
  saveAccountInfo() {
    this.showLoaderImage = true;
    this.account = <Account>this.accountForm.value;
    let userId = sessionStorage.getItem('userId');
    this.account.createdBy = userId;
    let ownerId = sessionStorage.getItem('beId');
    this.account.ownerId = ownerId;
    delete this.account['address']['stateName'];
    delete this.account['address']['countryName'];
    let stateId = this.account['address']['stateId'];
    /* if (stateId == '0') {
      this.account['address']['stateId'] = '';
    } */
    if (this.account.id === null) {
      this.accountService.addAccount(this.account).subscribe((res) => {
        this.showLoaderImage = false;
        //this.dynamicRedirection = "account";
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.createAccountForm();
      }, (error: any) => {
        this.showLoaderImage = false;
        // If the unable to connect
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
      );
    }
    else {
      this.accountService.updateAccount(this.account).subscribe((res) => {
        this.showLoaderImage = false;
        // Go to addtent by dynamically setting
        //this.dynamicRedirection = "account";
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.createAccountForm();
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the unable to connect
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // goto Account List or Account form view
  redirectTo() {
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.accountForm.get('name').setErrors({
        pattern: true
      });
    }
  }
  isDisabledMaxUser(user){
    if(user < this.numberOfUserForCheck){
      return true;
    } else if(user > this.reminingUser){
      return true;
    }else{
      return false;
    }
  }
  displayMaxUsers(isChecked) {
    if (isChecked.checked) {
      this.accountForm.get('numberOfUsers').markAsTouched();
      this.accountForm.get('numberOfUsers').updateValueAndValidity();
      this.accountForm.get('numberOfUsers').setErrors({
        'required': true
      })

      this.accountForm.get('numberOfUsers').setValidators([Validators.required]);
      this.isMaxUsers = false;
      this.accountForm.get('numberOfUsers').enable();
    }
    else {
      this.isMaxUsers = true;
      this.accountForm.controls['numberOfUsers'].setValue('');
      this.accountForm.controls["numberOfUsers"].clearValidators();
      this.accountForm.controls["numberOfUsers"].updateValueAndValidity();
      this.accountForm.get('numberOfUsers').disable();
    }
  }
  validateInputValue($event) {
    if(this.systemAdmin ==="true" || (this.maxUsers===undefined)){
    }else{
      if (this.addEditText === 'Add') {
        if ($event.target.value.length == 0) {
          this.accountForm.get('numberOfUsers').setErrors({
            'lessThanUser': true
          })
        }
        if ($event.target.value > this.reminingUser) {
          this.accountForm.get('numberOfUsers').setErrors({
            'lessThanUser': true
          })
        }
      } else {
        if(this.maxUsers!=this.reminingUserForEdit){
        if ($event.target.value.length == 0) {
          this.accountForm.get('numberOfUsers').setErrors({
            'lessThanUserBetween': true
          })
        }
        if ($event.target.value > this.reminingUser) {
          this.accountForm.get('numberOfUsers').setErrors({
            'lessThanUserBetween': true
          })
        }
        if ($event.target.value < this.numberOfUserForCheck) {
          this.accountForm.get('numberOfUsers').setErrors({
            'lessThanUserBetween': true
          })
        }
      }else{
        if(this.maxUsers===undefined && this.reminingUserForEdit===undefined ){

        }else{
        this.accountForm.get('numberOfUsers').setErrors({
          'limiteReached': true
        })
      }
     }
      }
    }
  }
}
