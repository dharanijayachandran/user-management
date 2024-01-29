import { Address } from "src/app/Shared/model/Address";

export class Tenant {
  id: number;
  name: String;
  emaild: String;
  ownerId: number;
  createdBy: String;
  mobileNumberPrimary: String;
  description: String;
  numberOfUsers: number;
  webSite: String;
  faxNumber: String;
  skypeId: String;
  mobileNumberSecondary: String;
  phoneNumberPrimary: String;
  phoneNumberSecondary: String;
  status: String;
  addresses: Address[];
  address: Address;
  numberOfUser: number;
}
