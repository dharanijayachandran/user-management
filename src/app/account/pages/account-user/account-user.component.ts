import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { OwnerUserService } from '../../../user/services/ownerUser/owner-user.service';
import { AccountUserService } from '../../services/accountUser/account-user.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { MatTablePaginatorComponent } from 'src/app/Shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-account-user',
  templateUrl: './account-user.component.html',
  styleUrls: ['./account-user.component.css']
})
export class AccountUserComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  deleteServiceMessage: string;
  alertSuccess = false;
  alertDelete = false;
  confirmAlert = false;
  deleteId: number;
  noRecordBlock = false;
  dataSource: any;
  userListView = true;
  showLoaderImage = true;
  accountUserForm: FormGroup;
  accountName: any;

  displayedColumns: string[] = ['id', 'firstName', 'emailId', 'mobileNumberPrimary', 'status', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  userListHeader = sessionStorage.getItem("userOwnerName");

  @Input('accountValueChild') public roleDetail;

  constructor(private userService: OwnerUserService, private globalService: globalSharedService,
    private accountUserService: AccountUserService, private router: Router, private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.firstName.toLowerCase().includes(filter) ||
        data.lastName.toLowerCase().includes(filter) ||
        data.middleName.toLowerCase().includes(filter) ||
        data.emailId.toLowerCase().includes(filter) ||
        data.mobileNumberPrimary.toLowerCase().includes(filter) ||
        data.status.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.accountName = this.globalService.name;
    this.accountUserForm = this.formBuilder.group({
      accountName: [''],
    })
    this.accountUserForm.patchValue({
      accountName: this.globalService.name
    })
    this.getAccountUsers();
  }

  // Refresh table
  refreshTableListFunction() {
    this.getAccountUsers();
  }

  getAccountUsers() {
    let accountId = sessionStorage.getItem('userOwnerId');
    this.getUsersByBeTypeAndBeId(Number(accountId));
  }
  // To get all Account user list
  getUsersByBeTypeAndBeId(accountId: number) {
    this.accountUserService.getUserListByAccountId(accountId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          let getDataSource = res;
          res.forEach(account => {
            if (!account.middleName) {
              account.middleName = '';
            }
          })
          if (Array.isArray(res) && res.length) {
            getDataSource = getDataSource.sort((a, b) => b.id - a.id);
            //this.dataSource = new MatTableDataSource();
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

  addUser() {
    this.globalService.GettingString(this.accountName);
    let accountId = sessionStorage.getItem('userOwnerId');
    this.checkMaxUsers(Number(accountId));

  }

  checkMaxUsers(accountId: number) {
    this.userService.checkMaxUsers(accountId)
      .subscribe(
        res => {
          if (!res) {
            this.accountUserObject('../account', Object, 'mngUser', 'Tenant');
            this.router.navigate(['../account/acountUserForm'], { relativeTo: this.route });
          }
          else {
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
  clickToView(accountUserDetail) {
    this.globalService.GettingString(this.accountName);
    //=========================================( URL,object , tab,  Header
    this.accountUserObject('../account', accountUserDetail, 'mngUser', 'Account');
  }

  updateAccountUserFormView(accountUserDetail) {
    this.globalService.GettingString(this.accountName);
    //=========================================( URL, object , tab,  Header
    this.accountUserObject('../account', accountUserDetail, 'mngUser', 'Account');
  }

  // Assign role to Account user starts here============================
  viewUserRoleListByUserId(accountUserDetail) {
    this.globalService.GettingString(this.accountName)
    //=========================================( URL, object , tab,  Header
    this.accountUserObject('../account', accountUserDetail, 'mngUser', 'Account');
  }

  // Routing and Account Object passing
  accountUserObject(URL, accountUserDetail, tabname, headerName) {
    //=========================================( URL, Boject, tab,  Header
    this.globalService.GettingId(accountUserDetail.id);
    this.globalService.listOfRowDetailForUser(URL, accountUserDetail, tabname, headerName);
  }

  deleteUser(id: number) {
    this.deleteId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Account User!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.accountUserService.deleteAccountUser(this.deleteId, Number(userId)).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  //Back Button
  backToAccount() {
    let mngAccAccount = document.getElementById('mngAccAccount');
    mngAccAccount.click();
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

}
