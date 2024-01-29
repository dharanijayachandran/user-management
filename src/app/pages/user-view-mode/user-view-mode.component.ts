import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantUser } from '../../tenant/model/tenantUser';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-user-view-mode',
  templateUrl: './user-view-mode.component.html',
  styleUrls: ['./user-view-mode.component.css']
})
export class UserViewModeComponent implements OnInit, AfterViewInit {

  public userDetail: TenantUser;
  public user = '';
  @ViewChild('redirectTo') dynamicRedirection: ElementRef;
  pageName: string;
  accountName: any;

  constructor(private globalService: globalSharedService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.accountName = this.globalService.name;
    // Getting user id to preview and getting perticular user detail
    this.userDetail = this.globalService.userDetails;
    if (this.userDetail.street != null) {
      var streets = this.userDetail.street.split('#', 2);
      this.addressValidation(streets);
    }

    // Removing time part from date
    if (this.userDetail.dateOfBirth != null || this.userDetail.dateOfBirth != undefined) {
      let dateOfBirth = this.userDetail.dateOfBirth;
      dateOfBirth = dateOfBirth.split(' ')[0];
      this.userDetail.dateOfBirth = dateOfBirth;
    }

    //Gender conversion
    if (this.userDetail.gender === 'M') {
      this.userDetail.gender = this.userDetail.gender.replace('M', 'Male')
    } else if (this.userDetail.gender === 'F') {
      this.userDetail.gender = this.userDetail.gender.replace('F', 'Female')
    } else if (this.userDetail.gender === 'T') {
      this.userDetail.gender = this.userDetail.gender.replace('T', 'Trans-Gender')
    }

    this.pageName = this.globalService.pageName;
  }
  addressValidation(streets: string[]) {
    var streetsAddress: string[] = [];
    for (let i = 0; i < streets.length; i++) {
      if (streets[i] === "null") {
        streetsAddress[i] = "";
      } else {
        streetsAddress[i] = streets[i];
      }
    }
    /* this.userDetail.street = streetsAddress[0];
    this.userDetail.userAddress2 = streetsAddress[1]; */
    this.userDetail.street = streetsAddress[0];
    if (streetsAddress.length != 1) {
      this.userDetail.userAddress2 = streetsAddress[1];
    } else {
      this.userDetail.userAddress2 = '';
    }

  }

  ngAfterViewInit() {
  }

  // Back button
  backButton() {
    this.globalService.GettingString(this.accountName);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
