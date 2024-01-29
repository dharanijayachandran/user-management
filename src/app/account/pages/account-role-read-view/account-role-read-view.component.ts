import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../role/model/role';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-account-role-read-view',
  templateUrl: './account-role-read-view.component.html',
  styleUrls: ['./account-role-read-view.component.css']
})
export class AccountRoleReadViewComponent implements OnInit {

  constructor(private globalService: globalSharedService, private router: Router,
    private route: ActivatedRoute) { }
  role: Role;
  roleId: number
  ngOnInit() {
    this.role = this.globalService.listOfRow;
    this.roleId = this.globalService.listOfRow.id;
  }

  // backButton navigate to form view
  backButton() {
    this.globalService.GettingId(this.roleId);
    this.router.navigate(['../accountRoleForm'], { relativeTo: this.route });
  }

}
