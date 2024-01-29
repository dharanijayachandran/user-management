import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { TenantService } from '../../tenant/services/tenant/tenant.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { Address } from 'src/app/Shared/model/Address';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, AfterViewInit, OnDestroy {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  public userDetail: any;
  public pageName = '';
  @ViewChild('redirectTo') dynamicRedirection: ElementRef;
  address: Address ;

  constructor(
    private globalService: globalSharedService, private router: Router, private route: ActivatedRoute,
    private tenantService: TenantService
  ) { }

  ngOnInit() {
    if (this.globalService.listOfRow['id'] != null) {
      // Getting user id to preview and getting perticular user detail from global service
      this.userDetail = this.globalService.listOfRow;
      if (this.userDetail.addresses.length != 0) {
        this.address = this.userDetail.addresses[0];
        if (this.address.street != null) {
          var addressLines = this.address.street.split('#', 2);
          this.address.addressLine1 = addressLines[0];
          this.address.addressLine2 = addressLines[1];
        }
      }
      this.pageName = this.globalService.pageName;
    } else {
      let id;
      this.route.paramMap.subscribe((params: ParamMap) => {
        id = parseInt(params.get('id'));
        if (id) {
          this.pageName = 'Tenant';
          this.getTenantObj(id);
        }
      });
    }
  }


  ngOnDestroy() {
    if (this.globalService.hasOwnProperty('listOfRow')) {
      if (this.globalService.listOfRow.hasOwnProperty('id')) {
        if (this.globalService.listOfRow.id != null) {
          this.globalService.listOfRow = [];
        }
      }
    }
  }

  ngAfterViewInit() {
    this.dynamicRedirection = this.dynamicRedirection.nativeElement.innerText;
  }

  // Getting individual Tenant Object
  getTenantObj(id) {
    this.tenantService.getTenantDetailByTenId(id)
      .subscribe(
        res => {
          this.userDetail = res;
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }


  // Back button
  backButton() {
    this.router.navigate(['../../../' + this.dynamicRedirection], { relativeTo: this.route });
  }

}
