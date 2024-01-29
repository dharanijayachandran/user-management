import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
//in place where you wanted to use `HttpClient`
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of as ofObservable } from 'rxjs';
import { TenantMenuService } from '../../services/tenantMenu/tenant-menu.service';
import { OrganizationMenu } from '../../model/OrganizationMenu';
import { DialogService, UIModalNotificationPage } from 'global';
import { ApplicationService } from '../../services/application/application.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Application } from '../../model/application';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';

@Component({
  selector: 'app-tenant-menu',
  templateUrl: './tenant-menu.component.html',
  styleUrls: ['./tenant-menu.component.css'],
})
export class TenantMenuComponent implements OnInit {
  [x: string]: any;
  visibleNodes: OrganizationMenu[];
  saveButtonStatus = true;
  selectedApplication;
  menuForm: FormGroup;
  organizationName: any;
  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (true) {
      this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
    } else {
      return true; // returning true will navigate without confirmation
    }
    return this.dialogService.navigateAwaySelection$;
  }

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  showLoaderImage: boolean;
  saveButtonDisableStatus: boolean = true;
  assignMenusBlock = false;
  getTanantId = sessionStorage.getItem('tenId');
  tenantId = Number(this.getTanantId);
  getUserId = sessionStorage.getItem('userId');
  userId = parseInt(this.getUserId, 10);
  noRecordBlock = false;
  serviceMessage: string;
  dynamicRedirection: string;
  warningFlag: string;
  public applicationField: Object = { text: 'name', value: 'id' };
  public applications = [];
  public id;
  saveCode: string;
  public applicationWaterMark: string = 'Select Application Name';
  public height: string = '220px';
  public sortDropDown: string = 'Ascending';
  public filterPlaceholder: string = 'Search';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private tenantMenuService: TenantMenuService,
    private httpService: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: globalSharedService,
    private applicationService: ApplicationService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<OrganizationMenu>(this.getLevel, this.isExpandable);
  }
  // gettingTenantDetailList: object;
  @Input('tenantValueChild') public gettingTenantDetailList;
  ngOnInit() {
    this.menuFormRegister();
    this.getApplication();
    this.id = this.gettingTenantDetailList.id;
    this.organizationName=this.gettingTenantDetailList.name;
  }

  menuFormRegister() {
    this.menuForm = this.formBuilder.group({
      tenantApplicationCode: [null, Validators.required]
    })
  }

  //application service
  getApplication() {
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

  getApplicationName(applicationId) {
    this.selectedApplication = this.applications.filter((e) => {
      return e.id == applicationId;
    })
  }
  applicationOnChange($event) {
    if ($event.value) {
      this.menuForm.controls['tenantApplicationCode'].setValue($event.itemData.code);
      this.saveCode = $event.itemData.code;
      this.getMenus();
    }
  }
  getMenus() {
    this.showLoaderImage = true;
    let beId = sessionStorage.getItem('beId');
    this.tenantMenuService.getTenantMenuList(Number(beId), Number(this.id), this.saveCode).subscribe(res => {
      this.showLoaderImage = false;
      if (Array.isArray(res) && res.length) {
        this.orginalJson = res;
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.dataSource.data = res.sort((a, b) => a.menuItemOrder - b.menuItemOrder);
        this.gettingTenantDetailList = res[0];
        this.updateTreeCheckbox(this.treeControl.dataNodes);
        this.noRecordBlock = false;
        this.assignMenusBlock = true;
      } else {
        this.dataSource.data = [];
        this.noRecordBlock = true;
        this.assignMenusBlock = false;
      }
    },
      error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  refreshTableListFunction() {
    this.getMenus();
  }

  nestedNodeMap: Map<OrganizationMenu, OrganizationMenu> = new Map<OrganizationMenu, OrganizationMenu>();
  treeControl: FlatTreeControl<OrganizationMenu>;
  treeFlattener: MatTreeFlattener<OrganizationMenu, OrganizationMenu>;
  checklistSelection = new SelectionModel<Application>(true /* multiple */);
  dataSource: MatTreeFlatDataSource<Application, Application>;
  orginalJson = [];
  _selectedNodes = [];
  getLevel = (node: OrganizationMenu) => { return node.level; };
  isExpandable = (node: OrganizationMenu) => { return node.expandable; };
  getChildren = (node: OrganizationMenu): Observable<OrganizationMenu[]> => {
    return ofObservable(node.menus);
  }
  hasChild = (_: number, _nodeData: OrganizationMenu) => { return _nodeData.expandable; };
  hasNoContent = (_: number, _nodeData: OrganizationMenu) => { return _nodeData.name === ''; };
  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: OrganizationMenu, level: number) => {
    let flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.name === node.name ? this.nestedNodeMap.get(node)! : new OrganizationMenu();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.id = node.menuId;
    flatNode.parentMenuId = node.parentMenuId;
    flatNode.expandable = (node.menus.length > 0) ? true : false;
    flatNode.isSelected = (node.isSelected) ? true : false;
    flatNode['visible'] = true;
    flatNode.status = 'A';
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: OrganizationMenu): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: OrganizationMenu): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: OrganizationMenu, saveButtonStatus): void {
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
    if (saveButtonStatus != false || saveButtonStatus == null || saveButtonStatus == undefined) {
      this.saveButtonStatus = true;
    }
    this.saveButtonDisableStatusUpdate(this._selectedNodes);
    //
  }

  //Save Button Disable Status Update
  saveButtonDisableStatusUpdate(nodeLength) {
    if (nodeLength.length > 0 && this.saveButtonStatus) this.saveButtonDisableStatus = false;
    else this.saveButtonDisableStatus = true;
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: OrganizationMenu): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this._selectedNodes = this.checklistSelection.selected;
    this.saveButtonStatus = true;
    this.saveButtonDisableStatusUpdate(this._selectedNodes);
    this.markSelectedNode(node, this.checklistSelection.isSelected(node));
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: OrganizationMenu): void {
    let parent: OrganizationMenu | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: OrganizationMenu): void {
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
  getParentNode(node: OrganizationMenu): OrganizationMenu | null {
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
  SaveTenantMenu() {
    this.showLoaderImage = true;
    let orginalJsonSvae = JSON.parse(JSON.stringify(this.orginalJson));
    this.stripUnselectedNodes(orginalJsonSvae);
    var organizationMenu = new OrganizationMenu();
    organizationMenu.organizationId = this.id;
    organizationMenu.createdBy = this.userId;
    organizationMenu.updatedBy = this.userId;
    organizationMenu.menus = this.getFormattedMenuList(orginalJsonSvae);
    this.tenantMenuService.SaveTenantMenu(organizationMenu, this.saveCode).subscribe(res => {
      this.showLoaderImage = false;
      this.dynamicRedirection = "mngMenu";
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.refreshTableListFunction();
    },
      (error: any) => {
        this.showLoaderImage = false;
        // If the unable to connect
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  // // closeModel
  redirectTo() {
    // let mngTenant = document.getElementById('mngTenant');
    // mngTenant.click();
  }

  //To iterate to get all the menus its call recursively
  menuIterate(menus) {
    const that = this;
    return menus && menus.length ? menus.map(function (o) {
      if (o) {
        var returnObj = {
          "name": o.name,
          "menuItemOrder": o.menuItemOrder,
          "menus": that.menuIterate(o.menus),
          "menuId": o.menuId,
          "id": o.id,
          "applicationId": o.applicationId,
          "status": that.status(o.status),
          "createdBy": that.setCreatedBy(o.id),
          "updatedBy": that.setUpdatedBy(o.id),
          "organizationId": that.id,
        }
        if (o.parentOrganizationMenuId) {
          returnObj["parentOrganizationMenuId"] = o.parentOrganizationMenuId;
        }
      }
      return returnObj;
    }) : [];
  }
  getFormattedMenuList(list) {
    const that = this;
    return list.map(function (l) {
      if (l) {
        return {
          name: l.name,
          menuId: l.menuId,
          id: l.id,
          menus: that.menuIterate(l.menus),
          "status": that.status(l.status),
          "menuItemOrder": l.menuItemOrder,
          "createdBy": that.setCreatedBy(l.id),
          "updatedBy": that.setUpdatedBy(l.id),
          "organizationId": that.id,
           applicationId: l.applicationId
        };
      }
    });
  }
  status(status: any) {
    if (status === undefined) {
      return "A"
    } else if (status === "Active") {
      return "A"
    } else {
      return status;
    }
  }
  setCreatedBy(id) {
    if (id === null || id === undefined) {
      return this.userId;
    }
  }
  setUpdatedBy(id) {
    if (id != null || id != undefined) {
      return this.userId;
    }
  }

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
      if (typeof o[i]["id"] && o[i]["isSelected"] === false) {
        o[i]["status"] = "I";
      }
      if (typeof o[i]["isSelected"] === 'undefined' || ((typeof o[i]["id"] === 'undefined' || o[i]["id"] === 'null') && o[i]["isSelected"] === false)) {
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
    for (let node in checkedNodes) this.todoItemSelectionToggle(checkedNodes[node], false);
  }

  //This method for update check box
  //Cancel ------------> navigate to tenant list view
  CancelTenantMenu() {
    this.warningFlag = "cancel";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Confirm redirect to
  formCancelConfirm() {
    let mngTenant = document.getElementById('mngTenant');
    mngTenant.click();
  }

  resetTenantMenu() {
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
  //Back Button
  backToTenant() {
    let mngTenant = document.getElementById('mngTenant');
    mngTenant.click();
  }

}



