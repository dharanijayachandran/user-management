import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { Role } from '../../../role/model/role';
import { RoleService } from '../../../role/services/role/role.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-account-role-preview',
  templateUrl: './account-role-preview.component.html',
  styleUrls: ['./account-role-preview.component.css']
})
export class AccountRolePreviewComponent implements OnInit {

    // Importing child component to
    @ViewChild(UIModalNotificationPage) modelNotification;

  roleObj: Role = new Role();
  roleId: number;
  role: Role;
  showLoaderImage = false;
  accountName:any;
  constructor(private globalService: globalSharedService,
    private roleService: RoleService,
    private router: Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.accountName=this.globalService.name;
    this.roleId = this.globalService.listOfRow.id;
  }

  // Save Account Role
  createAccountRole(): void {
    this.globalService.GettingString(this.accountName);
    this.showLoaderImage = true;
    this.role = this.globalService.listOfRow
    let createdBy = sessionStorage.getItem("userId");
    let accountId = sessionStorage.getItem('userOwnerId');
    let beType = sessionStorage.getItem("beType");
    this.role.createdBy = Number(createdBy);
    this.role.organizationId = Number(accountId);
    this.roleObj['role'] = this.role;
    if (this.roleObj['role'].id == null || this.roleObj['role'].id == undefined) {
      this.roleService.createRoleByBeType(this.roleObj, beType, Number(accountId)).subscribe(res => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.roleService.updateRole(this.roleObj).subscribe(res => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
           // If the service is not available
           this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // redirectTo
  redirectTo(){
    this.globalService.GettingString(this.accountName);
    this.router.navigate(['../'],{relativeTo:this.route});
  }


  // backButton navigate to form view
  backButton() {
    this.globalService.GettingId(this.roleId);
    this.router.navigate(['../accountRoleForm'],{relativeTo:this.route});
  }

}
