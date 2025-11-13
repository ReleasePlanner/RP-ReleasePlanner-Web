export class ITOwnerResponseDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: { id: string; name: string; createdAt: Date; updatedAt: Date }) {
    this.id = entity.id;
    this.name = entity.name;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

