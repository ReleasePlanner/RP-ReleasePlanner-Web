import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({ description: 'Country name', example: 'United States' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Country code (2-3 letters)', example: 'US' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'ISO code (optional)', example: 'USA', required: false })
  @IsString()
  @IsOptional()
  isoCode?: string;

  @ApiProperty({ description: 'Region (optional)', example: 'North America', required: false })
  @IsString()
  @IsOptional()
  region?: string;
}

