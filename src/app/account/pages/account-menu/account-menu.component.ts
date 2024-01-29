import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { Observable, of as ofObservable } from 'rxjs';
import { UIModalNotificationPage } from 'global';
import { AccountMenu } from '../../model/accountMenu';
import { AccountMenuService } from '../../services/accountMenu/account-menu.service';
import { MenuService } from 'src/app/Shared/services/menu/menu.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';


@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css'],
})
export class AccountMenuComponent implements AfterViewInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  saveButtonDisableStatus = true;

  noRecordBlock = false;
  assignMenusBlock = false;
  showLoaderImage = false;
  // @Input('accountValueChild') public gettingAccountDetailList;

  gettingAccountDetailList;
  accountId;

  tenantIdGet = sessionStorage.getItem('beId');
  tenantId = parseInt(this.tenantIdGet, 10);

  getUserId = sessionStorage.getItem('userId');
  userId = parseInt(this.getUserId, 10);
  warningFlag: string;
  visibleNodes: AccountMenu[];


  ngOnInit() {
    this.showLoaderImage = true;
    this.gettingAccountDetailList = this.globalService.listOfRow;
    this.accountId = this.gettingAccountDetailList.id;
    this.getMenus();
  }

  // Refresh
  refreshTableListFunction() {
    this.getMenus();
  }

  ngAfterViewInit() {
  }


  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<AccountMenu, AccountMenu> = new Map<AccountMenu, AccountMenu>();

  /** A selected parent node to be inserted */
  selectedParent: AccountMenu | null = null;

  /** Flat tree control. Able to expand/collapse a subtree recursively for flattened tree. */
  treeControl: FlatTreeControl<AccountMenu>;

  // * Tree flattener to convert a normal type of node to node with children & level information.
  treeFlattener: MatTreeFlattener<AccountMenu, AccountMenu>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<AccountMenu>(true /* multiple */);

  // _selectedItems = [];

  dataSource: MatTreeFlatDataSource<AccountMenu, AccountMenu>;

  orginalJson = [];

  _selectedNodes = [];

  selectedNodes = [];

  constructor(private changeDetectorRef: ChangeDetectorRef, private menuService: MenuService, private accountMenuService: AccountMenuService, private httpService: HttpClient,
    private globalService: globalSharedService, private router: Router, ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<AccountMenu>(this.getLevel, this.isExpandable);
  }

  getLevel = (node: AccountMenu) => { return node.level; };

  isExpandable = (node: AccountMenu) => { return node.expandable; };

  getChildren = (node: AccountMenu): Observable<AccountMenu[]> => {
    return ofObservable(node.menus);
  }

  hasChild = (_: number, _nodeData: AccountMenu) => { return _nodeData.expandable; };

  hasNoContent = (_: number, _nodeData: AccountMenu) => { return _nodeData.name === ''; };

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: AccountMenu, level: number) => {
    let flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.name === node.name ? this.nestedNodeMap.get(node)! : new AccountMenu();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.id = node.menuId;
    flatNode.parentMenuId = node.parentMenuId;
    flatNode.expandable = (node.menus.length > 0) ? true : false;
    flatNode.isSelected = (node.isSelected) ? true : false;
    flatNode['visible'] = true;
    //this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: AccountMenu): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: AccountMenu): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: AccountMenu): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
    this.markSelectedNode(node, this.checklistSelection.isSelected(node));
    this._selectedNodes = this.checklistSelection.selected
    //
    this.saveButtonDisableStatusUpdate(this._selectedNodes);
  }

  //Save Button Disable Status Update
  saveButtonDisableStatusUpdate(nodeLength) {
    if (nodeLength.length > 0) this.saveButtonDisableStatus = false;
    else this.saveButtonDisableStatus = true;
  }


  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: AccountMenu): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this._selectedNodes = this.checklistSelection.selected
    this.saveButtonDisableStatusUpdate(this._selectedNodes);
    this.markSelectedNode(node, this.checklistSelection.isSelected(node));
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: AccountMenu): void {
    let parent: AccountMenu | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: AccountMenu): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );

    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: AccountMenu): AccountMenu | null {
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
  //Save menus
  SaveAccountMenu() {
    this.showLoaderImage = true;
    let orginalJson = JSON.parse(JSON.stringify(this.orginalJson));
    this.stripUnselectedNodes(orginalJson);
    var accountMenu = new AccountMenu();
    accountMenu.accountId = this.accountId;
    accountMenu.createdBy = this.userId;
    accountMenu.menus = this.getFormattedMenuList(orginalJson);
    //
    this.accountMenuService.saveAccountMenu(accountMenu)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(res['messageType'], res['message']);
        },(error: any) => {
          // If the unable to connect
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  // redirectTo
  redirectTo() {
    let mngAccount = document.getElementById('mngAccAccount');
    mngAccount.click();
  }

  //To iterate to get all the menus its call recursively
  menuIterate(menus) {
    const that = this;
    return menus && menus.length ? menus.map(function (o) {
      var returnObj = {
        "name": o.name,
        "menuItemOrder": o.menuItemOrder,
        "menus": that.menuIterate(o.menus),
        "menuId": o.menuId
      }
      if (o.parentAccountMenuId) {
        returnObj["parentAccountMenuId"] = o.parentAccountMenuId;
      }
      return returnObj;
    }) : [];
  }
  getFormattedMenuList(list) {
    const that = this;
    return list.map(function (l) {
      return {
        name: l.name,
        menuId: l.menuId,
        menus: that.menuIterate(l.menus),
        "menuItemOrder": l.menuItemOrder,
      };
    });
  }

  res = [];
  //To get all master menus
  getMenus() {
    this.accountMenuService.getAccountMenuList(this.tenantId, this.accountId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          if (Array.isArray(res) && res.length) {
            this.orginalJson = res;
            this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
            this.dataSource.data = res.sort((a, b) => a.id - b.id);
            this.updateTreeCheckbox(this.treeControl.dataNodes);
            this.gettingAccountDetailList = res[0];
            this.assignMenusBlock = true;
            this.noRecordBlock = false;
          } else {
            this.noRecordBlock = true;
            this.assignMenusBlock = false;

          }
        },
        error => {
          this.showLoaderImage = false;
          //
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

  CancelAccountMenu() {
    this.warningFlag = "cancel";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Confirm redirect to
  formCancelConfirm() {
    let mngAccAccount = document.getElementById('mngAccAccount');
    mngAccAccount.click();
  }
  resetAccountMenu() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Checkbox reset  confirm
  formResetConfirm() {
    this.getMenus();
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
    }else{
      this.noRecordBlock = false;
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
backToAccount(){
  let mngAccAccount = document.getElementById('mngAccAccount');
  mngAccAccount.click();
}

}



