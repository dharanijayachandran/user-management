export class TenantMenu{
    id: number;
    tenantId : number;
    tenantName:string;
    parentMenuId: number;
    name:string;
    menuId:number;
    menuName:string;
    parentTenantMenuId:number;
    parentTenantMenuName:string;
    menuItemOrder:number;
    menus:TenantMenu[];
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    updatedOn: Date;
    level: number;
    expandable:boolean;
    isSelected:boolean;
    iconName:string;
    visible:boolean;
}