import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';


@Component({
  selector: 'app-role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['./role-view.component.css'],
})
export class RoleViewComponent implements OnInit {
  constructor(private router:Router, private globalService: globalSharedService,
    private route:ActivatedRoute ) {
  }
  ngOnInit() {
  }

  // backButton form level
  backButton() {
    this.router.navigate(['../'],{relativeTo:this.route});
  }

}
