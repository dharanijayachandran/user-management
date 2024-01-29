import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogService, UIModalNotificationPage } from 'global';
// Guard dialog box
import { Role } from '../../../role/model/role';
import { RoleService } from '../../../role/services/role/role.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';


@Component({
  selector: 'app-tenant-role-form',
  templateUrl: './tenant-role-form.component.html',
  styleUrls: ['./tenant-role-form.component.css']
})
export class TenantRoleFormComponent implements OnInit {
  guardRoutingStatus: boolean;
  tenantName:any;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.RoleForm.dirty) {
      if(this.guardRoutingStatus == false){
        return true;
      }else{
        this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
        // returning false will show a confirm dialog before navigating away
      }
    } else {
      return true; // returning true will navigate without confirmation
    }
    return this.dialogService.navigateAwaySelection$;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  RoleForm: FormGroup;
  roleObj: Role = new Role();
  roleid: number;
  addEditText: string;
  warningFlag: string;
  constructor(private roleService: RoleService, private globalService: globalSharedService, private formBuilder: FormBuilder,
    private router: Router,
    private dialogService: DialogService,
    private route:ActivatedRoute) {
    this.registerForm();
  }

  registerForm() {
    this.RoleForm = this.formBuilder.group({
      role: this.formBuilder.group({
        id: [null],
        createdBy: [],
        name: ['', [
          Validators.required,
          Validators.pattern(this.globalService.getNamePattern())]],
        description: ['']
      })
    });
  }

  ngOnInit() {
    this.tenantName=this.globalService.name;
    // Checking whether clicked new Tenant role and edit Tenant role
    this.roleid = this.globalService.selectedId;
    if (this.roleid == null || this.roleid == undefined) {
      this.addEditText = "Add";
      this.registerForm();
      this.globalService.listOfRow.id = null;
      this.editTenantRole(this.globalService.listOfRow);
    } else if (this.roleid != null) {
      this.addEditText = "Edit";
      this.editTenantRole(this.globalService.listOfRow);
    }
  }



  // Cancel the form
  cancelRoleForm(event: Event) {
    this.globalService.GettingString(this.tenantName);
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  // Reset form
  resetTenantRoleForm() {
    this.globalService.GettingString(this.tenantName);
    this.modelNotification.alertMessage('Warning', 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.globalService.GettingString(this.tenantName);
    this.roleObj = <Role>this.RoleForm.value;
    if (this.roleObj['role'].id === null) {
      this.RoleForm.reset();
    } else {
      this.registerForm();
      this.editTenantRole(this.globalService.listOfRow);
    }
  }

  // Role bind to View
  editTenantRole(role) {
    this.RoleForm.patchValue({
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
      }
    });
  }

  // previewTenantRole
  previewTenantRole() {
    this.globalService.GettingString(this.tenantName);
    this.globalService.listOfRow = null;
    this.roleObj = <Role>this.RoleForm.value.role;
    this.globalService.listOfRow = this.roleObj;
    this.router.navigate(['../tenantRolePreview'],{relativeTo:this.route});
    this.globalService.GettingString(this.tenantName);

    this.guardRoutingStatus = false;
  }

}
