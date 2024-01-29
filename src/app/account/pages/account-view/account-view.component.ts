import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ExcelService, PdfService, ScrollbarDirective, UIModalNotificationPage } from 'global';
import { TenantService } from '../../../tenant/services/tenant/tenant.service';
import { OwnerUserService } from '../../../user/services/ownerUser/owner-user.service';
import { Account } from '../../model/account';
import { AccountService } from '../../services/account/account.service';
import { MatTablePaginatorComponent } from 'src/app/Shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  serviceMessage: string;
  alertSuccess = false;
  alertDelete = false;
  confirmAlert = false;
  deleteId: number;
  showLoaderImage = true;
  dataSource: any;
  displayedColumns: string[] = ['id', 'name', 'emaild', 'mobileNumberPrimary', 'status', 'edit'];
  displayTableHeader = ['S.No.', 'Name', 'Email Id', 'Mobile No', 'Status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  maxUsers = 0;
  reminingUsers: number;
  sizeOfUsers = 0;
  systemAdmin: string;
  assignedAccountUsers = 0;
  assignedTenantUsers = 0;
  totalAssignedUsers = 0;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================


  //pageSettings = pageSettings;

  accountListHeader = sessionStorage.getItem("accountOwnerName");
  accountForm: FormGroup;
  private account: Account;
  href: any;
  accountView = true;
  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder, private globalService: globalSharedService,
    private router: Router,
    private route: ActivatedRoute,
    private tenantService: TenantService,
    private ownerUserService: OwnerUserService,
    private excelService: ExcelService, private pdfService: PdfService) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.emaild.toLowerCase().includes(filter) || data.mobileNumberPrimary.toLowerCase().includes(filter) || data.status.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.systemAdmin = (sessionStorage.getItem('isSystemAdmin'));
    this.getUsersByBId();
    // this.getTenants();
    this.getTenantUsersList();
    this.getBusinessEntityById();
    this.getAllAccounts();
  }

  // Refresh table
  refreshTableListFunction() {
    this.getAllAccounts();
  }



  ngAfterViewInit() {
  }
  getAccountListByTenId(id: number) {
    this.accountService.getAccountListByTId(id)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          let getDataSource = res;
          this.getNumberUsersAssigned(res);
          if (Array.isArray(res) && res.length) {
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
  getNumberUsersAssigned(res: Account[]) {
    res.forEach(obj => {
      this.assignedAccountUsers = this.assignedAccountUsers + parseInt(obj.numberOfUsers);
    })
    this.assignedNumberOfUsers(this.assignedTenantUsers, this.assignedAccountUsers, this.sizeOfUsers);
  }
  assignedNumberOfUsers(assignedTenantUsers: number, assignedAccountUsers: number, sizeOfUsers: number) {
    this.totalAssignedUsers = assignedTenantUsers + assignedAccountUsers + sizeOfUsers;
  }
  getTenantUsersList() {
    let organizationId = sessionStorage.getItem("beId");
    this.tenantService.getTenantListByOrganizationId(Number(organizationId))
      .subscribe(
        res => {
          res.forEach(obj => {
            this.assignedTenantUsers = this.assignedTenantUsers + obj.numberOfUsers;
          })
        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
  }

  deleteAccount(id: number) {
    this.deleteId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Account!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    let beType = 'ACCOUNT';
    this.accountService.deleteAccount(this.deleteId, Number(userId), beType).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  getAllAccounts() {
    let selId = sessionStorage.getItem('beId');
    this.getAccountListByTenId(Number(selId));
  }

  // Click to View
  clickToView(accountDetail) {
    this.router.navigate(['../account/view', accountDetail.id], { relativeTo: this.route });
    this.accountObject('Account', accountDetail);
  }

  // Click to Assing menu
  @Output() messageEvent = new EventEmitter<string>();
  @Output() tabName = new EventEmitter<string>();


  viewAccountMenuListByAccId(accountDetail) {
    this.tabName.emit('mngMenu');
    this.accountObject('Account', accountDetail);
    let menuList = document.getElementById('mngMenu');
    menuList.click();
  }

  viewAccountRoleListByAccId(id: number, name: string) {
    this.tabName.emit('mngRole');
    sessionStorage.setItem('userOwnerId', id.toString());
    this.globalService.GettingString(name);
    let myTab = document.getElementById('mngRole');
    myTab.click();
  }

  viewAccountUserListByAccId(id: number, name: string) {
    this.globalService.GettingString(name);
    this.tabName.emit('mngUser')
    sessionStorage.setItem('userOwnerId', id.toString());
    let myTab = document.getElementById("mngUser");
    /* sessionStorage.setItem('userOwnerName', "List of user for account: " + name.toString()); */
    myTab.click();
  }
  // Routing and Account Object passing
  accountObject(URL, accountDetail) {
    // this.router.navigate([URL, accountDetail.id]);
    this.globalService.setOrganizationDetail('Account', accountDetail);
  }

  addAccount() {
    if ((this.systemAdmin == "true" || this.maxUsers == undefined)) {
      this.router.navigate(['../account/addAccount'], { relativeTo: this.route });
    } else {
      this.checkMaxUser();
    }
  }
  checkMaxUser() {
    if (this.maxUsers > this.totalAssignedUsers) {
      this.reminingUsers = this.maxUsers - this.totalAssignedUsers;
      this.globalService.setReminingUsers(this.reminingUsers);
      this.globalService.setMaxUsers(this.maxUsers);
      this.router.navigate(['../account/addAccount'], { relativeTo: this.route });
    } else {
      this.modelNotification.alertMessage(this.globalService.messageType_Info, 'Maximum number of users already created, please contact administrator.');
    }
  }

  getBusinessEntityById() {
    let organizationId = sessionStorage.getItem("beId");
    this.tenantService.getBusinessEntityByBId(Number(organizationId)).subscribe(
      res => {
        this.maxUsers = res.numberOfUser;
      }

    );
  }
  getUsersByBId() {
    let organizationId = sessionStorage.getItem("beId");
    this.ownerUserService.getUserListByBeId(Number(organizationId))
      .subscribe(
        res => {
          this.sizeOfUsers = res.length;
        }
      );
  }

  updateAccountFormView(accountDetail) {
    if ((this.systemAdmin == "true" || this.maxUsers == undefined)) {
      this.accountObject('../addAccount', accountDetail);
      //  this.globalService.GettingId(id);
      this.globalService.setNumberOfUsers(accountDetail)
    } else {
      this.checkMaxUserForEdit(accountDetail);
    }
    //this.globalService.GettingId(id);
    this.globalService.setNumberOfUsers(accountDetail)
    //
  }
  checkMaxUserForEdit(accountDetail) {
    if (this.maxUsers > this.totalAssignedUsers) {
      this.reminingUsers = this.maxUsers - this.totalAssignedUsers;
      this.globalService.setReminingUsers(this.reminingUsers);
      this.globalService.setMaxUsers(this.maxUsers);
      this.accountObject('../addAccount', accountDetail);
    } else {
      if (this.maxUsers === this.totalAssignedUsers || this.maxUsers < this.totalAssignedUsers) {
        this.globalService.setReminingUsers(this.maxUsers);
        this.globalService.setMaxUsers(this.maxUsers);
        this.accountObject('../addAccount', accountDetail);
      }
    }
  }


  /*
     Download as Excel, PDF, CSV starts here=================================
   */

  // Getting search filter details
  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Account List";
  tableBodyDataList;
  fileName: string;

  xlsxOptions = {
    headers: this.displayTableHeader
  }

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Account List',
    useBom: true,
    noDownload: false,
    headers: this.displayTableHeader
  };

  downloadFile(fileType) {

    // Search filter details
    this.searchFilterKeysValues = Object.entries(this.searchFilterObject);

    this.searchFieldsContainer = {
      "searchFilterKeysValues": this.searchFilterKeysValues,
      "searchCriteriaText": this.searchCriteriaText
    }

    // Make new set of re-create object
    this.tableBodyDataList = this.globalService.reCreateNewObject(this.dataSource.data, this.displayedColumns);


    // S.No.
    this.tableBodyDataList = this.globalService.serialNumberGenerate(this.tableBodyDataList);

    // Make Array object into Arrays
    this.tableBodyDataList = this.tableBodyDataList.map(object => {
      return this.globalService.removeLastIndexAtArray(object);
    });

    // CSV/PDF/Excel file name
    this.fileName = this.globalService.getExportingFileName("Account");

    let exportFile = {
      "fileName": this.fileName,
      "excelWorkSheetName": this.exportedFileTitleName,
      "title": this.exportedFileTitleName,
      "tableHeaderNames": this.xlsxOptions.headers,
      'tableBodyData': this.tableBodyDataList
    }

    // Final download
    this.globalService.downloadFile(fileType, exportFile, this.searchFieldsContainer,
      this.tableBodyDataList, this.fileName, this.csvOptions);

  }

  /*
  Download as Excel, PDF, CSV ends here=================================
*/


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
