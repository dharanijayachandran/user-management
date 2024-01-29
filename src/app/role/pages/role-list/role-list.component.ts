import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { RoleService } from '../../services/role/role.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { MatTablePaginatorComponent } from 'src/app/Shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  userName = sessionStorage.getItem('userName');
  dataSource: any;
  displayedColumns: string[] = ['id', 'name', 'description', 'action'];
  displayTableHeader = ['S.No.', 'Role Name', 'Description'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  roleId: number;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  noRecordBlock = false;
  saveMenuButton = false;
  showLoaderImage = true;
  constructor(private roleService: RoleService, private router: Router, private globalService: globalSharedService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.showLoaderImage = true;
    this.getRoles();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.description.toLowerCase().includes(filter);
    };
  }

  // Refresh table
  refreshTableListFunction() {
    this.getRoles();
  }

  getRoles() {
    let id = sessionStorage.getItem('beId');
    this.getRolesById(Number(id));
  }


  // Getting all the Roles starts here
  getRolesById(id: number) {
    this.roleService.getRoleListByBeId(id)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          let getDataSource = res;
          res.forEach(role => {
            if (!role.description) {
              role.description = '';
            }
          })
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


  addRoleFormView(event) {
    this.globalService.listOfRow = {};
  }

  // Click to View
  clickToView(roleDetail) {
    this.roleObject(roleDetail);
  }

  // Update role
  updateRoleFormView(roleDetail) {
    this.roleObject(roleDetail);
  }

  // Common function for setting ID and role object
  roleObject(roleDetail) {
    this.globalService.GettingId(roleDetail.id);
    this.globalService.setOrganizationDetail('', roleDetail);
  }


  // navigating to assign menus for particular Role details getting
  @Output() messageEvent = new EventEmitter<string>();
  navigateToRoleMenu(getRoleDetail) {
    // this.globalService.setOrganizationDetail('',getRoleDetail);
    this.messageEvent.emit(getRoleDetail);
    let mngRollMenu = document.getElementById('mngRollMenu');
    mngRollMenu.click();
  }

  // Delete roles
  deleteRole(id: number) {
    this.roleId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Role!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.roleService.deleteOrganizationRole(this.roleId, Number(userId)).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }



  /*
    Download as Excel, PDF, CSV starts here=================================
  */

  // Getting search filter details
  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Role List";
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
    title: 'Role List',
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
    this.fileName = this.globalService.getExportingFileName("Role");

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
