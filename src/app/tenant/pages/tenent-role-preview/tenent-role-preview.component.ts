import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { Role } from '../../../role/model/role';
import { RoleService } from '../../../role/services/role/role.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-tenent-role-preview',
  templateUrl: './tenent-role-preview.component.html',
  styleUrls: ['./tenent-role-preview.component.css']
})
export class TenentRolePreviewComponent implements OnInit {

   // Importing child component to
   @ViewChild(UIModalNotificationPage) modelNotification;

  roleObj: Role = new Role();
  roleId: number;
  role: Role;
  showLoaderImage = false;
  tenantName:any;
  constructor(private globalService: globalSharedService,
    private roleService: RoleService,
    private router: Router, private route:ActivatedRoute) { }

  ngOnInit() {
   this.tenantName= this.globalService.name;
    this.roleId = this.globalService.listOfRow.id;
  }

  // Save Tenant Role
  createTenantRole(): void {
    // alert(this.tenantName);
    this.globalService.GettingString(this.tenantName);
    this.showLoaderImage = true;
    this.role = this.globalService.listOfRow
    let createdBy = sessionStorage.getItem("userId");
    let tenantId = sessionStorage.getItem('userOwnerId');
    let beType = sessionStorage.getItem("beType");
    this.role.createdBy = Number(createdBy);
    this.role.organizationId = Number(tenantId);
    this.roleObj['role'] = this.role;
    if (this.roleObj['role'].id == null || this.roleObj['role'].id == undefined) {
      this.roleService.createRoleByBeType(this.roleObj, beType, Number(tenantId)).subscribe(res => {
        this.showLoaderImage = false;
        // Success response
          this.modelNotification.alertMessage(res['messageType'], res['message']);
          this.globalService.GettingString(this.tenantName);


      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
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

  // redirect to
  redirectTo(){
    this.globalService.GettingString(this.tenantName);
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  // backButton navigate to form view
  backButton() {
    this.globalService.GettingId(this.roleId);
    this.router.navigate(['../tenantRoleForm'],{relativeTo:this.route});
  }
}
