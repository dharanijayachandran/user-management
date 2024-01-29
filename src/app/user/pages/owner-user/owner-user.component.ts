import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerUserService } from '../../services/ownerUser/owner-user.service';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { State } from 'src/app/Shared/model/state';
import { Country } from 'src/app/Shared/model/country';
import { CountryService } from 'src/app/Shared/services/country/country.service';
import { MatTablePaginatorComponent } from 'src/app/Shared/components/mat-table-paginator/mat-table-paginator.component';
import { StateService } from 'src/app/Shared/services/state/state.service';
export class Roles {
  id: number;
}

@Component({
  selector: 'app-owner-user',
  templateUrl: './owner-user.component.html',
  styleUrls: ['./owner-user.component.css']
})
export class OwnerUserComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  dataSource: any;
  data: any;
  displayedColumns: string[] = ['id', 'firstName','signonId', 'emailId','mobileNumberPrimary', 'status', 'edit'];
  displayTableHeader = ['S.No.', 'Name','User Name' ,'Email Id', 'Mobile No', 'Status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  IsAdmin: boolean;
  Admin: string;
  deleteId: number;
  showLoaderImage = true;
  systemAdmin: string;
  isSearchUserEnabled: boolean;
  signonId: any;
  countryList:Country[];
  stateList: State[];
  stateByCountryIdMap = new Map<number, State[]>();
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  userListHeader = sessionStorage.getItem("userName");
  addEditText = '';
  constructor(private router: Router, private globalService: globalSharedService,
    private ownerUserService: OwnerUserService, private stateService: StateService,
    private route: ActivatedRoute, private countryService:CountryService) {
      this.getCountry();
     }
  ngOnInit() {
    this.isSearchUserEnabled=JSON.parse(sessionStorage.getItem('isAddNewUserFromAdEnabled'));
    this.dataSource = new MatTableDataSource();
    this.showLoaderImage = true;
    this.Admin = (sessionStorage.getItem('isAdmin'));
    this.systemAdmin = (sessionStorage.getItem('isSystemAdmin'));
    this.getUsers();
    this.checkForAdmin()
    this.globalService.setFormName('userForm');
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.firstName.toLowerCase().includes(filter) || data.lastName.toLowerCase().includes(filter) || data.middleName.toLowerCase().includes(filter) || data.emailId.toLowerCase().includes(filter) || data.mobileNumberPrimary.toLowerCase().includes(filter) || data.status.toLowerCase().includes(filter) || data.signonId.toLowerCase().includes(filter);
    };
  }

  // Refresh table
  refreshTableListFunction() {
    this.getUsers();
  }

  addUser() {
    let id = sessionStorage.getItem('beId');
    if (this.systemAdmin === "true") {
      this.manageUserObject('../manage-user', Object, 'userList', '');
      this.router.navigate(['../manage-user/manageUserForm'], { relativeTo: this.route });
    } else {
      this.checkMaxUsers(Number(id));
    }
  }

  checkMaxUsers(id: number) {
    this.ownerUserService.checkMaxUsers(id)
      .subscribe(
        res => {
          if (!res) {
            this.manageUserObject('../manage-user', Object, 'userList', '');
            this.router.navigate(['../manage-user/manageUserForm'], { relativeTo: this.route });
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

  @Output() tabName = new EventEmitter<string>();


  // Click to View
  clickToView(manageUserdata) {
    this.manageUserObject('../manage-user', manageUserdata, 'userList', '');
    //=========================================( URL, object, tab,  Header
  }

  updateUserFormView(manageUserdata) {
    this.manageUserObject('../manage-user', manageUserdata, 'userList', '');
    //=========================================( URL, object, tab,  Header
  }

  //To navigate to assigning roles to user
  viewUserRoleListByUserId(manageUserdata) {
    this.tabName.emit('userRole');
    let userRole = document.getElementById('userRole');
    userRole.click();
    this.manageUserObject('../manage-user', manageUserdata, 'userList', '');
    //=========================================( URL, object, tab,  Header
  }


  // Routing and Account Object passing
  manageUserObject(URL, manageUserDetail, tabname, headerName) {
    //=========================================( URL, object, tab,  Header
    this.globalService.GettingId(manageUserDetail.id);
    this.globalService.listOfRowDetailForUser(URL, manageUserDetail, tabname, headerName);
  }

  getUsers() {
    this.manageUserObject('../manage-user', Object, 'userList', '');
    let id = sessionStorage.getItem('beId');
    this.getUsersById(Number(id));
  }
  getUsersById(id: number) {
    this.ownerUserService.getUserListByBeId(id)
      .subscribe(
        res => {
          res.forEach(user => {
            if (!user.middleName) {
              user.middleName = '';
            }
          })
          this.showLoaderImage = false;
          if (this.Admin == "true" || this.systemAdmin == "true") {
            this.getDataSurce(res);
          }
          else {
            this.getDataSurce(this.filterUser(res));
          }

        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);

        });
  }
  /*
  Filtering users
  */
  filterUser(res) {
    res = res.filter(element => {
      if (element.isAdmin == false) {
        return element;
      }
    });
    return res;
  }
  getDataSurce(res) {
    if (Array.isArray(res) && res.length) {
      res = res.sort((a, b) => b.id - a.id);
      // this.dataSource = new MatTableDataSource();
      this.dataSource.data = res;

      // To get paginator events from child mat-table-paginator to access its properties
      this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      this.matTablePaginator(this.myPaginator);

      this.dataSource.paginator = this.myPaginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = res;
    }
  }
  checkForAdmin() {
    if (this.Admin == "true" || this.systemAdmin == "true") {
      return this.IsAdmin = true;
    }
    else {
      return this.IsAdmin = false;
    }
  }

  deleteUser(element) {
    this.deleteId = element.id;
    this.signonId=element.signonId;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this User!');

  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.ownerUserService.deleteOrganizationUser(this.deleteId, Number(userId),this.signonId).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  //This method to set form name to use in export-add-search component
  tenantOrUser(event){
    this.globalService.setFormName('userForm');
    }

  /*
    Download as Excel, PDF, CSV starts here=================================
  */

  // Getting search filter details
  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "User List";
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
    title: 'User List',
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
    this.fileName = this.globalService.getExportingFileName("User");

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

    getCountry(){
      this.countryService.getCountriesList().subscribe(res => {
        this.countryList = res;
        this.countryList= this.globalService.addSelectIntoList(this.countryList);
        this.countryList.forEach(country=>{
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
      this.stateService.getstatesListByCountryId(countryId).subscribe( res => {
        this.stateList = res;
        this.stateList= this.globalService.addSelectIntoList(this.stateList);
        if(this.stateList&&!this.stateByCountryIdMap.has(countryId)){
          this.stateByCountryIdMap.set(+countryId,this.stateList);
        }
      },
        error => {
          //
      });
    }

}

