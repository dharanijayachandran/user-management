import { Address } from "src/app/Shared/model/Address";

export interface Account {
  id: number;
  ownerId: string;
  name: string;
  emaild: string;
  createdBy: string;
  mobileNumberPrimary: string;
  description: string;
  numberOfUsers: string;
  webSite: string;
  faxNumber: string;
  skypeId: string;
  mobileNumberSecondary: string;
  phoneNumberPrimary: string;
  phoneNumberSecondary: string;
  status: string;
  addresses: Address[];
  address: Address;
  account: Account[];
}
