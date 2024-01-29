
export class AccountMenu{
    id:number;
    accountId : number;
    accountName : string;
    parentMenuId: number;
    name:string;
    menuId:number;
    menuName:string;
    parentAccountMenuId:number;
    parentAccountMenuName:string;
    menuItemOrder:string;
    menus:AccountMenu[];
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    updatedOn: Date;
    level: number;
    expandable:boolean;
    isSelected:boolean;
    visible:boolean;  
}