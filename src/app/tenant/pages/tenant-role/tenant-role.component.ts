import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of as ofObservable } from 'rxjs';
import { RoleMenu } from '../../../role/model/roleMenu';
import { RoleService } from '../../../role/services/role/role.service';
import { RoleMenuService } from '../../../role/services/roleMenu/role-menu.service';
import { TenantRoleMenuService } from '../../services/tenantRoleMenu/tenant-role-menu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { ApplicationService } from '../../services/application/application.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { MatTablePaginatorComponent } from 'src/app/Shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-tenant-role',
  templateUrl: './tenant-role.component.html',
  styleUrls: ['./tenant-role.component.css']
})
export class TenantRoleComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  dataSource: any;
  displayedColumns: string[] = ['id', 'name', 'description', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  visibleNodes: RoleMenu[];
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================
  noRecordBlock = false;
  saveMenuButton = false;
  _selectedNodes = [];
  assignMenusBlock = false;
  roleListView = true;
  menuListView = false;
  tenantId: number;
  tenantName: String;
  beType = sessionStorage.getItem('beType');
  gettenId = sessionStorage.getItem('beId');
  tenId = parseInt(this.gettenId, 10);
  roleListHeader = sessionStorage.getItem("roleListHeader");
  tenantRoleId: number;
  tenantRoleName: any;
  tenantRole: number;
  successFlag: string;
  checkedNodesLength: any;
  warningFlag: string;
  showLoaderImage = true;
  tenentRoleForm: any;
  menuForm: FormGroup;
  applications = [];
  public applicationField: Object = { text: 'name', value: 'id' };
  saveCode: string;
  public applicationWaterMark: string = 'Select Application Name';
  public height: string = '220px';
  public sortDropDown: string = 'Ascending';
  public filterPlaceholder: string = 'Search';

  constructor(private roleService: RoleService, private roleMenuService: RoleMenuService,
    private router: Router, private globalService: globalSharedService, private formBuilder: FormBuilder,
    private tenantRoleMenuService: TenantRoleMenuService,
    private route: ActivatedRoute, private applicationService: ApplicationService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<RoleMenu>(this.getLevel, this.isExpandable);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.description.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.tenantId = Number(sessionStorage.getItem("userOwnerId"));
    this.tenantName = this.globalService.name;
    this.tenentRoleForm = this.formBuilder.group({
      tenentName: [''],
    })
    this.tenentRoleForm.patchValue({
      tenentName: this.globalService.name
    })
    this.getTenantRoles();
  }
  // Refresh table
  refreshTableListFunction() {
    this.getTenantRoles();
  }
  // Refresh table Menu
  refreshTableMenusFunction() {
    this.getTenantRoleMenu();
  }

  getTenantRoles() {
    this.getTenantRolesById(Number(this.tenantId));
  }

  // Getting all the Roles starts here
  getTenantRolesById(id: number) {
    this.roleService.getRoleListByBeId(id).subscribe(res => {
      this.showLoaderImage = false;
      let getDataSource = res;
      res.forEach(role => {
        if (!role.description) {
          role.description = '';
        }
      })
      if (Array.isArray(res) && res.length) {
        getDataSource = getDataSource.sort((a, b) => b.id - a.id);
        this.dataSource.data = getDataSource;
        this.myPaginator = this.myPaginatorChildComponent.getDatasource();
        this.matTablePaginator(this.myPaginator);
        this.dataSource.paginator = this.myPaginator;
        this.dataSource.sort = this.sort;
        this.roleListView = true;
      } else {
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = res;
      }

    },
      error => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }


  addTenantRoleFormView(event) {
    this.globalService.GettingString(this.tenantName);
    this.roleListView = false;
    this.tenantRoleObject('../tenant', Object, 'mngRole', 'Tenant');
    this.router.navigate(['../tenant/tenantRoleForm'], { relativeTo: this.route });
    this.globalService.listOfRow = {};
  }

  // Routing and Tenant Object passing
  tenantRoleObject(URL, tenantUserDetail, tabname, headerName) {
    this.globalService.listOfRowDetailForUser(URL, tenantUserDetail, tabname, headerName);
  }
  // Click to View
  clickToView(roleDetail) {
    this.globalService.GettingString(this.tenantName);
    this.tenantRoleObject('../tenant', Object, 'mngRole', 'Tenant');
    this.roleObject(roleDetail);
  }

  // Update Tenant role
  updateTenantRoleFormView(roleDetail) {
    this.globalService.GettingString(this.tenantName);
    this.roleListView = false;
    this.tenantRoleObject('../tenant', Object, 'mngRole', 'Tenant');
    this.roleObject(roleDetail);
  }

  // Common function for setting ID and role object
  roleObject(roleDetail) {
    this.globalService.GettingId(roleDetail.id);
    this.globalService.setOrganizationDetail('', roleDetail);
  }

  // Delete Tenant Roles
  deleteTenantRole(id: number) {
    this.tenantRole = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Role!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.roleService.deleteOrganizationRole(this.tenantRole, Number(userId)).subscribe(res => {
      // Success response
      this.successFlag = "tenantRole";
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  // RedirectTo
  redirectTo() {
    if (this.successFlag == 'tenantRoleMenu') {
      // this.roleListView = true;
      // this.menuListView = false;
      // this.getTenantRoleMenu(this.tenantRoleId, this.tenantRoleName);
      let mngTenant = document.getElementById('mngTenant');
      mngTenant.click();
      this.router.navigate(['../tenant'], { relativeTo: this.route });
      //  this.getTenantRoles();
    } else if (this.successFlag == 'tenantRole') {
      this.getTenantRoles();
    }
    this.successFlag == '';
  }

  saveButtonDisableStatus = true;
  getUserId = sessionStorage.getItem('userId');
  userId = parseInt(this.getUserId, 10);

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<RoleMenu, RoleMenu> = new Map<RoleMenu, RoleMenu>();

  /** A selected parent node to be inserted */

  /** Flat tree control. Able to expand/collapse a subtree recursively for flattened tree. */
  treeControl: FlatTreeControl<RoleMenu>;

  // * Tree flattener to convert a normal type of node to node with children & level information.
  treeFlattener: MatTreeFlattener<RoleMenu, RoleMenu>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<RoleMenu>(true /* multiple */);

  // _selectedItems = [];

  dataSourceTenantRole: MatTreeFlatDataSource<RoleMenu, RoleMenu>;

  orginalJson = [];

  getLevel = (node: RoleMenu) => { return node.level; };

  isExpandable = (node: RoleMenu) => { return node.expandable; };

  getChildren = (node: RoleMenu): Observable<RoleMenu[]> => {
    return ofObservable(node.menus);
  }

  hasChild = (_: number, _nodeData: RoleMenu) => { return _nodeData.expandable; };

  hasNoContent = (_: number, _nodeData: RoleMenu) => { return _nodeData.name === ''; };

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: RoleMenu, level: number) => {
    let flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.name === node.name ? this.nestedNodeMap.get(node)! : new RoleMenu();
    flatNode.name = node.menuName;
    flatNode.level = level;
    flatNode.id = node.menuId;
    flatNode.isLandingMenu = node.isLandingMenu;
    flatNode.expandable = (node.menus.length > 0) ? true : false;
    flatNode.isSelected = (node.isSelected) ? true : false;
    if (node.isLandingMenu) {
      this.currentCheckedValue = node.menuId;
    } else node.isLandingMenu = null;

    flatNode['visible'] = true;
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: RoleMenu): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: RoleMenu): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: RoleMenu): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelectionNode(descendants);

    // Force update for the parent
    this.checkAllParentsSelection(node);
    this.markSelectedNode(node, this.checklistSelection.isSelected(node));
    this._selectedNodes = this.checklistSelection.selected

    this.saveButtonDisableStatusUpdate(this._selectedNodes);
  }


  checklistSelectionNode(descendants) {
    this.checklistSelection.deselect(...descendants)
    for (let i = 0; i < descendants.length; i++) {
      if (descendants[i].id == this.currentCheckedValue) {
        this.currentCheckedValue = null;
      }
    }
  }

  //Save Button Disable Status Update
  saveButtonDisableStatusUpdate(nodeLength) {
    if (nodeLength.length > 0) this.saveButtonDisableStatus = false;
    else this.saveButtonDisableStatus = true;
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: RoleMenu): void {
    if (node.id === this.currentCheckedValue) {
      this.currentCheckedValue = null;
    }
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this._selectedNodes = this.checklistSelection.selected;
    this.saveButtonDisableStatusUpdate(this._selectedNodes);
    this.markSelectedNode(node, this.checklistSelection.isSelected(node));
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: RoleMenu): void {
    let parent: RoleMenu | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: RoleMenu): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {  //Deselect the children so parent make interminate state (-)
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) { // If all the children selected then parent also selecting
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: RoleMenu): RoleMenu | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  //Save Tenant Role Menu menus
  SaveTenantRoleMenu() {
    this.showLoaderImage = true;
    let orginalJson = JSON.parse(JSON.stringify(this.orginalJson));
    this.stripUnselectedNodes(orginalJson);
    let RoleMenu = {};
    RoleMenu["roleId"] = this.tenantRoleId;
    RoleMenu["createdBy"] = this.userId;
    RoleMenu["menus"] = this.getFormattedMenuList(orginalJson);
    this.roleMenuService.saveRoleMenus(RoleMenu).subscribe(res => {
      this.showLoaderImage = false;
      this.successFlag = "tenantRoleMenu";
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, (error) => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    });
  }


  //To iterate to get all the menus its call recursively
  menuIterate(menus) {
    const that = this;
    return menus && menus.length ? menus.map(function (o) {
      var returnObj = {
        "menus": that.menuIterate(o.menus),
        "menuId": o.menuId,
        "isLandingMenu": o.isLandingMenu,
        "applicationId": o.applicationId
      }
      return returnObj;
    }) : [];
  }

  getFormattedMenuList(list) {
    const that = this;
    return list.map(function (l) {
      return {
        menuId: l.menuId,
        isLandingMenu: l.isLandingMenu,
        menus: that.menuIterate(l.menus),
        applicationId: l.applicationId
      };
    });
  }

  applicationOnChange($event) {
    if ($event.value) {
      this.menuForm.controls['tenantApplicationCode'].setValue($event.itemData.code);
      this.saveCode = $event.itemData.code;
      this.getTenantRoleMenu();
    }
  }

  getApplication(id, name) {
    this.roleListView = false;
    this.menuListView = true;
    this.menuFormRegister();
    this.tenantRoleId = id;
    this.tenantRoleName = name;
    let isSystemAdmin = sessionStorage.getItem('isSystemAdmin');
    this.applicationService.getApplicationList(isSystemAdmin).subscribe(result => {
      let data = this.getFormattedAssetList(result);
      this.applications = data;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  getFormattedAssetList(list) {
    let isSystemAdmin = sessionStorage.getItem('isSystemAdmin');
    if(isSystemAdmin == 'true'){
    return list.map(function (l) {
      return {
        id: l.id,
        name: l.name,
        code: l.code
      };
    });
  }
  if(isSystemAdmin == 'false'){
    return list.map(function (l) {
      return {
        id: l.application.id,
        name: l.application.name,
        code: l.application.code
      };
    });
  }
}

  menuFormRegister() {
    this.menuForm = this.formBuilder.group({
      tenantApplicationCode: [null, Validators.required]
    })
  }

  //To get all Role menus
  getTenantRoleMenu() {
    this.showLoaderImage = true;
    this.roleMenuService.getRoleMenuList(this.beType, this.tenantId, this.tenantRoleId, this.saveCode).subscribe(res => {
      this.showLoaderImage = false;
      if (Array.isArray(res) && res.length) {
        this.orginalJson = res;
        this.dataSourceTenantRole = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.dataSourceTenantRole.data = res.sort((a, b) => a.id - b.id);
        let e: any;
        this.updateTreeCheckbox(this.treeControl.dataNodes);
        this.checkState(e, this.treeControl.dataNodes);
        this.saveMenuButton = true;
        this.noRecordBlock = false;
        this.assignMenusBlock = true;
      } else {
        this.saveMenuButton = false;
        this.noRecordBlock = true;
        this.assignMenusBlock = false;
      }
    },
      error => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  /* Set isSelected value to all childrens of passed tree */
  traverseDown(o, s) {
    try {
      for (let i in o) {
        o[i]["isSelected"] = s;
        if (o[i]["menus"].length > 0) this.traverseDown(o[i]["menus"], s);
      }
    } catch (err) {
      //TODO: Handle exception
    }
  }

  /* Set isSelected value to all parents of passed tree */
  traverseUp(o, n, s) {
    let pn = this.getParentNode(n); // Build function to get parent node
    if (pn) {
      let tempNode = this.findNode(o, pn.id);
      if (!s && tempNode.menus.length > 0 && tempNode.menus.filter(e => e.isSelected).length > 0) return;
      tempNode["isSelected"] = s;
      this.traverseUp(o, pn, s);
    }
  }

  /* Returns node by id */
  findNode(o, id) {
    for (let i in o) {
      if (o[i]["menuId"] === id) return o[i];
      if (o[i]["menus"].length > 0) {
        let tempNode = this.findNode(o[i]["menus"], id);
        if (tempNode) return tempNode;
      }
    }
  }

  // Removes unselected nodes from tree
  stripUnselectedNodes(o) {
    for (let i = 0; i < o.length; i++) {
      if (typeof o[i]["isSelected"] === 'undefined' || !o[i]["isSelected"]) {
        o.splice(i, 1);
        --i;
      } else {
        // delete o[i]["isSelected"]; // Uncomment if you don't want to pass isSelecetd
        if (o[i].menus.length > 0) this.stripUnselectedNodes(o[i].menus);
      }
    }
  }

  /* Set isSelected value when user toggle checkbox selection  */
  markSelectedNode(node, status) {
    try {
      let selectedNode = this.findNode(this.orginalJson, node.id);
      if (selectedNode) {
        //selectedNode["isLandingMenu"] = status;
        selectedNode["isSelected"] = status; // Updating root isSelected value
        this.traverseUp(this.orginalJson, node, status);
        if (selectedNode.menus.length > 0) this.traverseDown(selectedNode.menus, status); // Update descendants isSelected value when this node has menus which is not empty
      }
    } catch (err) {
      console.error("Unable to set status -- " + err);
    }
  }

  // This method used to update checkbox status when it's loaded into the view
  updateTreeCheckbox(nodes) {
    let checkedNodes = nodes.filter((e) => e.isSelected);
    this.checkedNodesLength = checkedNodes;
    this.saveButtonDisableStatusUpdate(checkedNodes);
    for (let node in checkedNodes) this.todoItemSelectionToggle(checkedNodes[node]);
  }

  currentCheckedValue = null;
  // islanding true making
  checkState(el, node) {
    setTimeout(() => {
      if (this.currentCheckedValue && this.currentCheckedValue === node.id) {
        el.checked = false;
        this.currentCheckedValue = null;
        this.isLandingStatus(node, el.checked);
      } else {
        el.checked = true;
        this.isLandingStatus(node, el.checked);
        this.currentCheckedValue = node.id;
      }
    })
  }

  // Is landing True
  isLandingStatus(node, status) {
    this.isLandingStatusFalse(this.orginalJson, false)
    let selectedNode = this.findNode(this.orginalJson, node.id);
    if (selectedNode && !selectedNode['isSelected']) {
      selectedNode["isLandingMenu"] = status;
      this.todoLeafItemSelectionToggle(node);
    } else {
      selectedNode["isLandingMenu"] = status;
    }

    // mark isLandingMenu false for orginal mat check box selected
    this.isSelectedListLandingMenuApply(selectedNode, status);
  }


  isSelectedListLandingMenuApply(selectedNode, status) {
    for (let i = 0; i < this.checklistSelection.selected.length; i++) {
      if (selectedNode.menuId == this.checklistSelection.selected[i].id) {
        this.checklistSelection.selected[i].isLandingMenu = status;
      } else this.checklistSelection.selected[i].isLandingMenu = false;
    }
  }

  // Is landing False
  isLandingStatusFalse(o, f) {
    for (let i in o) {
      o[i]["isLandingMenu"] = f;
      if (o[i]["menus"].length > 0) {
        this.isLandingStatusFalse(o[i]["menus"], f);
      }
    }
  }

  // Cancel -----------> navigate to role list view
  CancelTenantRoleMenu() {
    this.warningFlag = "cancel";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }


  // Confirm redirect to
  formCancelConfirm() {
    this.roleListView = true;
    this.menuListView = false;
  }

  resetTenantRoleForm() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Checkbox reset  confirm
  formResetConfirm() {
    this.getTenantRoleMenu();
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }


  // User search
  filterChanged(filterText: string) {
    this.applyFilter(this.treeControl.dataNodes, filterText);
    this.visibleNodes = this.treeControl.dataNodes.filter(
      node => node.visible === true);
    if (this.visibleNodes.length == 0) {
      this.noRecordBlock = true;
      this.assignMenusBlock = false;
    } else {
      this.noRecordBlock = false;
      this.assignMenusBlock = true;
    }
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  // Filtering the Nodes by user input
  applyFilter(list, searchString) {
    const that = this;
    let hasParentNode;
    return list.map(function (d) {
      d.visible = d.name.toLowerCase().includes(searchString.toLowerCase());
      hasParentNode = that.getParentNode(d);
      if (d.visible && hasParentNode) {
        hasParentNode.visible = true;
      }
      return d;
    });
  }

  //Back Button
  backToTenant() {
    let mngTenant = document.getElementById('mngTenant');
    mngTenant.click();
  }

  /*
  Material table paginator code starts here
*/
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;

  /*
      Material pagination getting pageIndex, pageSize, length through
      events(On change page, Next,Prev, Last, first) */
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }

  /* Load table data always to the Top of the table
  when change paginator page(Next, Prev, Last, First), Page size  */
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  /*
    Material table paginator code ends here
  */

}
