import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { RoleService } from '../../../role/services/role/role.service';
import { TenantRoleService } from '../../services/tenantRole/tenant-role.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-tenant-user-role',
  templateUrl: './tenant-user-role.component.html',
  styleUrls: ['./tenant-user-role.component.css']
})
export class TenantUserRoleComponent implements OnInit, AfterViewInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  tenantUserId: any;
  public userDetail;
  public pageName = '';
  getBetype = sessionStorage.getItem("beType");
  getBeId = sessionStorage.getItem("beId");
  beId = Number(this.getBeId);
  warningFlag: string;
  showLoaderImage = false;
  tenantName:any;

  constructor(private tenantRoleService: TenantRoleService, private roleService: RoleService,
    private globalService: globalSharedService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.globalService.userDetails.id != null) {
      this.tenantName=this.globalService.name;
      // Getting user id to get tenant roles
      this.userDetail = this.globalService.userDetails;
      this.tenantUserId = this.userDetail['id'];
      this.pageName = this.globalService.pageName;
      this.showLoaderImage = true;
      this.getTenantRolesList();
      this.getRoleListConfirmed();
    }

  }

  // Refresh
  refreshTableListFunction() {
    this.getTenantRolesList();
    this.getRoleListConfirmed();
  }

  ngAfterViewInit() {
  }

  roleList = [];
  getTenantRolesList() {
    let tenantId = Number(sessionStorage.getItem("userOwnerId"));
    this.tenantRoleService.getAllRolesForParticularTenant(this.getBetype, tenantId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          this.roleList = res;
          this.doReset();
          this.roleMovedByUser = false;
          this.saveButtonDisableStatus = true;
        },
        error => {
          this.showLoaderImage = false;
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  _selected_role = [];
  confirmedList = [];

  //Getting selected roles(confirmed)
  getRoleListConfirmed() {
    let returnObj = [];
    this.roleService.getRoleListSelected(this.getBetype, this.tenantUserId).subscribe(res => {
      this.showLoaderImage = false;
      this.confirmedList = res;
      this.globalService.setRoleList(this.confirmedList);
      this.confirmedList.map(function (o) {
        let Obj = {
          "id": o["roleId"],
          "roleName": o["roleName"],
          "status": o["status"],
        }
        returnObj.push(Obj);
      });
      this.confirmedList = returnObj;
      this.doReset();
    },
      error => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
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
  //format: any = DualListComponent.DEFAULT_FORMAT;
  format = {
    all: "Select all",
    none: "Deselect all",
    add: 'Available Roles',
		remove: 'Assigned/Selected Roles',
  }

  private sourceRoles: Array<any>;

  private confirmedRoles: Array<any>;

  // arrayType = [
  // 	{ name: 'Rio Grande', detail: '(object array)', value: 'station' }
  // ];

  // type = this.arrayType[0].value;

  private roleLabel(item: any) {
    return item.name;
  }

  private rolesObject() {
    this.key = "id";
    this.display = this.roleLabel;
    this.keepSorted = true;
    this.source = this.sourceRoles;
    this.confirmed = this.confirmedRoles;
  }

  // swapSource() {
  // 	switch (this.type) {
  // 	case this.arrayType[0].value:
  // 		this.rolesObject();
  // 		break;
  // 	}
  // }

  doReset() {
    this.sourceRoles = JSON.parse(JSON.stringify(this.roleList));
    this.confirmedRoles = JSON.parse(JSON.stringify(this.confirmedList));
    this.rolesObject();
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
    //this.format.direction = this.sourceLeft ? DualListComponent.LTR : DualListComponent.RTL;
  }


  // Roles Id retrieving
  getAssinedRoles() {
    let roleIds = [];
    this.confirmed.map(function (ob) {
      if (ob.id != "null" || ob.id != undefined) {
        ob['id'] = ob.id;
        roleIds.push(ob['id']);
      }
    })
    return roleIds;
  }


  getCreatedBy = sessionStorage.getItem("userId");
  createdBy = Number(this.getCreatedBy);

  // Save Tenant role to User
  SaveTenantRoleAssignToUser() {
    this.showLoaderImage = true;
    //
    this.globalService.GettingString(this.tenantName);
    let assignRoles = {
      "tenantUserId": this.tenantUserId,
      "createdBy": this.createdBy,
      "roleIds": this.getAssinedRoles()
    }
    let listOfRoles = this.globalService.roleList;
    if (listOfRoles != null && listOfRoles.length != 0) {
      this.tenantRoleService.updateTenantRoleToUser(assignRoles)
        .subscribe(
          res => {
            this.showLoaderImage = false;
            // Success response
            this.modelNotification.alertMessage(res['messageType'], res['message']);
          },
          error => {
            this.showLoaderImage = false;
            // If the service is not available
            this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
          });
    }
    else {
      this.tenantRoleService.assignTenantRoleToUser(assignRoles)
        .subscribe(
          res => {
            this.showLoaderImage = false;
            // Success response
            this.modelNotification.alertMessage(res['messageType'], res['message']);
          },
          error => {
            this.showLoaderImage = false;
            // If the service is not available
            this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
          });

    }

  }

  // redirectTo
  redirectTo() {
    this.globalService.GettingString(this.tenantName);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  //CancelRoles --------------navigate to user list view
  CancelRoles() {
    this.globalService.GettingString(this.tenantName);
    if (this.roleMovedByUser) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else this.formCancelConfirm();

  }

  // Confirm redirect to
  formCancelConfirm() {
    this.globalService.GettingString(this.tenantName);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  resetRoleForm() {
    this.globalService.GettingString(this.tenantName);
    if (this.roleMovedByUser) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else this.formResetConfirm();

  }

  // Checkbox reset  confirm
  formResetConfirm() {
    this.getTenantRolesList();
    this.getRoleListConfirmed();
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }

  // If roles tragged/selected by user
  roleMovedByUser: boolean = false;
  saveButtonDisableStatus: boolean;
  getRoleMovedByUser(event) {
    this.roleMovedByUser = true;
    if (event.length) this.saveButtonDisableStatus = false; else this.saveButtonDisableStatus = true;
  }
}
