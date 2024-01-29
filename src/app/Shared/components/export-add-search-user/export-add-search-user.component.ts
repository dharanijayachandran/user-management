import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { OwnerUserService } from 'src/app/user/services/ownerUser/owner-user.service';
import { globalSharedService } from '../../services/global/globalSharedService';

@Component({
  selector: 'app-export-add-search-user',
  templateUrl: './export-add-search-user.component.html',
  styleUrls: ['./export-add-search-user.component.css']
})
export class ExportAddSearchUserComponent implements OnInit {

 // Importing components, directive
 @ViewChild(UIModalNotificationPage) modelNotification;
 @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  systemAdmin: string;
  totaAssignedUsers: number;
  maxUsers: number;
  reminingUsers: number;
  form: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: globalSharedService,
    private ownerUserService: OwnerUserService

  ) { }

  ngOnInit(): void {

  }
  @Output() exportedTo = new EventEmitter();
  tenantOrUser(form){

  }

  addTenant() {
   let form=this.globalService.form;
    if(form=='tenantUserForm'){
   let tenantId= this.globalService.tenantId;
   this.checkMaxTenantUsers(tenantId);
    }else{
      this.systemAdmin=(sessionStorage.getItem('isSystemAdmin'));
      let id = sessionStorage.getItem('beId');
      if (this.systemAdmin === "true") {
        this.router.navigate(['../manage-user/manageUserForm'], { relativeTo: this.route });
      } else {
        this.checkMaxUsers(Number(id));
      }
    }

  }
  checkMaxUserForTenant() {
    if (this.maxUsers > this.totaAssignedUsers) {
      this.reminingUsers = this.maxUsers - this.totaAssignedUsers;
      this.globalService.setReminingUsers(this.reminingUsers);
      this.globalService.setMaxUsers(this.maxUsers);
      this.router.navigate(['../tenant/addTenant'], { relativeTo: this.route });
    } else {
      this.modelNotification.alertMessage(this.globalService.messageType_Info, 'Maximum number of users already created, please contact administrator.');
    }
  }
  searchUser(){
    let form=this.globalService.form;
    if(form=='tenantUserForm'){
      this.router.navigate(['../tenant/search'],{ skipLocationChange: true });
    }else{
      this.router.navigate(['../manage-user/search'],{ skipLocationChange: true });
    }

  }

  checkMaxUsers(id: number) {
    this.ownerUserService.checkMaxUsers(id)
      .subscribe(
        res => {
          if (!res) {
            this.router.navigate(['../manage-user/manageUserForm'], { relativeTo: this.route });
          } else {
            // alert('Max No of Users already created, Please contact Admin');
            this.modelNotification.alertMessage(this.globalService.messageType_Info, 'Maximum number of users already created, please contact administrator.');
          }
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  checkMaxTenantUsers(tenantId: number) {
    this.ownerUserService.checkMaxUsers(tenantId)
      .subscribe(
        res => {
          if (!res) {
            this.router.navigate(['../tenant/tenantUserForm'], { relativeTo: this.route });
          } else {
            // alert('Max No of Users already created, Please contact Admin');
            this.modelNotification.alertMessage(this.globalService.messageType_Info, 'Maximum number of users already created, please contact administrator.');
          }
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }
}
