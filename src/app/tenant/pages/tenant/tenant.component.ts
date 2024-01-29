import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.css'],
  providers: [
    NgbTabset
  ]
})
export class TenantComponent implements OnInit, AfterViewInit {

  constructor(public tabset: NgbTabset, private globalService: globalSharedService,
    ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    let getTabClicked = this.globalService.tabClick;
    if(getTabClicked != undefined || getTabClicked != null){
      this.tabNameMessage();
      let tabClick= document.getElementById(getTabClicked);
      tabClick.click();
      setTimeout(()=>{
        this.globalService.tabClick = null;
      },1000);
    }
  }

  gettingTenantDetail = {};
  isEnableSwitchTab = false;
  receiveMessage($event) {
    this.isEnableSwitchTab = true;
    this.gettingTenantDetail = $event;
    // this.switchNgBTab($event);
    this.isEnableSwitchTabStatus();
  }

   // To navigate based on click form tab or action place
   tabNameMessage() {
    this.isEnableSwitchTab = true;
    this.isEnableSwitchTabStatus();
  }


  // isEnableSwitch status false after one second
  isEnableSwitchTabStatus(){
    setTimeout(() => {
      this.isEnableSwitchTab = false;
    }, 1000);
  }

  // To switch tab
  // switchNgBTab(tabName: string) {
  //   this.tenantManage.select(tabName);
  // }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'mngMenu' && !this.isEnableSwitchTab || $event.nextId === 'mngRole' && !this.isEnableSwitchTab || $event.nextId === 'mngUser' && !this.isEnableSwitchTab) {
      $event.preventDefault();
    }
  }
}
