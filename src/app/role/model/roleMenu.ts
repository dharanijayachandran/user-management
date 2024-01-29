import { Menu } from "src/app/Shared/model/menu";

export class RoleMenu extends Menu{
    menuId:number;
    menuName:string;
    declare applicationId:number;
    declare menus:RoleMenu[];
    isLandingMenu:boolean;
    declare visible:boolean;
}
