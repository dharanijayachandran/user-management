import { Component, OnInit, ViewChild } from '@angular/core';
import { UIModalNotificationPage } from 'global';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../services/application/application.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-tenant-assign-applications',
  templateUrl: './tenant-assign-applications.component.html',
  styleUrls: ['./tenant-assign-applications.component.css']
})
export class TenantAssignApplicationsComponent implements OnInit {

  @ViewChild(UIModalNotificationPage) modelNotification;
  getBetype = sessionStorage.getItem("beType");
  getBeId = sessionStorage.getItem("beId");
  beId = Number(this.getBeId);
  public userDetail;
  showLoaderImage = false;
  warningFlag: string;
  applicationList = [];
  public pageName = '';
  applicationId: any;
  status: any;
  applicationName: any;
  tenantUserId: any;
  selectedItems: any;
  id: any;
  tenantName: any;
  tenantId: any;

  constructor(private globalService: globalSharedService, private router: Router, private route: ActivatedRoute, private applicationService: ApplicationService) { }

  ngOnInit(): void {

    this.showLoaderImage = true;
    this.pageName = this.globalService.pageName;
    this.tenantName = this.globalService.assignApplicationTenantName;
    this.tenantId = this.globalService.assignApplicationTenantId;
    this.getApplicationAssigntoUser();
    this.getConfirmApplication();
  }

  tab = 1;
  keepSorted = true;
  key: string;
  display: any;
  filter = true;
  source: Array<any>;
  confirmed: Array<any>;
  userAdd = '';
  disabled = false;
  sourceLeft = true;
  format = {
    all: "Select all",
    none: "Deselect all",
    add: 'Available Applications',
    remove: 'Assigned/Selected Application',
  }

  private sourceApplication = [];
  private confirmedApplication = [];

  _selected_role = [];
  confirmedList = [];
  createdBy = sessionStorage.getItem("userId");

  //Cancel button
  CancelApplication() {
    if (this.applicationMovedByUser) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else this.formCancelConfirm();
  }
  formCancelConfirm() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Refersh
  refreshTableListFunction() {
    this.formResetConfirm()
  }

  // Reset button
  resetApplicationForm() {
    if (this.applicationMovedByUser) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else this.formResetConfirm();
  }

  formResetConfirm() {
    this.source.length = 0;
    this.confirmed.length = 0;
    this.getApplicationAssigntoUser();
    this.getConfirmApplication();
  }

  redirectTo() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    }
    else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }

  // Available Application
  getApplicationAssigntoUser() {
    let organizationId = sessionStorage.getItem('beId');
    let isSystemAdmin = sessionStorage.getItem('isSystemAdmin');
    this.applicationList = [];
    this.applicationService.getAllApplicationList(organizationId,isSystemAdmin).subscribe(res => {
      this.showLoaderImage = false;
      this.applicationList = res;
      this.doResetLeft();

      this.applicationMovedByUser = false;
      this.saveButtonDisableStatus = true;
    },
      error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  //Assigned Application
  getConfirmApplication() {
    this.confirmedList = [];
    this.applicationService.getAssignedApplicationList(this.globalService.assignApplicationTenantId).subscribe(res => {
      this.showLoaderImage = false;
      this.confirmedList = res;
      this.doResetRight();
    },
  error => {
    this.showLoaderImage = false;
    this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
  });
  }

  private applicationLabel(item: any) {
    return item.applicationName;
  }

  private applicationObject() {
    this.key = "applicationId";
    this.display = this.applicationLabel;
    this.keepSorted = true;
    this.source = this.sourceApplication;
    this.confirmed = this.confirmedApplication;
  }

  doReset() {
    this.sourceApplication = JSON.parse(JSON.stringify(this.sourceApplication));
    this.confirmedApplication = JSON.parse(JSON.stringify(this.confirmedApplication));
    this.applicationObject();
  }

  doResetLeft() {
    let isSystemAdmin = sessionStorage.getItem('isSystemAdmin');
    if (this.applicationList.length > 0 && isSystemAdmin == 'true') {
      this.applicationList.forEach(data => {
        let sourceObject = {
          id: data.id,
          status: data.status,
          applicationId: data.id,
          applicationName: data.name
        }
        this.sourceApplication.push(sourceObject);
      });
      this.doReset();
    }
    if(this.applicationList.length > 0 && isSystemAdmin == 'false'){
      this.applicationList.forEach(data => {
        let sourceObject = {
          id: data.id,
          status: data.status,
          applicationId: data.applicationId,
          applicationName: data.application.name
        }
        this.sourceApplication.push(sourceObject);
      });
      this.doReset();
    }
  }

  doResetRight() {
    if (this.confirmedList.length > 0) {
      this.confirmedList.forEach(data => {
        if (null != data.application) {
          let confirmedObject = {
            id: data.id,
            status: data.status,
            applicationId: data.applicationId,
            applicationName: data.application.name
          }
          this.confirmedApplication.push(confirmedObject);
        }
      });
      this.doReset();
    }
  }

  doDelete() {
    if (this.source.length > 0) {
      this.source.splice(0, 1);
    }
  }
  doCreate() {
    if (typeof this.source[0] === 'object') {
      const o = {};
      o[this.key] = this.source.length + 1;
      o[this.display] = this.userAdd;
      this.source.push(o);
    } else {
      this.source.push(this.userAdd);
    }
    this.userAdd = '';
  }
  doAdd() {
    for (let i = 0, len = this.source.length; i < len; i += 1) {
      const o = this.source[i];
      const found = this.confirmed.find((e: any) => e === o);
      if (!found) {
        this.confirmed.push(o);
        break;
      }
    }
  }
  doRemove() {
    if (this.confirmed.length > 0) {
      this.confirmed.splice(0, 1);
    } else {
    }
  }
  doFilter() {
    this.filter = !this.filter;
  }

  filterBtn() {
    return (this.filter ? 'Hide Filter' : 'Show Filter');
  }

  doDisable() {
    this.disabled = !this.disabled;
  }

  disableBtn() {
    return (this.disabled ? 'Enable' : 'Disabled');
  }

  swapDirection() {
    this.sourceLeft = !this.sourceLeft;
  }

  getAssinedApplication() {
    let applicationId = [];
    this.confirmed.map(function (ob) {
      if (ob.id != "null" || ob.id != undefined) {
        ob['id'] = ob.applicationId;
        applicationId.push(ob['id']);
      }
    })
    return applicationId;
  }

  // Save And Update
  SaveTenantApplicationAssignToUsers() {
    this.showLoaderImage = true;

    let listOfApplication = this.globalService.applicationList;
    if (listOfApplication != null && listOfApplication.length != 0) {
      let editObj = {
        applicationIds: this.getAssinedApplication(),
        updatedBy: this.createdBy
      }
      this.applicationService.updateTenantApplicationAssignToUser(editObj, this.tenantId).subscribe(res => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        error => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
    }
    else {
      let saveObj = {
        applicationIds: this.getAssinedApplication(),
        createdBy: this.createdBy,
        status: "A"
      }
      this.applicationService.SaveTenantApplicationAssignToUser(saveObj, this.tenantId).subscribe(res => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        error => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        })
    }
  }

  applicationMovedByUser: boolean = false;
  saveButtonDisableStatus: boolean;
  getApplicationMovedByUser(event) {
    this.applicationMovedByUser = true;
    if (event.length) this.saveButtonDisableStatus = false; else this.saveButtonDisableStatus = true;
  }
}
