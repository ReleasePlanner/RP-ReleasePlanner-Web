import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFeatureCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Authentication',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

