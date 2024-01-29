import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Salutation } from '../../model/Salutation';
import { SalutationService } from '../../services/salutation/salutation.service';
import { formatDate } from "@angular/common";
import { TenantUserService } from '../../tenant/services/tenantUser/tenant-user.service';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { StateService } from 'src/app/Shared/services/state/state.service';
import { State } from 'src/app/Shared/model/state';
import { CountryService } from 'src/app/Shared/services/country/country.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, AfterViewInit,OnDestroy {

  @Input('group') user: FormGroup

  salutationId: Salutation[] = [];
  //Getting all country names
  countryList: any[] = [];

  //Getting all state names based on country id
  public selectedCountry;
  stateList: any[] = [];

  selectedValue: number;
  curDate: string;
  isDisabled: false;
  todayDate: { year: number; month: number; day: number; };
  minDate ={year: new Date().getUTCFullYear()-100,month: 12, day: 31}
  isEditable: boolean;
  checkEmail: boolean;
  emailId: string;

  public countryFields: Object = {
    text: 'name',
    value: 'id'
  };
  public stateFields: Object = {
    text: 'name',
    value: 'id'
  };
  public salutationFields: Object = {
    text: 'name',
    value: 'id'
  };
 // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(this.countryList, query);
  }

  public onFilteringState: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(this.stateList, query);
  }
  public onFilteringSalutation: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(this.salutationList, query);
  }


  public sort:string ='Ascending';
  countryId:any;
  stateId:any;
  // set the placeholder to DropDownList input element
  public countryWaterMark: string = 'Select Country';
  public salutationWaterMark: string = 'Select Salutation';
  // set the placeholder to DropDownList input element
  public stateWaterMark: string = 'Select State';
  // set the placeholder to filter search box input element
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;
  salutationList: any[];
  stateByCountryIdMap: Map<number, State[]>;

  constructor(private globalService: globalSharedService, private tenantUserService: TenantUserService, private salutationService: SalutationService, private countryService: CountryService, private stateService: StateService) {
    this.futureDateDisabled();
  }

  ngOnInit() {
    this.emailId=this.globalService.emailId;
  }
  ngOnDestroy(){
    this.globalService.emailId='';
  }

  ngAfterViewInit() {
    this.getSalutations();
    this.getCountry();
    this.validateIsAdmin()
  }
  futureDateDisabled() {
    this.curDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    let fullDate = this.curDate.split('/');
    //let currenatDay = this.dayCalculate(fullDate[2]);
    this.todayDate =
    {
      year: parseInt(fullDate[0]),
      month: parseInt(fullDate[1]),
      day: parseInt(fullDate[2]) - 1
    }
  }

  // day calulate to disable today date
  // dayCalculate(day){
  //   if(day == "1"){
  //     return 31;
  //   }
  //   else return day-1;
  // }


  getSalutations() {
    this.salutationService.getSalutationsList()
      .subscribe(
        res => {
          this.salutationList = res;
          this.salutationList= this.globalService.addSelectIntoList(this.salutationList);
          res.forEach((salutation) => {
            if (salutation.id == this.user.controls['salutationId'].value) {
              this.user.controls['salutationName'].setValue(salutation.name);
            }
          });
        },
        error => {

        });
  }


  getCountry() {
    this.countryService.getCountriesList()
      .subscribe(
        res => {
          this.countryList = res;
          this.countryList= this.globalService.addSelectIntoList(this.countryList);
          if (this.user.controls['countryId'].value) {
            this.getStateByCountryId(this.user.controls['countryId'].value, false);
          }
          //
        },
        error => {

        });
  }

  //Getting all state names based on country id
  getStateByCountryId(countryId, isResetStateInfo) {
     // event will give you full breif of action
     this.stateByCountryIdMap= this.globalService.stateByCountryIdMap;
    if (isResetStateInfo) {
      this.user.controls['stateId'].setValue(null);
      this.user.controls['stateName'].setValue("");
    }
    this.selectedCountry = countryId;
    let selectedCountryObj = this.countryList.filter(function (d) {
      return d.id == countryId;
    })[0];
    if (selectedCountryObj) {
      this.user.controls['countryName'].setValue(selectedCountryObj.name);
    } else {
      this.user.controls['countryName'].setValue("");
    }
    if(this.stateByCountryIdMap.has(+countryId)&&countryId!=0){
      let list=this.stateByCountryIdMap.get(countryId);
      if(list.length>1){
        this.stateList=list;
      }
      this.printStateFromRes(this.user.controls['stateId'].value);
    }else{
      this.stateService.getstatesListByCountryId(this.selectedCountry).subscribe( res => {
        this.stateList = res;
        this.stateList= this.globalService.addSelectIntoList(this.stateList);
        this.printStateFromRes(this.user.controls['stateId'].value);
      },
        error => {
          //
      });
    }
  }

  // getStateName =============
  getStateName(event) {
    let selectedStateObj = this.stateList.filter(function (d) {
      return d.id == event.target.value;
    })[0];
    this.printState(selectedStateObj);
  }

  printStateFromRes(event) {
    let selectedStateObj = this.stateList.filter(function (d) {
      return d.id == event;
    })[0];
    this.printState(selectedStateObj);
  }

  printState(selectedStateObj) {
    if (selectedStateObj) {
      this.user.controls['stateName'].setValue(selectedStateObj.name);
    } else {
      this.user.controls['stateName'].setValue("");
    }
  }

  // genderName selected
  Selected($event) {
    if($event.target.options.selectedIndex){
      this.user.controls['genderName'].setValue($event.target.options[$event.target.options.selectedIndex].text);
    }else{
      this.user.controls['genderName'].setValue(null);
    }
  }

  // salutationChange
  salutationChange($event) {
    if($event.target.options.selectedIndex){
      this.user.controls['salutationName'].setValue($event.target.options[$event.target.options.selectedIndex].text);
    }else{
      this.user.controls['salutationName'].setValue(null);
    }
  }

  validateIsAdmin() {
    let admin = sessionStorage.getItem("isAdmin");
    let systemAdmin = sessionStorage.getItem("isSystemAdmin");
    if (admin == "true" || systemAdmin == "true") {
      this.isEditable = true;
    } else {
      this.isEditable = false;
    }

  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.user.get('firstName').setErrors({
        pattern: true
      });
    }
  }
  onKeyMiddle(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.user.get('middleName').setErrors({
        pattern: true
      });
    }
  }
  onKeyLast(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.user.get('lastName').setErrors({
        pattern: true
      });
    }
  }

  checkEmailAvilability(event: any) {
    this.emailId=this.globalService.emailId;
    let convertEmailidAsLOwerCase = event.target.value.toLowerCase();
    if((this.emailId===convertEmailidAsLOwerCase)&&(this.emailId!=undefined)){

    }else{
    this.tenantUserService.checkAvailability(encodeURIComponent(convertEmailidAsLOwerCase))
      .subscribe(
        res => {
          if (res) {
            this.user.controls['emailId'].setErrors({
              emailIdAlreadyExit: true
            });
          }
          else {
            this.user.controls['emailId'].setErrors({
              emailIdAlreadyExit: false
            });
            this.user.controls["emailId"].updateValueAndValidity();
            this.user.controls['emailId'].setValidators([Validators.required,Validators.email]);
          }
        });
  }
  }
  counrtyOnChange($event) {
    this.stateList=[];
    if ($event.value) {
      this.user.controls['countryName'].setValue($event.itemData.name);
      this.getStateByCountryId($event.itemData.id, false);
    }else{
      this.user.controls['countryName'].setValue("");
      this.user.controls['countryId'].setValue(null);
    }
  }
  stateOnChange($event){
    if ($event.value) {
      this.user.controls['stateName'].setValue($event.itemData.name);
    }else{
      this.user.controls['stateId'].setValue(null);
      this.user.controls['stateName'].setValue("");
    }
  }
  salutationOnChange($event){
    if ($event.value) {
      this.user.controls['salutationName'].setValue($event.itemData.name);
    }else{
      this.user.controls['salutationName'].setValue("");
      this.user.controls['salutationId'].setValue(null);
    }
  }
}
