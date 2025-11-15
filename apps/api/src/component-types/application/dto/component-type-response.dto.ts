export class ComponentTypeResponseDto {
  id: string;
  name: string;
  code?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: { 
    id: string; 
    name: string; 
    code?: string; 
    description?: string; 
    createdAt: Date; 
    updatedAt: Date 
  }) {
    this.id = entity.id;
    this.name = entity.name;
    this.code = entity.code;
    this.description = entity.description;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

