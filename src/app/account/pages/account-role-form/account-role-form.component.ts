import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from '../../../role/model/role';
import { RoleService } from '../../../role/services/role/role.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogService, UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-account-role-form',
  templateUrl: './account-role-form.component.html',
  styleUrls: ['./account-role-form.component.css']
})
export class AccountRoleFormComponent implements OnInit {
  guardRoutingStatus: boolean;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.RoleForm.dirty) {
      if (this.guardRoutingStatus == false) {
        return true;
      } else {
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
  name:any;
  constructor(private roleService: RoleService, private globalService: globalSharedService, private formBuilder: FormBuilder,
    private router: Router, private dialogService: DialogService,
    private route: ActivatedRoute) {
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
    this.name=this.globalService.name;
    // Checking whether clicked new Tenant role and edit Tenant role
    this.roleid = this.globalService.selectedId;
    if (this.roleid == null || this.roleid == undefined) {
      this.addEditText = "Add";
      this.registerForm();
      this.globalService.listOfRow.id = null;
      this.editAccountRole(this.globalService.listOfRow);
    } else if (this.roleid != null) {
      this.addEditText = "Edit";
      this.editAccountRole(this.globalService.listOfRow);
    }
  }


  // Cancel the form
  cancelRoleForm(event: Event) {
    this.globalService.GettingString(this.name);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Reset form
  resetAccountRoleForm() {
    this.globalService.GettingString(this.name);
    this.modelNotification.alertMessage('Warning', 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.globalService.GettingString(this.name);
    this.roleObj = <Role>this.RoleForm.value;
    if (this.roleObj['role'].id === null) {
      this.RoleForm.reset();
    } else {
      this.registerForm();
      this.editAccountRole(this.globalService.listOfRow);
    }
  }

  // Role bind to View
  editAccountRole(role) {
    this.RoleForm.patchValue({
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
      }
    });
  }

  // previewAccountRole
  previewAccountRole() {
    this.globalService.GettingString(this.name);
    this.globalService.listOfRow = null;
    this.roleObj = <Role>this.RoleForm.value.role;
    this.globalService.listOfRow = this.roleObj;
    this.router.navigate(['../accountRolePreview'], { relativeTo: this.route });
    this.guardRoutingStatus = false;
  }

}
