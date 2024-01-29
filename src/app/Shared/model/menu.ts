export class Menu {
    id: number;
    name: string;
    description: string;
    parentMenuId: number;
    parentMenuName: string;
    menuItemOrder: number;
    pageUrl: string;
    createdBy: number;
    createdOn: Date;
    updatedBy: number;
    updatedOn: Date;
    iconId: number;
    status: string;
    level: number;
    expandable: boolean;
    isSelected: boolean;
    menus: Menu[];
    landingMenuUrl: string;
    visible:boolean;
    applicationId:number;
    applicationName:string;
}