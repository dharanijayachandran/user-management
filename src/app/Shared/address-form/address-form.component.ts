import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CountryService } from '../services/country/country.service';
import { StateService } from '../services/state/state.service';
import { Country } from '../model/country';
import { State } from '../model/state';
import { AddressService } from '../services/address/address.service';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { globalSharedService } from '../services/global/globalSharedService';
@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  @Input('group') addressForm: FormGroup;
  selectedIcon;
  selectedStateObj: any[];
  stateByCountryIdMap: Map<number, State[]>;

  constructor(private countryService:CountryService, private stateService:StateService,
                private addressService:AddressService, private globalService: globalSharedService) {
                 //call to get country
                this.getCountry();
               }


public countryFields: Object = {
    text: 'name',
    value: 'id'
  };
  public stateFields: Object = {
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
  //Getting all country names
  countryList= [];
  //Getting all state names based on country id
  public selectedCountry;
  stateList= [];

  //tenantId
  public check;
  public sort:string ='Ascending';
  countryId:any;
  stateId:any;
  // set the placeholder to DropDownList input element
  public countryWaterMark: string = 'Select Country';

  // set the placeholder to DropDownList input element
  public stateWaterMark: string = 'Select State';
  // set the placeholder to filter search box input element
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;
  ngOnInit() {

  }


  //get all the countries
  getCountry(){
   this.stateByCountryIdMap= this.globalService.stateByCountryIdMap;
    this.countryService.getCountriesList().subscribe(res => {
      this.countryList = res;
      this.countryList= this.globalService.addSelectIntoList(this.countryList);
      if (this.addressForm.controls['countryId'].value) {
        this.getCountryName(this.addressForm.controls['countryId'].value);
      } else {
        this.addressForm.controls['countryId'].setValue(null);
      }
      if(this.addressForm.controls['countryId'].value){
        this.getStateByCountryId(this.addressForm.controls['countryId'].value, false);
      }else{
        this.addressForm.controls['countryId'].setValue(null);
        this.addressForm.controls['stateId'].setValue(null);
      }
    },
    error => {
      //
    });
  }
  getCountryName(countryId) {
    this.selectedIcon = this.countryList.filter((e) => {
      return e.id == countryId;
    })
    this.addressForm.controls['countryName'].setValue(this.selectedIcon[0].name);
  }

  //Getting all state names based on country id
  getStateByCountryId(countryId, isResetStateInfo) {
    if(isResetStateInfo) {
      this.addressForm.controls['stateId'].setValue(null);
      this.addressForm.controls['stateName'].setValue("");
    }
    this.selectedCountry = countryId;
    let selectedCountryObj = this.countryList.filter(function(d) {
      return d.id == countryId;
    })[0];
    if(selectedCountryObj) {
      this.addressForm.controls['countryName'].setValue(selectedCountryObj.name);
    } else {
      this.addressForm.controls['countryName'].setValue(null);
    }
    if(this.stateByCountryIdMap.has(+countryId)&&countryId!=0){
      let list=this.stateByCountryIdMap.get(countryId);
      if(list.length>1){
        this.stateList=list;
      }
      if (this.addressForm.controls['stateId'].value) {
        this.getStateName(this.addressForm.controls['stateId'].value);
      } else {
        this.addressForm.controls['stateId'].setValue(null);
      }
    }else{
      this.stateService.getstatesListByCountryId(this.selectedCountry).subscribe( res => {
        this.stateList = res;
        if (res) {
          let Obj = {
            "name": "--Select--",
            "id":0
          }
          this.stateList.push(Obj);;
        }
        if (this.addressForm.controls['stateId'].value) {
          this.getStateName(this.addressForm.controls['stateId'].value);
        } else {
          this.addressForm.controls['stateId'].setValue(null);
        }
      },
        error => {
          //
      });
    }

  }

  // getStateName =============
  getStateName(stateId){
    this.selectedStateObj = this.stateList.filter(function(d) {
      return d.id == stateId;
    });
    this.addressForm.controls['stateName'].setValue(this.selectedStateObj[0].name);
  }


  //Address info JSON
  addressInfoSaveAndUpdate(address){
   var address = address.value;
   address.tenantId =2;
   address.createdBy = 1;
   address.typeId = 1;
   address.stateOther= 'other';

   address.countryId = parseInt(address.countryId, 10);
   address.stateId = parseInt(address.stateId, 10);
    this.addressService.saveAddressForParticularTenant(address).subscribe( res => {
      this.check = res;
      // alert('success');
    },
      error => {
        //
    });
  }

  counrtyOnChange($event) {
    this.stateList=[];
    if ($event.value) {
      this.addressForm.controls['countryName'].setValue($event.itemData.name);
      this.getStateByCountryId($event.itemData.id, false);
    }else{
      this.addressForm.controls['countryName'].setValue("");
      this.addressForm.controls['countryId'].setValue(null);
    }
  }
  stateOnChange($event){
    if ($event.value) {
      this.addressForm.controls['stateName'].setValue($event.itemData.name);
    }else{
      this.addressForm.controls['stateId'].setValue(null);
      this.addressForm.controls['stateName'].setValue("");
    }
  }
}
