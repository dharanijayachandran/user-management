import { Address } from "../Shared/model/Address";

export class OrganizationProfile {

    name: string;
    description: string;
    businessEntityTypeId: number;
    businessEntityTypeName: string;
    businessEntityRefId: number;
    businessEntityName: string;
    phoneNumberPrimary: string;
    phoneNumberSecondary: string;
    faxNumber: string;
    mobileNumberPrimary: string;
    mobileNumberSecondary: string;
    emaild: string;
    webSite: string;
    skypeId: string;
    numberOfUser: string;
    addresses: Address[];
    status:string;
    id: string;
}
