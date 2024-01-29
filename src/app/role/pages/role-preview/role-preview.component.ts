import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { Role } from '../../model/role';
import { RoleService } from '../../services/role/role.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-role-preview',
  templateUrl: './role-preview.component.html',
  styleUrls: ['./role-preview.component.css']
})
export class RolePreviewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;


  roleObj: Role = new Role();
  roleId: number;
  role: Role;
  showLoaderImage = false;
  constructor(private globalService: globalSharedService,
    private roleService: RoleService,
     private router: Router,
     private route:ActivatedRoute) { }

  ngOnInit() {
    this.roleId = this.globalService.listOfRow.id;
  }

  // Save Role
  createRole(): void {
    this.showLoaderImage = true;
    this.role = this.globalService.listOfRow
    let createdBy = sessionStorage.getItem("userId");
    let beId = sessionStorage.getItem("beId");
    let beType = sessionStorage.getItem("beType");
    /* this.role['createdBy'] = createdBy;
    this.role['organizationId'] = Number(beId); */
    this.role.createdBy = Number(createdBy);
    this.role.organizationId = Number(beId);
    this.roleObj['role'] = this.role;
    if (this.roleObj['role'].id == null || this.roleObj['role'].id == undefined) {
      this.roleService.createRoleByBeType(this.roleObj, beType, Number(beId)).subscribe(res => {
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
          // If the unable to connect
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // redirectTo
  redirectTo() {
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  // backButton navigate to form view
  backButton() {
    this.globalService.GettingId(this.roleId);
    this.router.navigate(['../roleForm'],{relativeTo:this.route});
  }

}
