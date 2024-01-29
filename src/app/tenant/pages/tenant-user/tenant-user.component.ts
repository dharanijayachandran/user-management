import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { OwnerUserService } from '../../../user/services/ownerUser/owner-user.service';
import { TenantUserService } from '../../services/tenantUser/tenant-user.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { MatTablePaginatorComponent } from 'src/app/Shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-tenant-user',
  templateUrl: './tenant-user.component.html',
  styleUrls: ['./tenant-user.component.css']
})
export class TenantUserComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  NoRecordsFound = false;
  tenatUserList = true;
  serviceMessage: string;
  alertSuccess = false;
  alertDelete = false;
  confirmAlert = false;
  deleteId: number;

  dataSource: any;
  userListView = true;
  userReadModeView = false;
  roleAssignToUserView = false;
  @Input('tenantValueChild') public roleDetail;

  displayedColumns: string[] = ['id', 'firstName','signonId', 'emailId', 'mobileNumberPrimary', 'status', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  tenantId: number;
  tenantName: any;
  showLoaderImage = true;
  isSearchUserEnabled: boolean;
  signonId: any;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================


  tenantUserName: any;
  addEditText: string;
  maxUserResult: Boolean;
  tenentUserForm: FormGroup;
  constructor(private userService: OwnerUserService, private tenantUserService: TenantUserService,
    private globalService: globalSharedService,
    private router: Router, private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }
  ngOnInit() {
    this.isSearchUserEnabled=JSON.parse(sessionStorage.getItem('isAddNewUserFromAdEnabled'));
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.firstName.toLowerCase().includes(filter) ||
        data.middleName.toLowerCase().includes(filter) ||
        data.lastName.toLowerCase().includes(filter) ||
        data.emailId.toLowerCase().includes(filter) ||
        data.mobileNumberPrimary.toLowerCase().includes(filter) ||
        data.status.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.tenantId = Number(sessionStorage.getItem("userOwnerId"));
    this.tenantName = this.globalService.name;
    this.tenentUserForm = this.formBuilder.group({
      tenentName: [''],
    })
    this.tenentUserForm.patchValue({
      tenentName: this.globalService.name
    })
    this.getTenantUsers();
  }

  // Refresh table
  refreshTableListFunction() {
    this.getTenantUsers();
  }


  ngAfterViewInit() {
  }

  addUser() {
    this.globalService.GettingString(this.tenantName);
    this.checkMaxUsers(Number(this.tenantId));
  }

  checkMaxUsers(tenantId: number) {
    this.userService.checkMaxUsers(tenantId)
      .subscribe(
        res => {
          if (!res) {
            this.tenantUserObject('../tenant', Object, 'mngUser', 'Tenant');
            this.router.navigate(['../tenant/tenantUserForm'], { relativeTo: this.route });
          } else {
            // alert('Max No of Users already created, Please contact Admin');
            this.modelNotification.alertMessage(this.globalService.messageType_Info, 'Maximum number of users already created, please contact administrator.');
          }
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  // Click to View
  clickToView(tenantUserDetail) {
    this.globalService.GettingString(this.tenantName);
    this.tenantUserObject('../tenant', tenantUserDetail, 'mngUser', 'Tenant');
    //=========================================( URL, object, tab,  Header

  }

  updateTenantUserFormView(tenantUserDetail) {
    this.globalService.GettingString(this.tenantName);
    //=========================================( URL, object, tab,  Header
    this.tenantUserObject('../tenant', tenantUserDetail, 'mngUser', 'Tenant');
  }

  viewUserRoleListByUserId(tenantUserDetail) {
    this.globalService.GettingString(this.tenantName);
    this.tenantUserObject('../tenant', tenantUserDetail, 'mngUser', '');
  }

  // Routing and Tenant Object passing
  tenantUserObject(URL, tenantUserDetail, tabname, headerName) {
    //=========================================( URL, object, tab,  Header
    this.globalService.GettingId(tenantUserDetail.id);
    this.globalService.listOfRowDetailForUser(URL, tenantUserDetail, tabname, headerName);
  }

  deleteUser(element) {
    this.deleteId = element.id;
    this.signonId=element.signonId;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Tenant User!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.tenantUserService.deleteTenantUser(this.deleteId, Number(userId),this.signonId).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  getTenantUsers() {
    //let tenantId = sessionStorage.getItem('userOwnerId');
    this.tenantUserObject('../tenant', Object, 'mngUser', 'Tenant')
    this.globalService.setFormName('tenantUserForm');
    this.globalService.setTenantId(Number(this.tenantId));
    this.getUsersByBeTypeAndBeId(Number(this.tenantId));
  }
  getUsersByBeTypeAndBeId(tenantId: number) {
    this.tenantUserService.getUserListByTenantId(tenantId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          let getDataSource = res;
          res.forEach(userData => {
            if (!userData.middleName) {
              userData.middleName = '';
            }
          })
          if (Array.isArray(res) && res.length) {
            this.tenatUserList = true;
            getDataSource = getDataSource.sort((a, b) => b.id - a.id);
            // this.dataSource = new MatTableDataSource();
            this.dataSource.data = getDataSource;

            // To get paginator events from child mat-table-paginator to access its properties
            this.myPaginator = this.myPaginatorChildComponent.getDatasource();
            this.matTablePaginator(this.myPaginator);

            this.dataSource.paginator = this.myPaginator;
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource = new MatTableDataSource();
            this.dataSource.data = res;
          }
        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  //Back Button
  backToTenant() {
    let mngTenant = document.getElementById('mngTenant');
    mngTenant.click();
  }


  /*
  Material table paginator code starts here
*/
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;

  /*
      Material pagination getting pageIndex, pageSize, length through
      events(On change page, Next,Prev, Last, first) */
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }


  /* Load table data always to the Top of the table
  when change paginator page(Next, Prev, Last, First), Page size  */
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  /*
    Material table paginator code ends here
  */
//This method to set form name to use in export-add-search component
tenantOrUser(event){

}

}

