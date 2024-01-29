export class OrganizationMenu{
    id: number;
    organizationId : number;
    organizationName:string;
    parentMenuId: number;
    name:string;
    menuId:number;
    menuName:string;
    menuItemOrder:number;
    menus:OrganizationMenu[];
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    updatedOn: Date;
    level: number;
    expandable:boolean;
    isSelected:boolean;
    iconName:string;
    visible:boolean;
    status: string;
    applicationId:any;
    parentOrganizationMenuId:number;
    parentOrganizationMenuName: string;
}
