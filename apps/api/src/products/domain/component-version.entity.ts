/**
 * Component Version Entity
 */
import { BaseEntity } from '../../common/base/base.entity';

export enum ComponentType {
  WEB = 'web',
  SERVICES = 'services',
  MOBILE = 'mobile',
}

export class ComponentVersion extends BaseEntity {
  type: ComponentType;
  currentVersion: string;
  previousVersion: string;

  constructor(type: ComponentType, currentVersion: string, previousVersion: string) {
    super();
    this.type = type;
    this.currentVersion = currentVersion;
    this.previousVersion = previousVersion;
    this.validate();
  }

  validate(): void {
    if (!Object.values(ComponentType).includes(this.type)) {
      throw new Error(`Invalid component type: ${this.type}`);
    }
    if (!this.currentVersion || this.currentVersion.trim().length === 0) {
      throw new Error('Current version is required');
    }
    if (!this.previousVersion || this.previousVersion.trim().length === 0) {
      throw new Error('Previous version is required');
    }
  }
}

