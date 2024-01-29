import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-account-role-view',
  templateUrl: './account-role-view.component.html',
  styleUrls: ['./account-role-view.component.css']
})
export class AccountRoleViewComponent implements OnInit {
  name:any;

  constructor(private router:Router,
    private route:ActivatedRoute,
    private globalService:globalSharedService) {
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
