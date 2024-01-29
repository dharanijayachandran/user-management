import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-tenant-role-view',
  templateUrl: './tenant-role-view.component.html',
  styleUrls: ['./tenant-role-view.component.css']
})
export class TenantRoleViewComponent implements OnInit {
name:any;
  constructor(private router:Router,private globalService: globalSharedService,
    private route:ActivatedRoute) {
  }
  ngOnInit() {
    this.name=this.globalService.name;

  }

  // backButton form level
  backButton() {
    this.globalService.GettingString(this.name);
    this.router.navigate(['../'],{relativeTo:this.route});
  }
}
