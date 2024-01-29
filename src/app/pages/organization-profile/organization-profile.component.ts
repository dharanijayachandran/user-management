import { Component, OnInit, ViewChild } from '@angular/core';
import { OrganizationProfile } from '../../model/organizationProfile';
import { OrganizationProfileService } from '../../services/organization-profile/organization-profile.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { Address } from 'src/app/Shared/model/Address';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.css']
})
export class OrganizationProfileComponent implements OnInit {

  // Importing child component to
  showLoaderImage = false;
  organizationProfile: OrganizationProfile = new OrganizationProfile();
  organizationAddress: Address;
  noRecordsFound = false;
  organizationDetail = false;
  constructor(private organizationProfileService: OrganizationProfileService, private globalService: globalSharedService) {

  }

  ngOnInit() {
    this.showLoaderImage = true;
    let beId = sessionStorage.getItem("beId");
    this.getOrganizationProfile(Number(beId));
  }

  getOrganizationProfile(id: number) {
    this.organizationProfileService.getOrganizationProfileById(id)
      .subscribe(
        res => {
            this.showLoaderImage=false;
            if (Object.keys(res).length === 0) {
              this.noRecordsFound = true;
              this.organizationDetail = false;
            } else {
              this.noRecordsFound = false;
              this.organizationDetail = true;
              this.organizationProfile = res;
              if (this.organizationProfile.addresses.length != 0) {
                this.organizationAddress = this.organizationProfile.addresses[0];
                if (this.organizationAddress.street != null) {
                  var addressLines = this.organizationAddress.street.split('#', 2);
                  this.organizationAddress.addressLine1 = addressLines[0];
                  this.organizationAddress.addressLine2 = addressLines[1];
                }
              }
            }
        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
        });
  }

}
