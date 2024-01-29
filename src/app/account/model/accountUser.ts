import { User } from "../../model/user";

export interface AccountUser extends User {
    accountId: number;
    accountName: string;
    userAddress2: string;
}