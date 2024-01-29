export class TenantRoleMenu{
    id: number;
    tenantId : number;
    tenantMenuId: number;
    tenantName:string;
    parentMenuId: number;
    name:string;
    menuId:number;
    menuName:string;
    parentTenantMenuId:number;
    parentTenantMenuName:string;
    menuItemOrder:number;
    menus:TenantRoleMenu[];
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    updatedOn: Date;
    level: number;
    expandable:boolean;
    isSelected:boolean;
    iconName:string;
    tenantRoleId:number;
    tenantMenuName:string;
}