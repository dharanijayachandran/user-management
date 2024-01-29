import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { RoleService } from '../../../role/services/role/role.service';
import { UserRoleService } from '../../services/userRole/user-role.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
	selector: 'app-user-role',
	templateUrl: './user-role.component.html',
	styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit, AfterViewInit {

	// Importing child component to
	@ViewChild(UIModalNotificationPage) modelNotification;

	public pageName = '';
	roleDetail;
	warningFlag: string;
	showLoaderImage = false;
	//roleDetail :UserRole;

	ngOnInit() {
		if (this.globalService.userDetails.id != null) {
			this.showLoaderImage = true;
			// Getting user id to get tenant roles
			this.roleDetail = this.globalService.userDetails;
			// this.roleDetail = this.roleDetail['id'];
			this.pageName = this.globalService.pageName;
			this.getRolesList();
			this.getRoleListConfirmed();
		}
	}

	// Refresh
	refreshTableListFunction() {
		this.getRolesList();
		this.getRoleListConfirmed();
	}

	constructor(private roleService: RoleService, private userRoleService: UserRoleService,
		private globalService: globalSharedService,
		private router: Router, private route: ActivatedRoute) { }

	// @Input('roleIdValueChild') public roleDetail;

	ngAfterViewInit() {

	}

	// Assign role to user starts here============================
	getBetype = sessionStorage.getItem("beType");
	getUserId = sessionStorage.getItem("userId");
	getBeId = sessionStorage.getItem("beId");
	beId = Number(this.getBeId);
	userId = Number(this.getUserId);
	betype = this.getBetype;

	roleList = [];
	confirmedList = [];

	_selected_role = [];
	// beType = Number(this.getBetype);
	getRolesList() {
		this.roleService.getRoleListByBeId(this.beId).subscribe(res => {
			this.showLoaderImage = false;
			this.roleList = res;
			this.doReset();

			this.roleMovedByUser = false;
			this.saveButtonDisableStatus = true;
		},
			error => {
				this.showLoaderImage = false;
				// If the service is not available
				this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
			});
	}

	//Getting selected roles(confirmed)

	getRoleListConfirmed() {
		let returnObj = [];
		this.roleService.getRoleListSelected(this.getBetype, this.roleDetail['id']).subscribe(res => {
			this.showLoaderImage = false;
			this.confirmedList = res;
			this.globalService.setRoleList(this.confirmedList);
			this.confirmedList.map(function (o) {
				let Obj = {
					"id": o["roleId"],
					"roleName": o["roleName"],
					"status": o["status"],
				}
				returnObj.push(Obj);
			});
			this.confirmedList = returnObj;
			this.doReset();
		},
			error => {
				this.showLoaderImage = false;
				// If the service is not available
				this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
			});
	}

	tab = 1;
	keepSorted = true;
	key: string;
	display: any;
	filter = true;
	source: Array<any>;
	confirmed: Array<any>;
	userAdd = '';
	disabled = false;

	sourceLeft = true;
	// format: any = DualListComponent.DEFAULT_FORMAT;
	format = {
		all: "Select All",
		none: "Deselect All",
		add: 'Available Roles',
		remove: 'Assigned/Selected Roles',
	}

	private sourceRoles: Array<any>;

	private confirmedRoles: Array<any>;

	private roleLabel(item: any) {
		return item.name;
	}

	private rolesObject() {
		this.key = "id";
		this.display = this.roleLabel;
		this.keepSorted = true;
		this.source = this.sourceRoles;
		this.confirmed = this.confirmedRoles;
	}


	doReset() {
		this.sourceRoles = JSON.parse(JSON.stringify(this.roleList));
		this.confirmedRoles = JSON.parse(JSON.stringify(this.confirmedList));
		this.rolesObject();
	}

	doDelete() {
		if (this.source.length > 0) {
			this.source.splice(0, 1);
		}
	}

	doCreate() {
		if (typeof this.source[0] === 'object') {
			const o = {};
			o[this.key] = this.source.length + 1;
			o[this.display] = this.userAdd;
			this.source.push(o);
		} else {
			this.source.push(this.userAdd);
		}
		this.userAdd = '';
	}

	doAdd() {
		for (let i = 0, len = this.source.length; i < len; i += 1) {
			const o = this.source[i];
			const found = this.confirmed.find((e: any) => e === o);
			if (!found) {
				this.confirmed.push(o);
				break;
			}
		}
	}

	doRemove() {
		if (this.confirmed.length > 0) {
			this.confirmed.splice(0, 1);
		}
	}

	doFilter() {
		this.filter = !this.filter;
	}

	filterBtn() {
		return (this.filter ? 'Hide Filter' : 'Show Filter');
	}

	doDisable() {
		this.disabled = !this.disabled;
	}

	disableBtn() {
		return (this.disabled ? 'Enable' : 'Disabled');
	}

	swapDirection() {
		this.sourceLeft = !this.sourceLeft;
		//this.format.direction = this.sourceLeft ? DualListComponent.LTR : DualListComponent.RTL;
	}
	// Roles Id retrieving
	getAssinedRoles() {
		let roleIds = [];
		this.confirmed.map(function (ob) {
			if (ob.id != "null" || ob.id != undefined) {
				ob['id'] = ob.id;
				roleIds.push(ob['id']);
			}
		})
		return roleIds;
	}
	getCreatedBy = sessionStorage.getItem("userId");
	createdBy = Number(this.getCreatedBy);
	// Save role to User
	SaveRoleAssignToUser() {
		this.showLoaderImage = true;
		//
		let assignRoles = {
			"userId": this.roleDetail['id'],
			"createdBy": this.createdBy,
			"roleIds": this.getAssinedRoles()
		}
		let listOfRoles = this.globalService.roleList;
		if (listOfRoles != null && listOfRoles.length != 0) {
			this.userRoleService.updateRoleToUser(assignRoles, this.betype).subscribe(res => {
				this.showLoaderImage = false;
				// Success response
				this.modelNotification.alertMessage(res['messageType'], res['message']);
			},
				error => {
					this.showLoaderImage = false;
					// If the service is not available
					this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
				});

		}
		else {
			this.userRoleService.assignRoleToUser(assignRoles, this.betype).subscribe(res => {
				this.showLoaderImage = false;
				// Success response
				this.modelNotification.alertMessage(res['messageType'], res['message']);
			},
				error => {
					this.showLoaderImage = false;
					// If the service is not available
					this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
				});
		}

	}


	// redirectTo
	redirectTo() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}


	// Cancel -----------> navigate to User list
	CancelRoleAssignToUser() {
		if (this.roleMovedByUser) {
			this.warningFlag = "cancel";
			this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
		} else this.formCancelConfirm();

	}


	// Confirm redirect to
	formCancelConfirm() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	resetRoleForm() {
		if (this.roleMovedByUser) {
			this.warningFlag = "reset";
			this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
		} else this.formResetConfirm();

	}

	// list role reset  confirm
	formResetConfirm() {
		this.getRolesList();
		this.getRoleListConfirmed();
	}

	alertRedirection() {
		if (this.warningFlag == "reset") {
			this.formResetConfirm();
		} else if (this.warningFlag == "cancel") {
			this.formCancelConfirm();
		}
		this.warningFlag = "";
	}

	// If roles tragged/selected by user
	roleMovedByUser: boolean = false;
	saveButtonDisableStatus: boolean;
	getRoleMovedByUser(event) {
		this.roleMovedByUser = true;
		if (event.length) this.saveButtonDisableStatus = false; else this.saveButtonDisableStatus = true;
	}

}
