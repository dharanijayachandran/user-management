import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
//import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_FACTORY } from '@angular/cdk/overlay/typings/overlay-directives/overlay';
import { profileService } from '../../services/profile/profile.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  //updatePass:UpdatePassword
  /* updatePassword: UpdatePassword;
  profileChangePassword: FormGroup;
  constructor( private auth: AuthService, private formBuilder: FormBuilder) { 
    this.updatePassword= new UpdatePassword();
    this.profileChangePassword = this.formBuilder.group({
     
      userId: ['', [Validators.required]],
      oldPassword: ['', [Validators.required, Validators.minLength(8),, Validators.maxLength(16)]],
      newPassword: ['', Validators.required, Validators.minLength(8),, Validators.maxLength(16),],
      confirmPassword: ['', Validators.required, Validators.minLength(8),, Validators.maxLength(16),],
    }); */
  userDetail: User;
  constructor(private service: profileService) {

  }

  ngOnInit() {
    this.loadFormData();
  }
  /* changePassword(updatePassword:UpdatePassword)
  {
    this.updatePassword = <UpdatePassword>this.profileChangePassword.value;
    updatePassword.createdById=+sessionStorage.getItem("userId");
    updatePassword.userId=sessionStorage.getItem("userName");
    this.auth.changePasswordProcess(updatePassword);
  
  } */

  loadFormData() {
    let userId = sessionStorage.getItem('userId');
    this.getUserInformationByUserId(userId);
  }

  getUserInformationByUserId(userId) {
    this.service.getUserInformationByUserId(userId).subscribe(data => {
      this.userDetail = data;
      if(this.userDetail.gender==='M'){
        this.userDetail.gender=this.userDetail.gender.replace('M','Male')
      }else if(this.userDetail.gender==='F'){
        this.userDetail.gender=this.userDetail.gender.replace('F','Female')
      }else if(this.userDetail.gender==='T'){
        this.userDetail.gender=this.userDetail.gender.replace('T','Trans-Gender')
      }
    })
  }
}

