import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
//in place where you wanted to use `HttpClient`
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, Renderer2, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { Observable, of as ofObservable } from 'rxjs';
import { UIModalNotificationPage } from 'global';
import { RoleMenu } from '../../model/roleMenu';
import { RoleMenuService } from '../../services/roleMenu/role-menu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from 'src/app/tenant/services/application/application.service';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-role-menu',
  templateUrl: './role-menu.component.html',
  styleUrls: ['./role-menu.component.css'],
})
export class RoleMenuComponent {
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  saveButtonDisableStatus = true;
  // User ID
  getUserId = sessionStorage.getItem('userId');
  userId = parseInt(this.getUserId, 10);
  // BeId
  getBeId = sessionStorage.getItem('beId');
  beId = parseInt(this.getBeId, 10);
  saveMenuButton: boolean;
  noRecordBlock: boolean ;
  @Input('roleIdValueChild') public gettingRoleDetail;
  _selectedNodes = [];
  assignMenusBlock = false;
  warningFlag: string;
  showLoaderImage:boolean;
  visibleNodes: RoleMenu[];
  applicationForm: FormGroup;
  applications = [];
  public applicationWaterMark: string = 'Select Application Name';
  public applicationFields: Object = {
    text: 'name',
    value: 'id'
  };
  public height: string = '220px';
  public sortDropDown: string = 'Ascending';
  public onFilteringApplication: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.applications);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public filterPlaceholder: string = 'Search';
  saveCode: string;

  ngOnInit(): void {
    this.loadForm();
    this.getApplication();
  }
  refreshTableListFunction() {
    //this.ngOnInit();
  }
  loadForm() {
    this.applicationForm = this.formBuilder.group({
      applicationCode: [null, Validators.required]
    });
  }
  getApplication() {
      this.showLoaderImage = true;
      let isSystemAdmin = sessionStorage.getItem('isSystemAdmin');
      this.applicationService.getApplicationList(isSystemAdmin).subscribe(appData => {
      this.showLoaderImage = false;
      let data = this.getFormattedAssetList(appData);
      this.applications = data;
    },
      error => {
        this.showLoaderImage = false;
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

  applicationOnChange($event) {
    if ($event.value) {
      this.applicationForm.controls['applicationCode'].setValue($event.itemData.code);
      this.saveCode = $event.itemData.code;
      this.getMenus();
    }
  }
  nestedNodeMap: Map<RoleMenu, RoleMenu> = new Map<RoleMenu, RoleMenu>();
  treeControl: FlatTreeControl<RoleMenu>;
  treeFlattener: MatTreeFlattener<RoleMenu, RoleMenu>;
  checklistSelection = new SelectionModel<RoleMenu>(true /* multiple */);
  dataSource: MatTreeFlatDataSource<RoleMenu, RoleMenu>;
  orginalJson = [];

  constructor(private changeDetectorRef: ChangeDetectorRef, private roleMenuService: RoleMenuService, private httpService: HttpClient, private ren: Renderer2, private globalService: globalSharedService, private route: Router,
    private applicationService: ApplicationService, private formBuilder: FormBuilder) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<RoleMenu>(this.getLevel, this.isExpandable);

  }

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
    // flatNode.parentMenuId = node.parentMenuId;
    flatNode.expandable = (node.menus.length > 0) ? true : false;
    flatNode.isSelected = (node.isSelected) ? true : false;
    if (node.isLandingMenu) {
      this.currentCheckedValue = node.menuId;
    } else node.isLandingMenu = null;

    flatNode['visible'] = true;
    //this.flatNodeMap.set(flatNode, node);
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
    this.checkAllParentsSelection(node);
    this.markSelectedNode(node, this.checklistSelection.isSelected(node));
    this._selectedNodes = this.checklistSelection.selected;
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
  beType = sessionStorage.getItem('beType');
  //Save role menus
  SaveRoleMenu() {
    this.showLoaderImage = true;
    let orginalJson = JSON.parse(JSON.stringify(this.orginalJson));
    this.stripUnselectedNodes(orginalJson);
    let RoleMenu = {};
    RoleMenu["roleId"] = this.gettingRoleDetail.id;
    RoleMenu["createdBy"] = this.userId;
    RoleMenu["menus"] = this.getFormattedMenuList(orginalJson);
    this.roleMenuService.saveRoleMenus(RoleMenu).subscribe(res => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, (error) => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    });
  }

  // redirectTo
  redirectTo() {
    let mngRoll = document.getElementById('mngRoll')
    mngRoll.click();
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

  //To get all Role menus
  getMenus() {
    this.showLoaderImage = true;
    this.roleMenuService.getRoleMenuList(this.beType, this.beId, this.gettingRoleDetail.id, this.saveCode).subscribe(res => {
      this.showLoaderImage = false;
      if (Array.isArray(res) && res.length) {
        this.orginalJson = res;
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.dataSource.data = res.sort((a, b) => a.id - b.id);
        let e: any;
        this.updateTreeCheckbox(this.treeControl.dataNodes);
        this.checkState(e, this.treeControl.dataNodes);
        this.noRecordBlock = false;
        this.assignMenusBlock = true;
      } else {
        this.dataSource = null;
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
  CancelRoleMenu() {
    this.warningFlag = "cancel";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');

  }

  // Confirm redirect to
  formCancelConfirm() {
    let mngRoll = document.getElementById('mngRoll');
    mngRoll.click();
  }

  resetRoleForm() {
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
}
