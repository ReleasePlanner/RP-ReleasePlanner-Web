import { PartialType } from '@nestjs/mapped-types';
import { CreateITOwnerDto } from './create-it-owner.dto';

export class UpdateITOwnerDto extends PartialType(CreateITOwnerDto) {}

