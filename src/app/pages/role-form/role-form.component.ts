import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css']
})
export class RoleFormComponent implements OnInit {

  @Input('group') roleForm: FormGroup;


  constructor(private globalService: globalSharedService) { }

  ngOnInit() {
  }

  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.roleForm.get('name').setErrors({
        pattern: true
      });
    }
  }
}
