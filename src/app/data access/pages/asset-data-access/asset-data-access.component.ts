import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MasterService } from 'src/app/services/master service/master-service.service';
import { AccessGroup } from '../../model/AccessGroup';
import { AccessType } from '../../model/accessType';
import { DataAccess, DataAccessDetail, SelectedDataAccess } from '../../model/dataAccess';
import { AccessGroupService } from '../../services/access group/access-group.service';
import { DataAccessService } from '../../services/data access/data-access.service';
import { globalSharedService } from 'src/app/Shared/services/global/globalSharedService';
import { MatTablePaginatorComponent } from 'src/app/Shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-asset-data-access',
  templateUrl: './asset-data-access.component.html',
  styleUrls: ['./asset-data-access.component.css']
})
export class AssetDataAccessComponent implements OnInit {

  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  dataAccessForm: FormGroup;
  displayedColumns: string[] = ['id', 'entityName', 'read', 'update', 'delete', 'monitor', 'control'];
  checkBoxToolTip: string = "Select All";
  dataSource: any;
  selection = new SelectionModel<DataAccess>(true, []);
  readSelection = new SelectionModel<DataAccessDetail>(true, []);
  updateSelection = new SelectionModel<DataAccessDetail>(true, []);
  deleteSelection = new SelectionModel<DataAccessDetail>(true, []);
  monitorSelection = new SelectionModel<DataAccessDetail>(true, []);
  controlSelection = new SelectionModel<DataAccessDetail>(true, []);
  noRecordBlock = false;
  accessGroups: AccessGroup[];
  orginalJson = [];
  selectedNodesData = [];
  accessTypes: AccessType[];
  dataAccess: DataAccess;
  showLoaderImage: boolean;
  assetMap = new Map<number, DataAccessDetail[]>();
  accessTypesMap = new Map<String, Number>();
  saveButtonDisableStatus = false;
  checkedAssetIds = new Set();
  selectedAccessTypesLength = new Set();
  sort;
  updateCheckBoxToolTip: string = "Select All";
  readCheckBoxToolTip: string = "Select All";
  deleteCheckBoxToolTip: string = "Select All";
  monitorCheckBoxToolTip: string = "Select All";
  controlCheckBoxToolTip: string = "Select All";
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  constructor(private formBuilder: FormBuilder, private dataAccessService: DataAccessService, private masterservice: MasterService, private accessGroupService: AccessGroupService, private globalService: globalSharedService) {

  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.showLoaderImage = true;
    this.assetMap.clear();
    this.loadDataAccessForm();
    this.getAccessGroups();
    this.getAccessTypes();
    this.getDataAccess(null);
  }

  loadDataAccessForm() {
    this.dataAccessForm = this.formBuilder.group({
      id: [null],
      accessGroupId: [null, Validators.required],
    })
  }

