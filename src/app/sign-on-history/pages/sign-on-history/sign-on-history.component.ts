import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { signOnHistoryDetails } from '../../model/signonhistory';
import { UserHistoryService } from '../../user-history.service';
import { globalSharedService, ScrollbarDirective, UIModalNotificationPage } from 'global';
import { Observable } from 'rxjs';
import { MatTablePaginatorComponent } from 'src/app/Shared/components/mat-table-paginator/mat-table-paginator.component';
@Component({
  selector: 'app-sign-on-history',
  templateUrl: './sign-on-history.component.html',
  styleUrls: ['./sign-on-history.component.css']
})
export class SignOnHistoryComponent implements OnInit {
  dataSource:any;
  showspecificUser:boolean=false;
  showCurrentLoggedInUser:boolean=false;
  selectedUserName:any;
  signOnHistory: FormGroup;
  inter: NodeJS.Timeout;
  showLoaderImage: boolean = false;
  noRecordFound : boolean = false;
  displayedUserColumns = ['slno', 'user', 'signontime'];
  displayColumns = ['slno','signontime','signouttime'];
  sendUserData: FormGroup;
  signOnHistoryPage: signOnHistoryDetails;
  minDate: { month: number; day: number; year: number; };
  todayDate: { month: number; day: number; year: number; };
  endDate: { month: number; day: number; year: number; };
  curDate: string;
  validateTime = false;
  btnDisabled = true;
  validateEndTime: boolean;
  field:any;
  dropDownData:any;
  userActivity=[];
  formatResponse:any;
  filteredOptions: Observable<string[]>;
  public allowFiltering: boolean = true;
  public filterBarPlaceholder: string = 'Search...';
  public height: string = '200px';
  public sortDropDown:string ='Ascending';
  displayTableHeader=['User Name' , 'SignOn Time', 'SignOut Time'];
  displayedColumns = ['value', 'signonTimeStamp', 'signoutTimeStamp'];
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  constructor(private formBuilder: FormBuilder, private userHistoryService: UserHistoryService,private globalService: globalSharedService) {
  }
  ngOnInit() {
    this.btnDisabled = true;
    this.onLoadFormValidation();
    this.getUserName();
  }
  onLoadFormValidation() {
    this.signOnHistory = this.formBuilder.group({
      user: ['',Validators.required],
      startDate: ['',Validators.required],
      endDate: ['',Validators.required],
      startTime: ['',Validators.required],
      endTime: ['',Validators.required],
      targetTimeZone: ['']
    });
    this.sendUserData = this.formBuilder.group({
      userId: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      targetTimeZone: ['']
    })
    this.signOnHistory.controls['endDate'].valueChanges.subscribe(data => {
      if (!data || (typeof data === 'string' && data.length == 0)) {
        this.signOnHistory.patchValue({
          endDate: null
        }, { emitEvent: false });
      }
    });
    this.signOnHistory.controls['startDate'].valueChanges.subscribe(data => {
      if (!data || (typeof data === 'string' && data.length == 0)) {
        this.signOnHistory.patchValue({
          startDate: null
        }, { emitEvent: false });
      } else {
      }
    });
    this.patchDates();
    this.futureDateDisabled();
  }
  getUserName() {
    this.setFormEndTimeValue();
    let beId = sessionStorage.getItem('beId');
    this.userHistoryService.getUserListByBeId(Number(beId)).subscribe(response => {
          this.dataSource = response;
            this.formatResponse=this.getFormattedUsersList(response);
           this.dropDownData = this.formatedResponse(this.formatResponse);
   })}
   setFormEndTimeValue(){
    const input = document.getElementById('startTime') as HTMLInputElement | null;
    const value = input?.value;
    let endTimeSet = this.signOnHistory.value.endTime;
    endTimeSet = new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    this.signOnHistory.patchValue({
      startTime:value,
      endTime: endTimeSet
    })
  }
  dropDownUserName(dropDownData) {
    this.selectedUserName=dropDownData.itemData.text;
     this.btnDisabled = false;
   }
  initializeValues(){
    this.dataSource=[];
    this.field=[];
    this.userActivity=[];
  }
    getpaginatorDataSource(res) {
        this.dataSource.data = res;
        this.myPaginator = this.myPaginatorChildComponent.getDatasource();
        this.matTablePaginator(this.myPaginator);
        this.dataSource.paginator = this.myPaginator;
    }
    getFormattedUsersList(data){
        const that = this;
        return data.map(function (l) {
          return {
            id: l.id,
            name: l.value,
          };
        });
    }
     formatedResponse(response) {
    return this.dropDownData = {
      dataSource: response,
      value: 'id',
      text: 'name',
    };
  }
  showCurrentSignOnUser(event) {
    this.showspecificUser=false;
    this.showCurrentLoggedInUser=true;
    this.initializeValues();
    let id = sessionStorage.getItem('beId');
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.showLoaderImage = true;
    this.userHistoryService.getCurrentSignOnUser(Number(id),String(targetTimeZone)).subscribe(responseData => {
    this.noRecordFound=false;
    this.showLoaderImage = false;
    responseData.forEach(data => {
        let userData=new signOnHistoryDetails();
         if (data.userName!=null) {
          userData.value=data.userName;
          userData.userId=data.userId;
          userData.signonTimeStamp=data.signonTimeStamp;
          userData.signoutTimeStamp=data.signoutTimeStamp;
         this.userActivity.push(userData)
         }
        this.field=this.userActivity;
        this.dataSource=this.field;
        if(undefined != this.dataSource){
          this.getpaginatorDataSource(this.field);
          }
      })
      if(responseData.length==0){
        this.noRecordFound=true;
        this.showLoaderImage = false;
        this.dataSource=0;
      }
    },
    error => {
      this.showLoaderImage = false;
      this.noRecordFound=true;
      console.log(error);
    })
  }
  getUserSignonHistory(event) {
    let selectedUserId=this.signOnHistory.value.user;
    this.showLoaderImage = true;
    this.getSingleUserSignOnHistory(selectedUserId)
  }
  getFieldData(field){
    this.selectedUserName=field.value;
    this.getSingleUserSignOnHistory(field.userId)
  }
  getSingleUserSignOnHistory(selectedUserId){
    this.showLoaderImage = true;
    this.initializeValues();
    this.showCurrentLoggedInUser=false;
    this.showspecificUser=true;
    let id = sessionStorage.getItem('beId');
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let startDate = this.fetchStartDateFromPicker();
    let endDate = this.fetchEndDateFromPicker();
    let startDaySet = Date.parse(startDate + ' ' + this.signOnHistory.value.startTime);
    let EndDaySet = Date.parse(endDate + ' ' + this.signOnHistory.value.endTime);
    this.sendUserData.patchValue({
      userId: selectedUserId,
      startDate: startDaySet,
      endDate: EndDaySet
    })
    this.userHistoryService.getSignOnHistory(Number(id),Number(selectedUserId),Number(startDaySet),Number(EndDaySet),String(targetTimeZone)).subscribe(historyData => {
      this.field=historyData;
      historyData.forEach(data => {
      this.showLoaderImage = false;
       this.noRecordFound=false;
        let userData=new signOnHistoryDetails();
        if ( data.userName!=null) {
          userData.value=data.userName;
          userData.userId=data.userId;
          userData.signonTimeStamp=data.signonTimeStamp;
          userData.signoutTimeStamp=data.signoutTimeStamp;
           this.selectedUserName=data.userName;
         this.userActivity.push(userData)
        }
        this.field=this.userActivity;
        this.dataSource=this.field;
        if(undefined != this.dataSource){
          this.getpaginatorDataSource(this.field);
          }
      })
      if(historyData.length==0){
        this.noRecordFound=true;
        this.showLoaderImage = false;
        this.dataSource=0;
      }
  },
  error => {
    this.showLoaderImage = false;
      this.noRecordFound=true;
      console.log(error);
  })
  }
  refreshTableListFunction() {
    this.getUserName();
  }
  patchDates() {
    let endDate = new Date();
    let startDate = formatDate(endDate, 'MM/dd/yyyy', 'en');
    let arrayDate = startDate.split('/');
    let fullDate = {
      month: parseInt(arrayDate[0]),
      day: parseInt(arrayDate[1]),
      year: parseInt(arrayDate[2])
    }
    this.signOnHistory.patchValue({
      startDate: fullDate,
      endDate: fullDate,
    })
  }
  futureDateDisabled() {
    this.curDate = formatDate(new Date(), 'MM/dd/yyyy', 'en');
    let fullDate = this.curDate.split('/');
    this.todayDate =
    {
      month: parseInt(fullDate[0]),
      day: parseInt(fullDate[1]),
      year: parseInt(fullDate[2])
    }
    this.minDate = this.todayDate;
    this.endDate = this.todayDate
  }
  addMinDateValue() {
    let startDate = this.fetchStartDateFromPicker();
    if (null != startDate) {
      let fullDate = startDate.split('/');
      this.minDate =
      {
        month: parseInt(fullDate[0]),
        day: parseInt(fullDate[1]),
        year: parseInt(fullDate[2]),
      }
    }
  }
  endTime = new FormControl('endTime', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    return null;
  });
  startTime = new FormControl('startTime', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    return null;
  });
  fetchStartDateFromPicker() {
    if (null != this.signOnHistory.value.startDate) {
      let newYrs = this.signOnHistory.value.startDate.year;
      let newDay = this.signOnHistory.value.startDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.signOnHistory.value.startDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let reqDate = newMon + '/' + newDay + '/' + newYrs;
      return reqDate;
    }
  }
  validateFromDate() {
    let startDay = this.signOnHistory.value.startDate.day;
    let endDay = this.signOnHistory.value.endDate.day;
    if (startDay > endDay) {
      this.signOnHistory.patchValue({
        startDate: this.fetchStartDateFromPicker()
      }, { emitEvent: false });
    }
    let endMonth = this.signOnHistory.value.endDate.month;
    let startMonth = this.signOnHistory.value.startDate.month;
    if (endMonth > startMonth) {
      this.signOnHistory.patchValue({
        startDate: this.fetchStartDateFromPicker()
      }, { emitEvent: false });
    }
  }
  changeStartDate(event: any) {
    this.validateStartAndEndTime('startTime');
  }
  changeEndDate(event: any) {
    this.validateStartAndEndTime('endTime');
  }
  validateStartAndEndTime(id: any) {
    this.resetTimeValidationControlls()
    let startDate = this.fetchStartDateFromPicker()
    let endDate = this.fetchEndDateFromPicker()
    if (startDate === endDate) {
      this.signOnHistoryPage = <signOnHistoryDetails>this.signOnHistory.value
      let startTime = this.signOnHistoryPage.startTime
      let endTimeTime = this.signOnHistoryPage.endTime
      let strtHr, strtMin, endHr, endMin
      if (startTime.length != 0) {
        let startTimeArray = startTime.split(':')
        strtHr = parseInt(startTimeArray[0]);
        strtMin = parseInt(startTimeArray[1]);
      }
      if (endTimeTime.length != 0) {
        let endTimeTimeArray = endTimeTime.split(':')
        endHr = parseInt(endTimeTimeArray[0]);
        endMin = parseInt(endTimeTimeArray[1]);
      }
      if (id == 'startTime') {
        if (strtHr >= endHr) {
          if (strtMin >= endMin) {
            this.validateTime = true
            this.signOnHistory.controls['startTime'].markAsTouched();
            this.signOnHistory.controls['startTime'].updateValueAndValidity();
            this.signOnHistory.controls['startTime'].setErrors({
              'required': true
            })
          } if (strtHr > endHr) {
            this.validateTime = true
            this.signOnHistory.controls['startTime'].markAsTouched();
            this.signOnHistory.controls['startTime'].updateValueAndValidity();
            this.signOnHistory.controls['startTime'].setErrors({
              'required': true
            })
          }
        }
      }
      else if (id == 'endTime') {
        if (strtHr >= endHr) {
          if (strtMin >= endMin) {
            this.validateEndTime = true
            this.signOnHistory.controls['endTime'].markAsTouched();
            this.signOnHistory.controls['endTime'].updateValueAndValidity();
            this.signOnHistory.controls['endTime'].setErrors({
              'required': true
            })
          } if (strtHr > endHr) {
            this.validateEndTime = true
            this.signOnHistory.controls['endTime'].markAsTouched();
            this.signOnHistory.controls['endTime'].updateValueAndValidity();
            this.signOnHistory.controls['endTime'].setErrors({
              'required': true
            })
          }
        }
      }
    }
  }
  fetchEndDateFromPicker() {
    if (null != this.signOnHistory.value.endDate) {
      let newDay = this.signOnHistory.value.endDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.signOnHistory.value.endDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.signOnHistory.value.endDate.year;
      let reqDate = newMon + '/' + newDay + '/' + newYrs;
      return reqDate;
    }
  }
  resetTimeValidationControlls() {
    this.validateTime = false;
    this.validateEndTime = false;
    this.signOnHistory.controls['startTime'].markAsUntouched()
    this.signOnHistory.controls['startTime'].markAsPristine()
    this.signOnHistory.controls['startTime'].updateValueAndValidity();
    this.signOnHistory.controls['endTime'].markAsUntouched()
    this.signOnHistory.controls['endTime'].markAsPristine()
    this.signOnHistory.controls['endTime'].updateValueAndValidity();
  }
  validateFromStartFromEndDate() {
    let date = this.fetchEndDateFromPicker()
    if (null != date) {
      let fullDate = date.split('/');
      this.endDate =
      {
        month: parseInt(fullDate[0]),
        day: parseInt(fullDate[1]),
        year: parseInt(fullDate[2]),
      }
      this.addMinDateValue();
    }
  }
  //Download PDF,Excel,CSV option

  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Sign-on Activity of User";
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
    title: 'Sign-on Activity of User',
    useBom: true,
    noDownload: false,
    headers: this.displayTableHeader
  };
  downloadFile(fileType) {
    this.searchFilterKeysValues = Object.entries(this.searchFilterObject);
    this.searchFieldsContainer = {
      "searchFilterKeysValues": this.searchFilterKeysValues,
      "searchCriteriaText": this.searchCriteriaText
    }
    this.tableBodyDataList = this.globalService.reCreateNewObject(this.dataSource.data, this.displayedColumns);
    this.tableBodyDataList = this.tableBodyDataList.map(object => Object.values(object));
    this.fileName = this.globalService.getExportingFileName("User");
    let exportFile = {
      "fileName": this.fileName,
      "excelWorkSheetName": this.exportedFileTitleName,
      "title": this.exportedFileTitleName,
      "tableHeaderNames": this.xlsxOptions.headers,
      'tableBodyData': this.tableBodyDataList
    }
    this.globalService.downloadFile(fileType, exportFile, this.searchFieldsContainer,
      this.tableBodyDataList, this.fileName, this.csvOptions);
  }
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }
  resetForm(){
     this.field=[];
    this.userActivity=[];
    this.dataSource=[];
    this.dropDownData=[];
    this.ngOnInit();
  }
}

