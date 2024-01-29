import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService, PdfService, ScrollbarDirective, UIModalNotificationPage } from 'global';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../../account/services/account/account.service';
import { OwnerUserService } from '../../../user/services/ownerUser/owner-user.service';
import { Tenant } from '../../model/tenant';
import { TenantService } from '../../services/tenant/tenant.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { State } from 'src/app/Shared/model/state';
import { StateService } from 'src/app/Shared/services/state/state.service';
import { CountryService } from 'src/app/Shared/services/country/country.service';
import { MatTablePaginatorComponent } from 'src/app/Shared/components/mat-table-paginator/mat-table-paginator.component';
@Component({
  selector: 'app-tenant-view',
  templateUrl: './tenant-view.component.html',
  styleUrls: ['./tenant-view.component.css'],
  providers: [
    NgbTabset
  ]
})
export class TenantViewComponent implements OnInit, AfterViewInit {

  // Importing components, directive
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  // Page Reload, Maximize=================
  expand = false;
  reload = false;
  checked = false;
  collapse = false;
  remove = false;
  showFooter = false;
  closeResult: string;
  // Page Reload, Maximize=================

  serviceMessage: string;
  alertSuccess = false;
  alertDelete = false;
  confirmAlert = false;
  resultsLength = 0;
  NoRecordsFound = false;
  apiurl = environment.baseUrl_OrganizationManagement;
  dataSource: MatTableDataSource<any>;
  showLoaderImage = true;
  assignedTenantUser = 0;
  displayedColumns: string[] = ['id', 'name', 'emaild', 'mobileNumberPrimary', 'status', 'edit'];
  displayTableHeader = ['S.No.', 'Name', 'Email Id', 'Mobile No', 'Status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;



  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  assignedAccountUser: number;
  totaAssignedUsers = 0;
  maxUsers = 0;
  reminingUsers: number;
  sizeOfUsers = 0;
  systemAdmin: string;
  isSearchUserEnabled: string;
  countryList = [];
  stateList = [];
  stateByCountryIdMap = new Map<number, State[]>();
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  tenantForm: FormGroup;
  private tenant: Tenant = new Tenant();
  deleteTenantUser: number;
  tenantName: any;

  constructor(private tenantService: TenantService,
    private formBuilder: FormBuilder,
    public tabset: NgbTabset,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: globalSharedService,
    private accountService: AccountService,
    private ownerUserService: OwnerUserService,
    private excelService: ExcelService, private pdfService: PdfService,
    private countryService: CountryService, private stateService: StateService) {
    this.getCountry();
  }
  ngOnInit() {
    this.isSearchUserEnabled = JSON.parse(sessionStorage.getItem('isSearchUserEnabled'));
    this.tenantName = this.globalService.name;
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.emaild.toLowerCase().includes(filter) || data.mobileNumberPrimary.toLowerCase().includes(filter) || data.status.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.systemAdmin = (sessionStorage.getItem('isSystemAdmin'));
    //  this.getCountry();
    this.getUsersByBId();
    this.getNumberUsersAssignedForAccounts();
    this.getTenants();
    this.getBusinessEntityById();
  }

  ngAfterViewInit() {
  }

  // Refresh table
  refreshTableListFunction() {
    this.getTenants();
  }


  // Click to View
  clickToView(tenantDetail) {
    this.tenantObject('../tenant/view', tenantDetail);
  }

  //click to assign application
  viewUserRoleListByUserId(tenantId, tenantName) {
    this.globalService.assignApplicationTenantName = tenantName;
    this.globalService.assignApplicationTenantId = tenantId;
  }

  // Click to edit
  UpdateTenant(tenantDetail) {
    if ((this.systemAdmin == "true" || this.maxUsers == undefined)) {
      this.tenantObject('../tenant/addTenant', tenantDetail);
    } else {
      this.checkMaxUserForEdit(tenantDetail);
    }
  }

  checkMaxUserForEdit(tenantDetail) {
    if (this.maxUsers > this.totaAssignedUsers) {
      this.reminingUsers = this.maxUsers - this.totaAssignedUsers;
      this.globalService.setReminingUsers(this.reminingUsers);
      this.globalService.setMaxUsers(this.maxUsers);
      this.tenantObject('../tenant/addTenant', tenantDetail);
    } else {
      if (this.maxUsers === this.totaAssignedUsers || this.maxUsers < this.totaAssignedUsers) {
        this.globalService.setReminingUsers(this.maxUsers);
        this.globalService.setMaxUsers(this.maxUsers);
        this.tenantObject('../tenant/addTenant', tenantDetail);
      }
    }
  }

  // Click to Assign Menus
  // To navigate to assign tenant menus
  @Output() messageEvent = new EventEmitter<string>();
  @Output() tabName = new EventEmitter<string>();

  viewTenantMenuListByTenId(tenantDetail) {
    this.messageEvent.emit(tenantDetail);
    this.tabName.emit('mngMenu');
    let menuList = document.getElementById('mngMenu');
    menuList.click();
  }

  viewTenantRoleListByTenId(id: number, name: string) {
    this.tabName.emit('mngRole');
    sessionStorage.setItem('userOwnerId', id.toString());
    this.globalService.GettingString(name);
    let myTab = document.getElementById('mngRole');
    myTab.click();
  }
  // Click to Manage User
  viewTenantUserListByTenId(id: number, name: string) {
    this.tabName.emit('mngUser');
    sessionStorage.setItem('userOwnerId', id.toString());
    this.globalService.GettingString(name);
    let myTab = document.getElementById('mngUser');
    myTab.click();
  }

  // Routing and Tenant Object passing
  tenantObject(URL, tenantDetail) {
    // this.router.navigate([URL, tenantDetail.id],{relativeTo:this.route});
    this.globalService.setOrganizationDetail('Tenant', tenantDetail);
  }

  getTenants() {
    let organizationId = sessionStorage.getItem("beId");
    this.tenantService.getTenantListByOrganizationId(Number(organizationId))
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
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }
  getNumberUsersAssigned(res: Tenant[]) {
    res.forEach(obj => {
      if (!isNaN(obj.numberOfUsers)) {
        this.assignedTenantUser = this.assignedTenantUser + obj.numberOfUsers;
      }
    })
    this.assignedNumberOfUsers(this.assignedTenantUser, this.assignedAccountUser, this.sizeOfUsers);
  }
  assignedNumberOfUsers(assignedTenantUser: number, assignedAccountUser: number, sizeOfUsers: number) {
    if (isNaN(assignedAccountUser)) {
      assignedAccountUser = 0;
    }
    this.totaAssignedUsers = assignedTenantUser + assignedAccountUser + sizeOfUsers;
    this.globalService.setTotalAssignedUsers(this.totaAssignedUsers);
  }
  getNumberUsersAssignedForAccounts() {
    this.assignedAccountUser = 0;
    let organizationId = sessionStorage.getItem("beId");
    this.accountService.getAccountListByTId(Number(organizationId))
      .subscribe(
        res => {
          res.forEach(element => {
            this.assignedAccountUser = this.assignedAccountUser + parseInt(element.numberOfUsers);
          });
        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }


  deleteTenant(id) {
    this.deleteTenantUser = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Tenant!');
  }


  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    let beType = 'TENANT';
    this.tenantService.deleteTenant(this.deleteTenantUser, Number(userId), beType).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  addTenant() {
    this.globalService.GettingString(this.tenantName);
    if ((this.systemAdmin == "true" || this.maxUsers == undefined)) {
      this.router.navigate(['../tenant/addTenant'], { skipLocationChange: true });
    } else {
      this.checkMaxUser();
    }

  }
  checkMaxUser() {
    if (this.maxUsers > this.totaAssignedUsers) {
      this.reminingUsers = this.maxUsers - this.totaAssignedUsers;
      this.globalService.setReminingUsers(this.reminingUsers);
      this.globalService.setMaxUsers(this.maxUsers);
      this.router.navigate(['../tenant/addTenant'], { relativeTo: this.route });
    } else {
      this.modelNotification.alertMessage(this.globalService.messageType_Info, 'Maximum number of users already created, please contact administrator.');
    }
  }

  getBusinessEntityById() {
    let organizationId = sessionStorage.getItem("beId");
    this.tenantService.getBusinessEntityByBId(Number(organizationId)).subscribe(
      res => {
        this.maxUsers = res.numberOfUser;
        this.globalService.setMaxUsersLimit(this.maxUsers);
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
  //This method to set form name to use in export-add-search component
  tenantOrUser(event) {

  }

  /*
     Download as Excel, PDF, CSV starts here=================================
   */

  // Getting search filter details
  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Tenant List";
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
    title: 'Tenant List',
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
    this.fileName = this.globalService.getExportingFileName("Tenant");

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

  getCountry() {
    this.countryService.getCountriesList().subscribe(res => {
      this.countryList = res;
      this.countryList = this.globalService.addSelectIntoList(this.countryList);
      this.countryList.forEach(country => {
        this.getStateByCountryId(country.id);
      })
      this.globalService.setStateByCountryIdMap(this.stateByCountryIdMap);
      this.globalService.setCountrys(this.countryList);
    },
      error => {
        //
      });
  }

  getStateByCountryId(countryId) {
    this.stateService.getstatesListByCountryId(countryId).subscribe(res => {
      this.stateList = res;
      this.stateList = this.globalService.addSelectIntoList(this.stateList);
      if (this.stateList && !this.stateByCountryIdMap.has(countryId)) {
        this.stateByCountryIdMap.set(+countryId, this.stateList);
      }
    },
      error => {
        //
      });
  }
}

