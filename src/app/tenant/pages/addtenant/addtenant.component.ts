import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
// Guard dialog box
import { Tenant } from '../../model/tenant';
import { TenantService } from '../../services/tenant/tenant.service';
import { DialogService, UIModalNotificationPage } from 'global';
import { Address } from 'src/app/Shared/model/Address';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';


@Component({
  selector: 'app-addtenant',
  templateUrl: './addtenant.component.html',
  styleUrls: ['./addtenant.component.css']
})
export class AddtenantComponent implements OnInit, AfterViewInit, OnDestroy {
  maxUserCheckDisabled: boolean;
  MaxUserCheckToolTip = "Click to enable/Disable";

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  values: any;
  lastkey: any;
  setLastKey: any;
  numberOfUserForCheck: any;
  userList = [1, 2, 3, 4, 5, 10, 15, 20];
  reminingUser: number;
  maxUserCheck: boolean;
  systemAdmin: string;
  maxUsers: number;
  reminingUserForEdit: number;
  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.tenantForm.dirty) {
      this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
      // returning false will show a confirm dialog before navigating away
    } else {
      return true; // returning true will navigate without confirmation
    }
    return this.dialogService.navigateAwaySelection$;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here


  ngOnDestroy() {
    if (this.globalService && typeof this.globalService === 'object' && this.globalService.hasOwnProperty('listOfRow')) {
      const listOfRow = this.globalService.listOfRow;
      if (listOfRow && typeof listOfRow === 'object' && listOfRow.hasOwnProperty('id')) {
        const id = listOfRow.id;
        if (id !== null) {
          delete this.globalService.listOfRow;
        }
      }
    }
    this.maxUserCheck = false;
  }

  public addEditText = 'Add';
  tenantForm: FormGroup;
  public tenant: Tenant = new Tenant();
  tenatFormView = true;
  tenantReadModeView = false;
  serviceMessage = '';
  dynamicRedirection: string;
  showLoaderImage = false;
  isMaxUsers = true;
  constructor(private tenantService: TenantService,
    private formBuilder: FormBuilder,
    private router: Router,
    private globalService: globalSharedService,
    private route: ActivatedRoute,
    private dialogService: DialogService) {
  }

  ngOnInit() {
    this.tenantFormValidation();
    this.systemAdmin = (sessionStorage.getItem('isSystemAdmin'));
    // Getting URL id
    if (this.globalService && typeof this.globalService === 'object') {
      if (this.globalService.hasOwnProperty('listOfRow')) {
        const listOfRow = this.globalService.listOfRow;

        if (listOfRow && typeof listOfRow === 'object' && listOfRow.hasOwnProperty('id')) {
          let id = listOfRow.id;

          if (id !== null) {
            this.reminingUserForEdit = this.globalService.reminingUser;
            this.maxUsers = this.globalService.maxUsers;
            this.numberOfUserForCheck = listOfRow.numberOfUsers;
            this.getTenantDetailByTenId(id);
            this.addEditText = "Edit";
            this.validateReminingUser();
          }
        } else {
          this.addTenant();
        }
      } else {
        this.addTenant();
      }
    } else {
      console.error("this.globalService is undefined or not an object");
    }

  }
  addTenant() {
    this.numberOfUserForCheck = 0;
    this.addEditText = 'Add';
    this.reminingUser = this.globalService.reminingUser;
    this.maxUsers = this.globalService.maxUsers;
    if (this.systemAdmin == "true" || this.maxUsers == undefined) {
      this.maxUserCheckDisabled = false;
      this.maxUserCheck = false;
      this.tenantForm.get('numberOfUsers').disable();
    } else {
      this.maxUserCheck = true;
      this.isMaxUsers = false;
    }
  }
  validateReminingUser() {
    this.reminingUser = this.globalService.reminingUser + this.numberOfUserForCheck;
  }

  ngAfterViewInit() {

  }

  tenantFormValidation() {
    this.tenantForm = this.formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.pattern(this.globalService.getNamePattern())
      ]],
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
        addressLine1: [null],
        addressLine2: [null],
        zipCode: [null],
        city: [null],
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

  // Update tenant detail
  getTenantDetailByTenId(id: number) {
    this.tenantService.getTenantDetailByTenId(id)
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
          this.tenantForm.get('numberOfUsers').disable();
        }
        else {
          this.maxUserCheck = false;
          this.tenantForm.get('numberOfUsers').disable();
        }
        this.tenantForm.patchValue({
          id: data.id,
          name: data.name,
          createdBy: data.createdBy,
          description: data.description,
          numberOfUsers: data.numberOfUsers,
          emaild: data.emaild,
          webSite: data.webSite,
          faxNumber: data.faxNumber,
          skypeId: data.skypeId,
          mobileNumberPrimary: data.mobileNumberPrimary,
          mobileNumberSecondary: data.mobileNumberSecondary,
          phoneNumberPrimary: data.phoneNumberPrimary,
          phoneNumberSecondary: data.phoneNumberSecondary,
          status: data.status,
          address: {
            addressLine1: addressLine.length != 0 ? addressLine[0] : '',
            addressLine2: addressLine.length != 0 ? addressLine[1] : '',
            zipCode: addressData ? addressData.zipCode : null,
            city: addressData ? addressData.city : null,
            countryId: addressData ? addressData.countryId : null,
            countryName: addressData ? addressData.country : null,
            stateId: addressData ? addressData.stateId : null,
            stateName: addressData ? addressData.state : null
          }
        });
      });
  }

  //Review and Save method
  createTenant(): void {
    this.tenatFormView = false;
    this.tenantReadModeView = true;
    this.tenant = <Tenant>this.tenantForm.value;
    this.tenant.addresses = [];
    /* this.tenant.address = <Address>this.tenantForm.get('address').value; */

    this.tenant.address.street = this.tenant.address.addressLine1 + '#' + this.tenant.address.addressLine2;
    // let street=[];
    // street=this.tenant.address.street.split('#');
    if ((this.tenant.address.addressLine1 === "" || this.tenant.address.addressLine1 === null) && (this.tenant.address.addressLine2 === "" || this.tenant.address.addressLine2 === null)) {
      this.tenant.address.street = '#';
    } else if (this.tenant.address.addressLine1 && (this.tenant.address.addressLine2 === "" || this.tenant.address.addressLine2 === null)) {
      this.tenant.address.street = this.tenant.address.addressLine1 + '#';
    } else if ((this.tenant.address.addressLine1 === "" || this.tenant.address.addressLine1 === null) && this.tenant.address.addressLine2) {
      this.tenant.address.street = '#' + this.tenant.address.addressLine2;
    }
    this.tenant.addresses.push(this.tenant.address);
  }

  // back Button
  backButton(elementId) {

    this.tenatFormView = true;
    this.tenantReadModeView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  // Save Tenant Information
  saveTenantInfo() {
    this.showLoaderImage = true;
    let userId = sessionStorage.getItem('userId');
    let beId = sessionStorage.getItem('beId');
    this.tenant.createdBy = userId;
    let stateId = this.tenant['address']['stateId'];
    delete this.tenant['address']['stateName'];
    delete this.tenant['address']['countryName'];
    /* if(stateId == '0'){
      this.tenant['address']['stateId']= '';
    } */
    let city = this.tenant.address
    this.tenant.ownerId = Number(beId);
    if (this.tenant.id === null) {
      this.tenantService.addTenant(this.tenant).subscribe((res) => {
        // this.dynamicRedirection = "../../tenant";
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.tenantFormValidation();
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the unable to connect
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.tenantService.updateTenant(this.tenant).subscribe((res) => {
        // this.dynamicRedirection = "../../tenant";
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.tenantFormValidation();
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // Cancel button
  cancelButton() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.tenantForm.get('name').setErrors({
        pattern: true
      });
    }
  }
  // Reset tenant form
  resetTenantForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.tenant = <Tenant>this.tenantForm.value;
    if (this.tenant.id === null) {
      this.tenantFormValidation();
    }
    else {
      this.tenantFormValidation();
      this.getTenantDetailByTenId(this.tenant.id);
    }
  }

  // goto Tenant List
  gotoTenantList() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  isDisabledMaxUser(user) {
    if (user < this.numberOfUserForCheck) {
      return true;
    } else if (user > this.reminingUser) {
      return true;
    }
    else {
      return false;
    }
  }

  // Page URL field enable/disabled based on checkbox state
  displayMaxUsers(isChecked) {
    if (isChecked.checked) {
      this.tenantForm.get('numberOfUsers').markAsTouched();
      this.tenantForm.get('numberOfUsers').updateValueAndValidity();
      this.tenantForm.get('numberOfUsers').setErrors({
        'required': true
      })
      this.tenantForm.controls["numberOfUsers"].setValidators([Validators.required, Validators.pattern("[0-9]*")]);
      this.isMaxUsers = false;
      this.tenantForm.get('numberOfUsers').enable();
    }
    else {
      this.isMaxUsers = true;
      this.tenantForm.controls['numberOfUsers'].setValue('');
      this.tenantForm.controls["numberOfUsers"].clearValidators();
      this.tenantForm.controls["numberOfUsers"].updateValueAndValidity();
      this.tenantForm.get('numberOfUsers').disable();
    }
  }
  validateInputValue($event) {
    if (this.systemAdmin === "true" || (this.maxUsers === undefined)) {
    }
    else {

      if (this.addEditText === 'Add') {
        if ($event.target.value.length == 0) {
          this.tenantForm.get('numberOfUsers').setErrors({
            'lessThanUser': true
          })
        }
        if ($event.target.value > this.reminingUser) {
          this.tenantForm.get('numberOfUsers').setErrors({
            'lessThanUser': true
          })
        }
        if ($event.target.value.length > 0) {
          $event.target.value.replace(/[^0-9]/g, '')
        }
      } else {
        if (this.maxUsers != this.reminingUserForEdit) {

          if ($event.target.value.length == 0) {
            this.tenantForm.get('numberOfUsers').setErrors({
              'lessThanUserBetween': true
            })
          }
          if ($event.target.value > this.reminingUser) {
            this.tenantForm.get('numberOfUsers').setErrors({
              'lessThanUserBetween': true
            })
          }
          if ($event.target.value < this.numberOfUserForCheck) {
            this.tenantForm.get('numberOfUsers').setErrors({
              'lessThanUserBetween': true
            })
          }
        } else {
          if (this.maxUsers === undefined && this.reminingUserForEdit === undefined) {

          } else {
            this.tenantForm.get('numberOfUsers').setErrors({
              'limiteReached': true
            })
          }
        }
      }
    }
  }


}
