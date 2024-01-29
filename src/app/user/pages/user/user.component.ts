import { Component, OnDestroy } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

declare var angular: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})



export class UserComponent implements OnDestroy {

  //pageSettings = pageSettings;

  constructor(private globalService: globalSharedService) { }

  ngAfterViewInit() {
    let getTabClicked = this.globalService.tabClick;
    if (getTabClicked != undefined || getTabClicked != null) {
      let tabClick = document.getElementById(getTabClicked);
      tabClick.click();
      setTimeout(() => {
        this.globalService.tabClick = null;
      }, 1000);
    }
  }

  isEnableSwitchTab = false;

  // To navigate based on click form tab or action place
  tabNameMessage($event) {
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
    if ($event.nextId  === 'userRole' && !this.isEnableSwitchTab) {
      $event.preventDefault();
    }
  }


  ngOnDestroy() { }

}
