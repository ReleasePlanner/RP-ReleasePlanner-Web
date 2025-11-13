import { BaseEntity } from '../../common/base/base.entity';

export class ProductOwner extends BaseEntity {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
    this.validate();
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Product owner name is required');
    }
  }
}

