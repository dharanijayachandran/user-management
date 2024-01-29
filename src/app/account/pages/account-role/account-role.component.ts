import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of as ofObservable } from 'rxjs';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { RoleMenu } from '../../../role/model/roleMenu';
import { RoleService } from '../../../role/services/role/role.service';
import { RoleMenuService } from '../../../role/services/roleMenu/role-menu.service';
import { TenantRoleMenuService } from '../../../tenant/services/tenantRoleMenu/tenant-role-menu.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { MatTablePaginatorComponent } from 'src/app/Shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-account-role',
  templateUrl: './account-role.component.html',
  styleUrls: ['./account-role.component.css']
})
export class AccountRoleComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  // Account Role List view starts here=====================================
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
  accountId: number;
  accountName: String;
  accountRoleId: number;
  accountRoleName: any;
  accountRoldId: number;
  successFlag: string;
  warningFlag: string;
  showLoaderImage = true;
  accountRoleForm: FormGroup;


  constructor(private roleService: RoleService, private roleMenuService: RoleMenuService,
    private router: Router, private globalService: globalSharedService,
    private tenantRoleMenuService: TenantRoleMenuService, private formBuilder: FormBuilder,
    private route: ActivatedRoute) {

    // Account role menu view
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<RoleMenu>(this.getLevel, this.isExpandable);

  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.accountId = Number(sessionStorage.getItem("userOwnerId"));
    this.accountName = this.globalService.name;
    this.accountRoleForm = this.formBuilder.group({
      accountName: [''],
    })
    this.accountRoleForm.patchValue({
      accountName: this.globalService.name
    })

    this.showLoaderImage = true;
    this.getAccountRoles();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.description.toLowerCase().includes(filter);
    };
  }

  // Refresh table
  refreshTableListFunction() {
    this.getAccountRoles();
  }

  // Refresh table Menu
  refreshTableMenusFunction() {
    this.getAccountRoleMenu(this.accountRoleId, this.accountRoleName);
  }

  getAccountRoles() {
    this.getAccountRolesById(Number(this.accountId));
  }


  // Getting all the Roles starts here
  getAccountRolesById(id: number) {
    this.roleService.getRoleListByBeId(id)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          let getDataSource = res;
          res.forEach(role => {
            if (!role.description) {
              role.description = '';
            }
          })
          if (Array.isArray(res) && res.length) {
            getDataSource = getDataSource.sort((a, b) => b.id - a.id);
            //  this.dataSource = new MatTableDataSource();
            this.dataSource.data = getDataSource;

            // To get paginator events from child mat-table-paginator to access its properties
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
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }


  addAccountRoleFormView(event) {
    this.globalService.GettingString(this.accountName);
    this.roleListView = false;
    this.accountRoleObject('../account', Object, 'mngRole', 'Account');
    this.router.navigate(['../account/accountRoleForm'], { relativeTo: this.route });
    this.globalService.listOfRow = {};
  }

  // Routing and Account Object passing
  accountRoleObject(URL, accountUserDetail, tabname, headerName) {
    //=========================================( URL, object, tab,  Header
    this.globalService.listOfRowDetailForUser(URL, accountUserDetail, tabname, headerName);
  }
  // Click to View
  clickToView(roleDetail) {
    this.globalService.GettingString(this.accountName);
    this.accountRoleObject('../account', Object, 'mngRole', 'Account');
    this.roleObject(roleDetail);
  }

  // Update Account role
  updateAccountRoleFormView(roleDetail) {
    this.globalService.GettingString(this.accountName);
    this.roleListView = false;
    this.accountRoleObject('../account', Object, 'mngRole', 'Account');
    this.roleObject(roleDetail);
  }

  // Common function for setting ID and role object
  roleObject(roleDetail) {
    this.globalService.GettingId(roleDetail.id);
    this.globalService.setOrganizationDetail('', roleDetail);
  }

  // Delete Account Roles
  deleteAccountRole(id: number) {
    this.accountRoldId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Account Role!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.roleService.deleteOrganizationRole(this.accountRoldId, Number(userId)).subscribe(res => {
      // Success response
      this.successFlag = "accountRole";
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  redirectTo() {
    if (this.successFlag == "accountRole") {
      this.getAccountRoles();
    } else if (this.successFlag == "accountRoleMenu") {
      // this.roleListView = true;
      // this.menuListView = false;
      let mngAccAccount = document.getElementById('mngAccAccount');
      mngAccAccount.click();
      this.router.navigate(['../account'], { relativeTo: this.route });
    }
    this.successFlag = "";
  }

  // Account Role List view ends here=====================================



  saveButtonDisableStatus = true;

  // User ID
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

  dataSourceAccountRole: MatTreeFlatDataSource<RoleMenu, RoleMenu>;

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
      this.checklistSelection.isSelected(child)
    );
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
  SaveAccountRoleMenu() {
    this.showLoaderImage = true;
    let orginalJson = JSON.parse(JSON.stringify(this.orginalJson));
    this.stripUnselectedNodes(orginalJson);
    let RoleMenu = {};
    RoleMenu["roleId"] = this.accountRoleId;
    RoleMenu["createdBy"] = this.userId;
    RoleMenu["menus"] = this.getFormattedMenuList(orginalJson);
    //
    this.roleMenuService.saveRoleMenus(RoleMenu)
      .subscribe(res => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      }, (error) => {
        this.showLoaderImage = false;
        // If the service is not available
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
        "isLandingMenu": o.isLandingMenu
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
      };
    });
  }

  //To get all Role menus
  getAccountRoleMenu(id, name) {
    this.showLoaderImage = true;
    this.accountRoleId = id;
    this.accountRoleName = name;
    let beType = "ACCOUNT"
    this.roleMenuService.getAccRoleMenuList(beType, this.accountId, this.accountRoleId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          if (Array.isArray(res) && res.length) {
            this.orginalJson = res;
            this.dataSourceAccountRole = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
            this.dataSourceAccountRole.data = res.sort((a, b) => a.id - b.id);
            //
            this.updateTreeCheckbox(this.treeControl.dataNodes);
            this.saveMenuButton = true;
            this.noRecordBlock = false;
            this.roleListView = false;
            this.menuListView = true;
            this.assignMenusBlock = true;
          } else {
            this.roleListView = false;
            this.menuListView = true;
            this.saveMenuButton = false;
            this.noRecordBlock = true;
            this.assignMenusBlock = false;
          }
        },
        error => {
          this.showLoaderImage = false;
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
  CancelAccountRoleMenu() {
    this.warningFlag = "cancel";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.roleListView = true;
    this.menuListView = false;
  }

  resetAccountRoleForm() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Checkbox reset  confirm
  formResetConfirm() {
    this.getAccountRoleMenu(this.accountRoleId, this.accountRoleName);
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
  backToAccount() {
    let mngAccAccount = document.getElementById('mngAccAccount');
    mngAccAccount.click();
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
