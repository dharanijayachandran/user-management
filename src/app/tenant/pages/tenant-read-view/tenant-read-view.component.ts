import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { Role } from 'src/app/role/model/role';

@Component({
  selector: 'app-tenant-read-view',
  templateUrl: './tenant-read-view.component.html',
  styleUrls: ['./tenant-read-view.component.css']
})
export class TenantReadViewComponent implements OnInit {

  constructor(private globalService: globalSharedService, private router: Router,
    private route: ActivatedRoute) { }
  role: Role;
  roleId: number;
  tenantName:any;
  ngOnInit() {
    this.tenantName=this.globalService.name;
    this.role = this.globalService.listOfRow;
    this.roleId = this.globalService.listOfRow.id;
    this.globalService.GettingString(this.tenantName);
  }

  // backButton navigate to form view
  backButton() {
    this.globalService.GettingId(this.roleId);
    this.router.navigate(['../tenantRoleForm'], { relativeTo: this.route });
  }


}
