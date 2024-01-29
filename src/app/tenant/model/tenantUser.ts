import { Address } from "src/app/Shared/model/Address";
import { User } from "src/app/model/user";


export interface TenantUser extends User {
    tenantId: number;
    tenantName: string;
    addresses: Address[];
    address: Address;
    userAddress2: string
}
