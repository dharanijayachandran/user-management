export class DataAccess {
    id: number;
    accessGroupId: number;
    entityTypeId: number;
    entityId: number;
    entityName: string;
    dataAccessDetail: DataAccessDetail[];
    status: string
    createdBy: number;
    updatedBy: number;
    level: number;
    expandable: boolean;
    isSelected: boolean;
    parentEntityId: number;
    isEditable: boolean;
    childEntity: DataAccess[];
}

export class SelectedDataAccess {
    assignedDataAccess: DataAccess[];
    selectedDataAccess: DataAccess[];

}

export class DataAccessDetail {
    id:number;
    accessTypeId: number;
    dataAccessId: number;
    status: string
    createdBy: number;
    updatedBy: number;
}