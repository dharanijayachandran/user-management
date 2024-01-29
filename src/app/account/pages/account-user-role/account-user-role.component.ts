import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { RoleService } from '../../../role/services/role/role.service';
import { AccountRoleService } from '../../services/accountRole/account-role.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-account-user-role',
  templateUrl: './account-user-role.component.html',
  styleUrls: ['./account-user-role.component.css']
})
export class AccountUserRoleComponent implements OnInit, AfterViewInit {


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  public userDetail;
  accountUserId: any;
  accountUserName: any;
  public pageName = '';
  warningFlag: string;
  showLoaderImage = false;
  accountName: any;
  constructor(private accountRoleService: AccountRoleService, private roleService: RoleService,
    private router: Router, private globalService: globalSharedService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.accountName = this.globalService.name;
    if (this.globalService.userDetails.id != null) {
      // Getting user id to get tenant roles
      this.userDetail = this.globalService.userDetails;
      this.accountUserId = this.userDetail['id'];
      this.pageName = this.globalService.pageName;
      this.showLoaderImage = true;
      this.getAccountRolesList();
      this.getRoleListConfirmed();
    }
  }

  // Refresh
  refreshTableListFunction() {
    this.getAccountRolesList();
    this.getRoleListConfirmed();
  }

  ngAfterViewInit() {
  }

  roleList = [];

  getAccountRolesList() {
    let accountId = Number(sessionStorage.getItem("userOwnerId"));
    this.accountRoleService.getAllRolesForParticularAccount("ACCOUNT", accountId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          //
          this.roleList = res;
          this.doReset();
          this.roleMovedByUser = false;
          this.saveButtonDisableStatus = true;
        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  _selected_role = [];
  confirmedList = [];

  //Getting selected roles(confirmed)
  getRoleListConfirmed() {
    let returnObj = [];
    this.roleService.getRoleListSelected("ACCOUNT", this.accountUserId).subscribe(res => {
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

  // Save Account role to User
  SaveAccountRoleAssignToUser() {
    //
    this.showLoaderImage = true;
    let assignRoles = {
      "accountUserId": this.accountUserId,
      "createdBy": this.createdBy,
      "roleIds": this.getAssinedRoles()
    }

    //
    let listOfRoles = this.globalService.roleList;
    if (listOfRoles != null && listOfRoles.length != 0) {
      this.accountRoleService.updateAccountRoleToUser(assignRoles)
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
    } else {
      this.accountRoleService.assignAccountRoleToUser(assignRoles)
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
    this.globalService.GettingString(this.accountName);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  //CancelRoles --------------navigate to user list view
  CancelRoles() {
    if (this.roleMovedByUser) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else this.formCancelConfirm();
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.globalService.GettingString(this.accountName)
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  resetRoleForm() {
    if (this.roleMovedByUser) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else this.formResetConfirm();
  }
  // Checkbox reset  confirm
  formResetConfirm() {
    this.getAccountRolesList();
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