  getAccessGroups() {
    let organizationId = sessionStorage.getItem("beId");
    this.accessGroupService.getAccessGroups(Number(organizationId))
      .subscribe(
        res => {
          if (Array.isArray(res) && res.length) {
            this.accessGroups = res;
            this.accessGroups = this.accessGroups.sort((a, b) => b.id - a.id);
          }
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  // Get all Acess Types
  getAccessTypes() {
    this.masterservice.getAccessTypes().subscribe(
      res => {
        this.accessTypes = res;
        this.accessTypes = this.accessTypes.sort((a, b) => a.id - b.id);
        this.accessTypes.forEach(element => {
          this.accessTypesMap.set(element.code, element.id)
        });
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  onChangeAccessGroup(event) {
    this.saveButtonDisableStatus = false;
    let accessGroupId;
    this.checkedAssetIds.clear();
    this.assetMap.clear();
    this.selectedAccessTypesLength.clear();
    if (event.target.options.selectedIndex === 0) {
      accessGroupId = 0;
    }
    else {
      accessGroupId = event.target.value;
    }
    this.getDataAccess(accessGroupId);
    this.showLoaderImage = true;
  }

  //To get all Assets
  getDataAccess(accessGroupId) {
    this.selectedNodesData = [];
    this.checkedAssetIds.clear();
    let userId = Number(sessionStorage.getItem("userId"));
    let organizationId = Number(sessionStorage.getItem("beId"));
    this.dataAccessService.getAssetDataAccessList(organizationId, accessGroupId, userId).subscribe(
      res => {
        this.showLoaderImage = false;
        if (Array.isArray(res) && res.length) {
          this.orginalJson = JSON.parse(JSON.stringify(res));
          this.getSelectedDataAccess();
          this.setDataAccessDetails(res)
          this.dataSource.data = res.sort((a, b) => b.id - a.id);
          // To get paginator events from child mat-table-paginator to access its properties
          this.myPaginator = this.myPaginatorChildComponent.getDatasource();
          this.matTablePaginator(this.myPaginator);
          this.dataSource.paginator = this.myPaginator;
          this.dataSource.sort = this.sort;
          this.updateCheckboxStatus(this.dataSource.data);
        }
        else {
          this.noRecordBlock = true
        }
      },
      error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }


  setDataAccessDetails(res) {
    res.forEach(element => {
      if (element.dataAccessDetail) {
        let selectedAccessTypes: DataAccessDetail[] = [];
        let dataAccessTypeMap = new Map<number, DataAccessDetail>();
        let dataAccessDetail = element.dataAccessDetail.sort((a, b) => a.accessTypeId - b.accessTypeId);
        dataAccessDetail.forEach(element => {
          dataAccessTypeMap.set(element.accessTypeId, element);
        });
        for (let e of this.accessTypes) {
          if (dataAccessTypeMap.has(e.id)) {
            let dataAccessDetailObject = dataAccessTypeMap.get(e.id);
            let dataAccessDetailObj = new DataAccessDetail();
            dataAccessDetailObj.accessTypeId = dataAccessDetailObject.accessTypeId;
            dataAccessDetailObj.dataAccessId = dataAccessDetailObject.dataAccessId;
            dataAccessDetailObj.id = dataAccessDetailObject.id;
            dataAccessDetailObj.status = dataAccessDetailObject.status;
            dataAccessDetailObj.updatedBy = Number(sessionStorage.getItem("userId"));
            selectedAccessTypes.push(dataAccessDetailObj);
          }
          else {
            let dataAccessDetailObj = new DataAccessDetail();
            dataAccessDetailObj.accessTypeId = null;
            dataAccessDetailObj.dataAccessId = null;
            dataAccessDetailObj.id = null;
            dataAccessDetailObj.createdBy = Number(sessionStorage.getItem("userId"));
            dataAccessDetailObj.status = 'A'
            selectedAccessTypes.push(dataAccessDetailObj);
          }
        }
        element.dataAccessDetail = selectedAccessTypes;
      } else {
        let selectedAccessTypes: DataAccessDetail[] = [];
        for (let element of this.accessTypes) {
          let dataAccessDetailObj = new DataAccessDetail();
          dataAccessDetailObj.accessTypeId = null;
          dataAccessDetailObj.dataAccessId = null;
          dataAccessDetailObj.id = null;
          dataAccessDetailObj.createdBy = Number(sessionStorage.getItem("userId"));
          dataAccessDetailObj.status = 'A'
          selectedAccessTypes.push(dataAccessDetailObj);
        }
        element.dataAccessDetail = selectedAccessTypes;
      }
      /* if (element.isSelected) {
        this.checkValidation(element.isSelected, element);
      } */
    });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if (numSelected === numRows)
      this.checkBoxToolTip = "Deselect All";
    else
      this.checkBoxToolTip = "Select All";
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(event) {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.readSelection.clear();
      this.updateSelection.clear();
      this.deleteSelection.clear();
      this.monitorSelection.clear();
      this.controlSelection.clear();
      this.dataSource.data.forEach(row => {
        this.masterIsSelectionToggle(event, row);
      });
      // this.saveButtonDisableStatus = false;
    }
    else {
      this.dataSource.data.forEach(row => {
        this.masterIsSelectionToggle(event, row);
      });
    }
    this.saveButtonDisableStatusUpdate();
    if (!event.checked) {
      this.readCheckBoxToolTip = "Select All";
      this.updateCheckBoxToolTip = "Select All";
      this.deleteCheckBoxToolTip = "Select All";
      this.monitorCheckBoxToolTip = "Select All";
      this.controlCheckBoxToolTip = "Select All";
    }
  }
  masterIsSelectionToggle(event, row) {
    if (event.checked) {
      row.isSelected = true;
      if (!this.checkedAssetIds.has(row.entityId) && !this.selectedAccessTypesLength.has(row.entityId)) {
        this.checkedAssetIds.add(row.entityId);
      }
      if (!this.assetMap.has(row.entityId)) {
        this.assetMap.set(row.entityId, []);
      }
      this.selection.select(row)
    }
    else {
      row.isSelected = false;
      if (this.checkedAssetIds.has(row.entityId)) {
        this.checkedAssetIds.delete(row.entityId);
      }
      if (this.assetMap.has(row.entityId)) {
        this.assetMap.delete(row.entityId);
      }
      if (this.selectedAccessTypesLength.has(row.entityId)) {
        this.selectedAccessTypesLength.delete(row.entityId);
      }
      this.selection.deselect(row)
    }
  }

  allAccessTypesDeselectedValidaion() {
    this.assetMap.forEach((dataAccessDetail: DataAccessDetail[], entityId: Number) => {
      if (dataAccessDetail.length === 0) {
        this.checkedAssetIds.add(entityId);
        this.selectedAccessTypesLength.delete(entityId);
      }
    });
    /*  if (this.readSelection.selected.length == 0 && this.updateSelection.selected.length == 0 && this.deleteSelection.selected.length == 0 && this.monitorSelection.selected.length == 0 && this.controlSelection.selected
       .length == 0) {
       this.dataSource.data.forEach(row => {
         this.checkedAssetIds.add(row.entityId)
       }); */
    this.saveButtonDisableStatusUpdate();
    //}
  }
  masterSingleSelectionToggle(event, row) {
    this.masterIsSelectionToggle(event, row);
    if (!event.checked) {
      this.readToggleSelection(false, row);
      this.updateToggleSelection(false, row);
      this.deleteToggleSelection(false, row);
      this.monitorToggleSelection(false, row);
      this.controlToggleSelection(false, row);
    }
    this.saveButtonDisableStatusUpdate();
  }


  getDataAccessDetails(row, readAccessTypes, updateAccessTypes, deleteAccessTypes, monitorAccessTypes, controlAccessTypes) {
    if (row.dataAccessDetail) {
      let dataAccessDetialList = row.dataAccessDetail.filter((e) => e.accessTypeId != null);
      dataAccessDetialList.forEach(element => {
        this.accessTypesSelection(element, readAccessTypes, updateAccessTypes, deleteAccessTypes, monitorAccessTypes, controlAccessTypes);
      });
    }
  }
  accessTypesSelection(element, readAccessTypes, updateAccessTypes, deleteAccessTypes, monitorAccessTypes, controlAccessTypes) {
    this.accessTypes.forEach(e => {
      if (e.id === element.accessTypeId && e.code == "READ") {
        readAccessTypes.push(element);
      }
      else if (e.id === element.accessTypeId && e.code == "WRITE") {
        updateAccessTypes.push(element);
      }
      else if (e.id === element.accessTypeId && e.code == "DELETE") {
        deleteAccessTypes.push(element);
      }
      else if (e.id === element.accessTypeId && e.code == "MONITOR") {
        monitorAccessTypes.push(element);
      }
      else if (e.id === element.accessTypeId && e.code == "CONTROL") {
        controlAccessTypes.push(element);
      }
    });
  }


  /* The label for the checkbox on the passed row */
  checkboxLabel(row?: DataAccess): string {
    if (!row) {
      let row = `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      return row;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  /* This method used to update checkbox status when it's loaded into the view */
  updateCheckboxStatus(dataAccessList) {
    let readAccessTypes: DataAccessDetail[] = [];
    let updateAccessTypes: DataAccessDetail[] = [];
    let deleteAccessTypes: DataAccessDetail[] = [];
    let monitorAccessTypes: DataAccessDetail[] = [];
    let controlAccessTypes: DataAccessDetail[] = [];
    let checkedNodes = dataAccessList.filter((e) => e.isSelected === true);
    this.selection = new SelectionModel(true, checkedNodes);
    if (checkedNodes) {
      checkedNodes.forEach(element => {
        this.getDataAccessDetails(element, readAccessTypes, updateAccessTypes, deleteAccessTypes, monitorAccessTypes, controlAccessTypes);
        this.addOrRemoveDataAccessValidation(true, element);
      });
      this.readSelection = new SelectionModel<DataAccessDetail>(true, readAccessTypes);
      this.updateSelection = new SelectionModel<DataAccessDetail>(true, updateAccessTypes);
      this.deleteSelection = new SelectionModel<DataAccessDetail>(true, deleteAccessTypes);
      this.monitorSelection = new SelectionModel<DataAccessDetail>(true, monitorAccessTypes);
      this.controlSelection = new SelectionModel<DataAccessDetail>(true, controlAccessTypes);
      this.saveButtonDisableStatusUpdate();
    }
  }

  resetdataAccessForm() {
    this.dataAccessForm.reset();
    this.getDataAccess(null);
  }


  redirectTo() {

  }
  saveDataAccess() {
    this.showLoaderImage = true;
    let dataAccessList: DataAccess[] = [];
    let selectedAssetAccess = new SelectedDataAccess();
    this.dataAccess = this.dataAccessForm.value;
    this.selection.selected.forEach(element => {
      let dataAccessobj: DataAccess = new DataAccess();
      dataAccessobj.accessGroupId = Number(this.dataAccess.accessGroupId);
      dataAccessobj.createdBy = Number(sessionStorage.getItem("userId"));
      dataAccessobj.updatedBy = Number(sessionStorage.getItem("userId"));
      dataAccessobj.entityId = element.entityId;
      dataAccessobj.entityTypeId = 1;
      dataAccessobj.dataAccessDetail = element.dataAccessDetail.filter(element => element.accessTypeId != null);
      dataAccessobj.status = "A";
      dataAccessList.push(dataAccessobj);
    })
    selectedAssetAccess.assignedDataAccess = this.selectedNodesData;
    selectedAssetAccess.selectedDataAccess = dataAccessList;
    this.dataAccessService.saveDataAccess(selectedAssetAccess)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          this.refreshTableListFunction();
          // Success response
          this.modelNotification.alertMessage(res['messageType'], res['message']);
        }, (error) => {
          this.showLoaderImage = false;
          this.refreshTableListFunction();
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }


  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }
  removeDuplicates(arr) {
    var o = {}
    arr.forEach(function (e) {
      o[e] = true
    })
    return Object.keys(o)
  }
  getSelectedDataAccess() {
    this.orginalJson.forEach(e => {
      if (e.isSelected == true && e.dataAccessDetail != null) {
        this.selectedNodesData.push(e);
      }
      else if (e.isSelected === false && e.dataAccessDetail != null) {
        this.selectedNodesData.push(e);
      }
    })
  }

  refreshTableListFunction() {
    this.selectedNodesData = []
    this.assetMap.clear();
    this.showLoaderImage = true;
    this.getDataAccess(this.dataAccessForm.value['accessGroupId']);
  }



  masterReadToggle(event) {
    if (this.isAllReadSelected()) {
      this.dataSource.data.forEach(row => this.readToggleChecked(false, row));
      this.readSelection.clear();
      this.allclearAccessTypesValidation("READ");
      this.allAccessTypesDeselectedValidaion();
    } else {
      this.dataSource.data.forEach(row => this.readToggleChecked(event.checked, row));
    }
    if (!event.checked)
      this.readCheckBoxToolTip = "Select All";
  }
  readToggleChecked(checked, row) {
    this.readToggleSelection(checked, row);
    this.addOrRemoveDataAccessValidation(checked, row);
  }
  readToggleSelection(checked, row) {
    if (checked) {
      row.dataAccessDetail[0].accessTypeId = this.accessTypesMap.get("READ");
      row.dataAccessDetail[0].dataAccessId = row.id != undefined ? row.id : null;
      this.readSelection.select(row.dataAccessDetail[0])
    }
    else {
      row.dataAccessDetail[0].accessTypeId = null;
      row.dataAccessDetail[0].dataAccessId = null;
      this.readSelection.deselect(row.dataAccessDetail[0])
    }
  }
  addOrRemoveDataAccessValidation(checked, row) {
    let dataAccessDetialList = row.dataAccessDetail.filter((e) => e.accessTypeId != null);
    this.assetMap.set(row.entityId, dataAccessDetialList);
    if (dataAccessDetialList && dataAccessDetialList.length > 0) {
      this.selectedAccessTypesLength.add(row.entityId);
    }
    else {
      this.selectedAccessTypesLength.delete(row.entityId);
    }
    if (checked) {
      if (this.checkedAssetIds.has(row.entityId)) {
        this.checkedAssetIds.delete(row.entityId);
      }
    }
    if (dataAccessDetialList && dataAccessDetialList.length == 0) {
      if (!this.checkedAssetIds.has(row.entityId)) {
        this.checkedAssetIds.add(row.entityId);
      }
    }
    /*  else {
        if (dataAccessDetialList && dataAccessDetialList.length == 0) {
          if (!this.checkedAssetIds.has(row.entityId)) {
            this.checkedAssetIds.add(row.entityId);
          }
        }
     } */
    this.saveButtonDisableStatusUpdate();
  }
  isAllReadSelected() {
    const numSelected = this.readSelection.selected.length;
    const numRows = this.noOfDataSourceLength();
    if (numSelected === numRows)
      this.readCheckBoxToolTip = "Deselect All";
    else
      this.readCheckBoxToolTip = "Select All";
    return numSelected === numRows;
  }

  noOfDataSourceLength() {
    const numRows = this.dataSource.data.length;
    return numRows;
  }
  masterUpdateToggle(event) {
    if (this.isAllUpdateSelected()) {
      this.dataSource.data.forEach(row => this.updateToggleChecked(false, row));
      this.updateSelection.clear();
      this.allclearAccessTypesValidation("WRITE");
      this.allAccessTypesDeselectedValidaion();
    } else {
      this.dataSource.data.forEach(row => this.updateToggleChecked(event.checked, row));
    }
    if (!event.checked)
      this.updateCheckBoxToolTip = "Select All";
  }


  updateToggleChecked(checked, row) {
    this.updateToggleSelection(checked, row);
    this.addOrRemoveDataAccessValidation(checked, row);
  }

  updateToggleSelection(checked, row) {
    if (checked) {
      row.dataAccessDetail[1].accessTypeId = this.accessTypesMap.get("WRITE");
      row.dataAccessDetail[1].dataAccessId = row.id != undefined ? row.id : null;
      this.updateSelection.select(row.dataAccessDetail[1])
    }
    else {
      row.dataAccessDetail[1].accessTypeId = null;
      row.dataAccessDetail[1].dataAccessId = null;
      this.updateSelection.deselect(row.dataAccessDetail[1])
    }
  }
  isAllUpdateSelected() {
    const numSelected = this.updateSelection.selected.length;
    const numRows = this.noOfDataSourceLength();
    if (numSelected === numRows)
      this.updateCheckBoxToolTip = "Deselect All";
    else
      this.updateCheckBoxToolTip = "Select All";
    return numSelected === numRows;
  }
  masterDeleteToggle(event) {
    if (this.isAllDeleteSelected()) {
      this.dataSource.data.forEach(row => this.deleteToggleChecked(false, row));
      this.deleteSelection.clear();
      this.allclearAccessTypesValidation("DELETE");
      this.allAccessTypesDeselectedValidaion();
    } else { this.dataSource.data.forEach(row => this.deleteToggleChecked(event.checked, row)); }
    if (!event.checked)
      this.deleteCheckBoxToolTip = "Select All";
  }
  isAllDeleteSelected() {
    const numSelected = this.deleteSelection.selected.length;
    const numRows = this.noOfDataSourceLength();
    if (numSelected === numRows)
      this.deleteCheckBoxToolTip = "Deselect All";
    else
      this.deleteCheckBoxToolTip = "Select All";
    return numSelected === numRows;
  }

  deleteToggleChecked(checked, row) {
    this.deleteToggleSelection(checked, row);
    this.addOrRemoveDataAccessValidation(checked, row);
  }
  deleteToggleSelection(checked, row) {
    if (checked) {
      row.dataAccessDetail[2].accessTypeId = this.accessTypesMap.get("DELETE");
      row.dataAccessDetail[2].dataAccessId = row.id != undefined ? row.id : null;
      this.deleteSelection.select(row.dataAccessDetail[2])
    }
    else {
      row.dataAccessDetail[2].accessTypeId = null;
      row.dataAccessDetail[2].dataAccessId = null;
      this.deleteSelection.deselect(row.dataAccessDetail[2])
    }
  }
  masterMonitorToggle(event) {
    if (this.isAllMonitorSelected()) {
      this.dataSource.data.forEach(row => this.monitorToggleChecked(false, row));
      this.monitorSelection.clear();
      this.allclearAccessTypesValidation("MONITOR");
      this.allAccessTypesDeselectedValidaion();
    } else {
      this.dataSource.data.forEach(row => this.monitorToggleChecked(event.checked, row));
    }
    if (!event.checked)
      this.monitorCheckBoxToolTip = "Select All";
  }
  monitorToggleChecked(checked, row) {
    this.monitorToggleSelection(checked, row);
    this.addOrRemoveDataAccessValidation(checked, row);
  }

  monitorToggleSelection(checked, row) {
    if (checked) {
      row.dataAccessDetail[3].accessTypeId = this.accessTypesMap.get("MONITOR");
      row.dataAccessDetail[3].dataAccessId = row.id != undefined ? row.id : null;
      this.monitorSelection.select(row.dataAccessDetail[3])
    }
    else {
      row.dataAccessDetail[3].accessTypeId = null;
      row.dataAccessDetail[3].dataAccessId = null;
      this.monitorSelection.deselect(row.dataAccessDetail[3])
    }
  }
  isAllMonitorSelected() {
    const numSelected = this.monitorSelection.selected.length;
    const numRows = this.noOfDataSourceLength();
    if (numSelected === numRows)
      this.monitorCheckBoxToolTip = "Deselect All";
    else
      this.monitorCheckBoxToolTip = "Select All";
    return numSelected === numRows;
  }
  masterControlToggle(event) {
    if (this.isAllControlSelected()) {
      this.dataSource.data.forEach(row => this.controlToggleChecked(false, row));
      this.controlSelection.clear();
      this.allclearAccessTypesValidation("CONTROl");
      this.allAccessTypesDeselectedValidaion();
    } else {
      this.dataSource.data.forEach(row => this.controlToggleChecked(event.checked, row));
    }
    if (!event.checked)
      this.controlCheckBoxToolTip = "Select All";
  }
  controlToggleChecked(checked, row) {
    this.controlToggleSelection(checked, row);
    this.addOrRemoveDataAccessValidation(checked, row);
  }
  controlToggleSelection(checked, row) {
    if (checked) {
      row.dataAccessDetail[4].accessTypeId = this.accessTypesMap.get("CONTROL");
      row.dataAccessDetail[4].dataAccessId = row.id != undefined ? row.id : null;
      this.controlSelection.select(row.dataAccessDetail[4])
    }
    else {
      row.dataAccessDetail[4].accessTypeId = null;
      row.dataAccessDetail[4].dataAccessId = null;
      this.controlSelection.deselect(row.dataAccessDetail[4])
    }
  }
  isAllControlSelected() {
    const numSelected = this.controlSelection.selected.length;
    const numRows = this.noOfDataSourceLength();
    if (numSelected === numRows)
      this.controlCheckBoxToolTip = "Deselect All";
    else
      this.controlCheckBoxToolTip = "Select All";
    return numSelected === numRows;
  }

  singleReadSelection(event, object) {
    this.readToggleChecked(event.checked, object);
  }
  singleUpdateSelection(event, object) {
    this.updateToggleChecked(event.checked, object);
  }
  singleDeleteSelection(event, object) {
    this.deleteToggleChecked(event.checked, object);
  }
  singleMonitorSelection(event, object) {
    this.monitorToggleChecked(event.checked, object);
  }
  singleControlSelection(event, object) {
    this.controlToggleChecked(event.checked, object);
  }

  //Save Button Disable Status Update
  saveButtonDisableStatusUpdate() {
    if (this.selection.selected.length == 0) {
      this.saveButtonDisableStatus = false;
    }
    else if (this.selection.selected.length === (this.readSelection.selected.length || this.updateSelection.selected.length || this.deleteSelection.selected.length || this.monitorSelection.selected.length || this.controlSelection.selected
      .length)) {
      this.saveButtonDisableStatus = true;
    }
    else if (this.selection.selected.length === this.selectedAccessTypesLength.size) {
      this.saveButtonDisableStatus = true;
    }
    else {
      this.saveButtonDisableStatus = false;
    }
  }

  checkValidation(status, node) {
    if (status == true) {
      if (!this.checkedAssetIds.has(node.entityId)) {
        if (node.dataAccessDetail) {
          let dataAccessDetailsLength = node.dataAccessDetail.filter(element => element.accessTypeId != null).length;
          if (dataAccessDetailsLength <= 0) {
            this.checkedAssetIds.add(node.entityId);
          }
        }
        else {
          this.checkedAssetIds.add(node.entityId);
        }
      }
    }
    else {
      if (this.checkedAssetIds.has(node.entityId)) {
        this.checkedAssetIds.delete(node.entityId);
      }
    }
  }

  allclearAccessTypesValidation(acessTypeCode) {
    this.assetMap.forEach((dataAccessDetail: DataAccessDetail[], entityId: Number) => {
      dataAccessDetail.forEach((element, index) => {
        if (element.accessTypeId === this.accessTypesMap.get(acessTypeCode)) {
          dataAccessDetail.splice(index, 1)
        }
      });
    });
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
}
