import { BaseEntity } from "../../common/base/base.entity";
import { FeatureCategory } from "./feature-category.entity";
import { ProductOwner } from "./product-owner.entity";

export enum FeatureStatus {
  PLANNED = "planned",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  ON_HOLD = "on-hold",
}

export class Feature extends BaseEntity {
  name: string;
  description: string;
  category: FeatureCategory;
  status: FeatureStatus;
  createdBy: ProductOwner;
  technicalDescription: string;
  businessDescription: string;
  productId: string;

  constructor(
    name: string,
    description: string,
    category: FeatureCategory,
    status: FeatureStatus,
    createdBy: ProductOwner,
    technicalDescription: string,
    businessDescription: string,
    productId: string
  ) {
    super();
    this.name = name;
    this.description = description;
    this.category = category;
    this.status = status;
    this.createdBy = createdBy;
    this.technicalDescription = technicalDescription;
    this.businessDescription = businessDescription;
    this.productId = productId;
    this.validate();
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Feature name is required");
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new Error("Feature description is required");
    }
    if (!this.productId || this.productId.trim().length === 0) {
      throw new Error("Product ID is required");
    }
    if (!Object.values(FeatureStatus).includes(this.status)) {
      throw new Error(`Invalid feature status: ${this.status}`);
    }
  }
}
