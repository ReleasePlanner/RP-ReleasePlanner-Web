import { Country } from '../../domain/country.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CountryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ required: false })
  isoCode?: string;

  @ApiProperty({ required: false })
  region?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(entity: Country) {
    this.id = entity.id;
    this.name = entity.name;
    this.code = entity.code;
    this.isoCode = entity.isoCode;
    this.region = entity.region;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

