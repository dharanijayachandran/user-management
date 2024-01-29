import { AccessGroupUser } from "./AccessGroupUser";
import { CommonProperty } from "./CommonProperty";


export class AccessGroup extends CommonProperty {
    name: string;
    description: string;
    organizationId: number;
    accessGroupUser: AccessGroupUser[];
    accessGroupUserNames: string[];
}