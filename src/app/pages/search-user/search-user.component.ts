import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, UIModalNotificationPage } from 'global';
import { Observable } from 'rxjs';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { Search, User } from 'src/app/model/Search';
import { EncrDecrService } from 'src/app/services/encrDecr/encr-decr.service';
import { SearchUserService } from 'src/app/services/searchUser/search-user.service';
@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.css']
})
export class SearchUserComponent implements OnInit {

  CheckedCheckbox: boolean = false;
  showLoaderImage: boolean = false;
  userDetails: User[] = [];
  isAssign = false;
  heading: string;
  messageFormat: string;
  noRoleCount = 0;



  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.searchForm.dirty) {
      this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
      // returning false will show a confirm dialog before navigating away
    } else {
      return true; // returning true will navigate without confirmation
    }
    return this.dialogService.navigateAwaySelection$;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  webServiceConsumerAppListView = true;
  displayedColumns: string[] = ['select', 'name', 'userName', 'email', 'isAdmin'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  pageSize: number;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  dataSource;
  searchForm: FormGroup;
  dynamicRedirection: string;
  warningFlag: string;
  NoRecordsFound = false;
  serviceConsumerView = false;
  selection = new SelectionModel<User>(true, []);
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: globalSharedService,
    private dialogService: DialogService,
    private searchUserService: SearchUserService,
    private encrDecrService: EncrDecrService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.createSearchForm();
  }

  //Form for search page

  createSearchForm() {
    this.searchForm = this.formBuilder.group({
      searchBox: [, [Validators.required]]
    });
  }
  //save user details method.
  saveUsers() {
    this.showLoaderImage = true;
    let selectedObject = this.selection.selected;
    let user = [];
    let invalidEmail=false;
    selectedObject.forEach(obj => {
      if (!obj.isUserExist || !(obj.roleId == undefined || obj.roleId == null)) {
        let userDetails: User = new User();

        userDetails.firstName = obj.firstName;
        userDetails.lastName = obj.lastName;
        let signOnId= obj.signonId.trim();
        if(signOnId) {
          userDetails.signonId = obj.signonId;
        }else{
          invalidEmail=true;
        }
        let email=obj.email.trim()
        if(email) {
          userDetails.email = obj.email;
        }else{
          invalidEmail=true;
        }
        userDetails.isUserExist = obj.isUserExist;
        userDetails.mobileNumberPrimary = obj.mobileNumberPrimary;
        userDetails.mobileNumberPrimary = obj.mobileNumberPrimary;
        userDetails.isAdmin = obj.isAdmin;
        userDetails.roleId = obj.roleId;
        userDetails.organizationId = parseInt(sessionStorage.getItem("beId"));
        userDetails.password = this.encrDecrService.encryptUsingAES("Password1");
        userDetails.userId = parseInt(sessionStorage.getItem("userId"));
        user.push(userDetails);
      }
    })
    if(invalidEmail==false){
    this.searchUserService.addUser(user).subscribe(res => {
      this.showLoaderImage = false;
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.CheckedCheckbox = false;
      //this.router.navigate(['../'], { relativeTo: this.route });
    },
      (error: any) => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
    }else{
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Please check Email Id/SignOn Id");
    }
  }

  //refresh table -> button in panel heaer
  refreshTableListFunction() {

  }
  redirectTo() {
    this.router.navigate([this.dynamicRedirection]);
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }

  formResetConfirm() {
    this.CheckedCheckbox = false;
    this.noRoleCount = 0;
    this.searchUser();
  }
  resetAssignedSearchForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    this.CheckedCheckbox = false;
    this.noRoleCount = 0;
    this.searchUser();
  }
  cancelAssignedSearchForm(event) {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  formCancelConfirm() {
    this.searchForm.reset();
    let consumerApp = document.getElementById("tenant");
    consumerApp.click();
  }

  // This method used to update checkbox status when it's loaded into the view
  updateCheckboxStatus(nodes) {
    let checkedNodes = nodes.filter((e) => e.isUserExist);
    this.selection = new SelectionModel(true, checkedNodes);
    this.CheckedCheckbox = false;//if all user unseleted still save enable to diasble this.
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows - this.noRoleCount;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.updateCheckboxStatus(this.dataSource.data) : this.dataSource.data.forEach(row => {
      if (row.isAdmin || !(row.roleId == undefined || row.roleId == null)) {
        this.selection.select(row);
        this.CheckedCheckbox = true;
      }
    })
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: User): string {
    if (!row) {
      let row = `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      return row;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  hasCheckedCheckbo(checkbox: MatCheckbox, element) {
    if (element.isUserExist == false) {
      if (!checkbox.checked && (element.noRole == false || (element.noRole == undefined || element.noRole == null))) {
        this.CheckedCheckbox = true;
      } else {
        this.CheckedCheckbox = false;
      }
    }
  }
  searchUser() {
    let samAccountName = this.searchForm.get('searchBox').value;
    let organizationId = parseInt(sessionStorage.getItem("beId"));
    this.searchUserService.getUserByAccountName(organizationId, samAccountName).subscribe(res => {
      this.showLoaderImage = false;
      if (Array.isArray(res) && res.length) {
        this.userDetails = res;
        this.userDetails.forEach(element => {
          if (element.isUserExist) {
            element.checkBoxToolTip = "User already exists in Platform";
          }
        });
        this.userDetails.forEach(element => {
          if (element.roleId) {
            element.isUser = true;
          } else if (!element.isAdmin && (element.roleId == undefined || element.roleId == null)) {
            element.noRole = true;
            element.checkBoxToolTip = "User has No Role";
            this.noRoleCount = this.noRoleCount + 1;
          }
        });
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = this.userDetails;
        this.updateCheckboxStatus(this.dataSource.data);
        this.isAssign = false;
        this.serviceConsumerView = true;
        this.NoRecordsFound = false;
      }
      else {
        this.userDetails = [];
        this.dataSource.data = []
        this.NoRecordsFound = true;
        this.serviceConsumerView = false;
      }
    },
      error => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  //Help method for user name popup
  userNameHelp() {
    this.heading = 'Sample input format to search user'
    this.messageFormat = '<div class="sweatalert-help-block-message">' + 'Sample input format to Search User:' +
      '<br/>&nbsp;&nbsp;&nbsp;1.test-empyreal-001' +
      '<br/>&nbsp;&nbsp;&nbsp;2.test-empyreal*' +
      '<br/>&nbsp;&nbsp;&nbsp;3.*empyreal*' + '</div>'
    this.modelNotification.helpMessage(this.messageFormat);
  }
}
