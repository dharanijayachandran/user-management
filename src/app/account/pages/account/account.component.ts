import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  constructor(private globalService: globalSharedService) {

  }

  ngOnInit() {
    let id = sessionStorage.getItem("beId");
    sessionStorage.removeItem("tenId");
    sessionStorage.setItem('tenId', id.toString());
    let beName = "TestOnMainPage";
    sessionStorage.setItem('accountOwnerName', "List of Account for Tenant: " + beName.toString());
  }

  ngAfterViewInit() {
    let getTabClicked = this.globalService.tabClick;
    if (getTabClicked != undefined || getTabClicked != null) {
      this.tabNameMessage();
      let tabClick = document.getElementById(getTabClicked);
      tabClick.click();
      setTimeout(() => {
        this.globalService.tabClick = null;
      }, 1000);
    }
  }

  gettingAccountDetail = {};

  isEnableSwitchTab = false;

  receiveMessage($event) {
    this.isEnableSwitchTab = true;
    this.gettingAccountDetail = $event;
  }

  // To navigate based on click form tab or action place
  tabNameMessage() {
    this.isEnableSwitchTab = true;
    this.isEnableSwitchTabStatus();
  }

  // isEnableSwitch status false after one second
  isEnableSwitchTabStatus() {
    setTimeout(() => {
      this.isEnableSwitchTab = false;
    }, 1000);
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'mngMenu' && !this.isEnableSwitchTab || $event.nextId === 'mngRole' && !this.isEnableSwitchTab || $event.nextId === 'mngUser' && !this.isEnableSwitchTab) {
      $event.preventDefault();
    }
  }

}


