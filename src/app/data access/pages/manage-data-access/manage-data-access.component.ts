import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-manage-data-access',
  templateUrl: './manage-data-access.component.html',
  styleUrls: ['./manage-data-access.component.css'],
  providers: [
    NgbTabset
  ]
})
export class ManageDataAccessComponent implements OnInit {

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

  public beforeChange($event: NgbTabChangeEvent) {
   /*  if ($event.nextId === 'manageGateway' && !this.isEnableSwitchTab || $event.nextId === 'manageDashboard' && !this.isEnableSwitchTab) {
      $event.preventDefault();
    } */
  }
}
