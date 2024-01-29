import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../model/role';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-read-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor(private globalService: globalSharedService, private router: Router,
    private route:ActivatedRoute) { }
  //role: object;
  role:Role;
  roleId: number
  ngOnInit() {
    this.role = this.globalService.listOfRow;
    this.roleId = this.globalService.listOfRow.id;
  }

  // backButton navigate to form view
  backButton() {
    this.globalService.GettingId(this.roleId);
    this.router.navigate(['../roleForm'],{relativeTo:this.route});
  }

}
