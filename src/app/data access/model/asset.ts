
export class Asset {
  id: number;
  name: string;
  organizationId: number;
  description: string;
  refAssetId: number;
  subAssets: Asset[];
  createdBy: number;
  updatedBy: number;
  status: string;
  visible: boolean;
  hasChild: boolean;
}