import { Menu } from "src/app/Shared/model/menu";


export class OwnerMenu extends Menu {
    ownerId: number;
    menuId: number;
    declare applicationId:number;
    parentOwnerMenuId: number;
    declare menus: OwnerMenu[];
    ownerName: string
    declare visible:boolean;
}
