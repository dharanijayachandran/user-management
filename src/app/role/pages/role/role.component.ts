import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  @ViewChild('roleManage') roleManage;

  constructor() { }

  gettingRoleDetail = {};
  isEnableSwitchTab = false;
  receiveMessage($event) {
    if ($event) {
      this.isEnableSwitchTab = true;
      this.gettingRoleDetail = $event
      // this.switchNgBTab("mngRollMenu");
      this.isEnableSwitchTabStatus();
    } else {
      this.isEnableSwitchTab = false;
    }
  }

  // isEnableSwitch status false after one second
  isEnableSwitchTabStatus() {
    setTimeout(() => {
      this.isEnableSwitchTab = false;
    }, 1000);
  }

  ngOnInit() {
  }

  // To switch tab
  // switchNgBTab(tabName: string) {
  //   this.roleManage.select(tabName);
  // }

  // prevent to click on tabs
  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'mngRollMenu' && !this.isEnableSwitchTab) {
      $event.preventDefault();
    } else {
    }
  }

}
