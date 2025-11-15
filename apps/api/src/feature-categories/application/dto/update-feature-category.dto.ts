import { PartialType } from '@nestjs/swagger';
import { CreateFeatureCategoryDto } from './create-feature-category.dto';

export class UpdateFeatureCategoryDto extends PartialType(CreateFeatureCategoryDto) {}

