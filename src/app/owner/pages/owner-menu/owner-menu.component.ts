import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable, of as ofObservable } from 'rxjs';
import { DialogService, UIModalNotificationPage } from 'global';
import { OwnerMenu } from '../../model/ownerMenu';
import { OwnerMenuService } from '../../services/ownerMenu/owner-menu.service';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { ApplicationService } from 'src/app/tenant/services/application/application.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-owner-menu',
  templateUrl: './owner-menu.component.html',
  styleUrls: ['./owner-menu.component.css'],
})
export class ownerMenuComponent implements OnInit {
  menuDirtyStatus: boolean;
  visibleNodes: OwnerMenu[];
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
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (!this.menuDirtyStatus) {
      this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
    } else {
      return true;
    }
    return this.dialogService.navigateAwaySelection$;
  }
  @ViewChild(UIModalNotificationPage) modelNotification;
  saveButtonDisableStatus:boolean = true;
  ownerIdGet = sessionStorage.getItem('beId');
  ownerId = parseInt(this.ownerIdGet, 10);
  getUserId = sessionStorage.getItem('userId');
  userId = parseInt(this.getUserId, 10);
  noRecordBlock = false;
  serviceMessage: string;
  firstName = sessionStorage.getItem("firstName");
  middleName = sessionStorage.getItem("middleName");
  lastName = sessionStorage.getItem("lastName");
  beName = sessionStorage.getItem("beName");
  assignMenusBlock = false;
  ownerDetailList: any;
  warningFlag: string;
  showLoaderImage: boolean;
  applicationForm: FormGroup;
  nestedNodeMap: Map<OwnerMenu, OwnerMenu> = new Map<OwnerMenu, OwnerMenu>();

  /** A selected parent node to be inserted */
  // selectedParent: ownerMenu | null = null;

  /** Flat tree control. Able to expand/collapse a subtree recursively for flattened tree. */
  treeControl: FlatTreeControl<OwnerMenu>;

  // * Tree flattener to convert a normal type of node to node with children & level information.
  treeFlattener: MatTreeFlattener<OwnerMenu, OwnerMenu>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<OwnerMenu>(true /* multiple */);
  // _selectedItems = [];
  dataSource: MatTreeFlatDataSource<OwnerMenu, OwnerMenu>;
  treeData: any[];
  orginalJson = [];
  _selectedNodes = [];
  saveCode: string;


  ngOnInit(): void {
    this.showLoaderImage = true;
    this.loadForm();
    this.getApplication();
  }
  loadForm() {
    this.applicationForm = this.formBuilder.group({
      applicationCode: [null, [Validators.required]]
    });
  }
  getApplication() {
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
    this.dataSource.data = [];
    if ($event.value) {
      this.applicationForm.controls['applicationCode'].setValue($event.itemData.code);
      this.saveCode = $event.itemData.code;
      this.getMenus();
    }
  }

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */

  constructor(private formBuilder: FormBuilder, private ownerMenuService: OwnerMenuService, private httpService: HttpClient,
    private globalService: globalSharedService, private dialogService: DialogService, private applicationService: ApplicationService,
    private route: Router) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<OwnerMenu>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  // Refresh
  refreshTableListFunction() {
    // this.getMenus();
  }

  getLevel = (node: OwnerMenu) => { return node.level; };

  isExpandable = (node: OwnerMenu) => { return node.expandable; };

  getChildren = (node: OwnerMenu): Observable<OwnerMenu[]> => {
    return ofObservable(node.menus);
  }

  hasChild = (_: number, _nodeData: OwnerMenu) => { return _nodeData.expandable; };

  hasNoContent = (_: number, _nodeData: OwnerMenu) => { return _nodeData.name === ''; };

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: OwnerMenu, level: number) => {
    let flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.name === node.name ? this.nestedNodeMap.get(node)! : new OwnerMenu();
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
  descendantsAllSelected(node: OwnerMenu): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: OwnerMenu): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: OwnerMenu): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
    this.markSelectedNode(node, this.checklistSelection.isSelected(node));
    this._selectedNodes = this.checklistSelection.selected;
    this.saveButtonDisableStatusUpdate(this._selectedNodes);
    this.menuDirtyStatus = false;
  }


  //Save Button Disable Status Update
  saveButtonDisableStatusUpdate(nodeLength) {
    if (nodeLength.length > 0) this.saveButtonDisableStatus = false;
    else this.saveButtonDisableStatus = true;
  }


  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: OwnerMenu): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this._selectedNodes = this.checklistSelection.selected
    this.saveButtonDisableStatusUpdate(this._selectedNodes);
    this.markSelectedNode(node, this.checklistSelection.isSelected(node));
    this.menuDirtyStatus = false;
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: OwnerMenu): void {
    let parent: OwnerMenu | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: OwnerMenu): void {
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
  getParentNode(node: OwnerMenu): OwnerMenu | null {
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
  //Save menus
  SaveOwnerMenu() {
    this.showLoaderImage = true;
    let orginalJson = JSON.parse(JSON.stringify(this.orginalJson));
    this.stripUnselectedNodes(orginalJson);
    var ownerMenu = new OwnerMenu();
    ownerMenu.ownerId = this.ownerId;
    ownerMenu.createdBy = this.userId;
    ownerMenu.menus = this.getFormattedMenuList(orginalJson);
    this.ownerMenuService.SaveOwnerMenu(ownerMenu, this.saveCode).subscribe(res => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }


  //To iterate to get all the menus its call recursively
  menuIterate(menus) {
    const that = this;
    return menus && menus.length ? menus.map(function (o) {
      var returnObj = {
        "name": o.name,
        "menuItemOrder": o.menuItemOrder,
        "menus": that.menuIterate(o.menus),
        "menuId": o.menuId,
        "applicationId": o.applicationId
      }
      if (o.parentOwnerMenuId) {
        returnObj["parentOwnerMenuId"] = o.parentOwnerMenuId;
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
        applicationId: l.applicationId
      };
    });
  }
  getMenus() {
    this.showLoaderImage = true;
    // let applicationCode = this.applicationForm.value.applicationCode;
    let organizationId = sessionStorage.getItem('beId');
    this.ownerMenuService.getOwnerMenuList(parseInt(organizationId), this.saveCode).subscribe(res => {
      this.showLoaderImage = false;
      this._selectedNodes = [];
      if (Array.isArray(res) && res.length) {
        this.orginalJson = res;
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.dataSource.data = res.sort((a, b) => a.id - b.id);
        this.updateTreeCheckbox(this.treeControl.dataNodes);
        this.ownerDetailList = res[0];
        this.assignMenusBlock = true;
        this.noRecordBlock = false;
        this.menuDirtyStatus = true;
        this.saveButtonDisableStatus = false;
      } else {
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

  resetOwnerMenu() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.getMenus();
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
    }
    this.warningFlag = "";
  }

  redirectTo() {
    this.saveButtonDisableStatus = true;
    this.menuDirtyStatus = true;
    this.applicationForm.controls['applicationCode'].setValue(null);
    this.dataSource.data = [];
    this.applicationForm.controls['applicationCode'].markAsUntouched();
  }
  // User search
  filterChanged(filterText: string) {
    this.applyFilter(this.treeControl.dataNodes, filterText);
    this.visibleNodes = this.treeControl.dataNodes.filter(
      node => node.visible === true);
    if (this.visibleNodes.length == 0) {
      this.noRecordBlock = true;
    } else {
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
}
