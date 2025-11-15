import { IsString, IsNotEmpty } from 'class-validator';
import { IT_OWNER_VALIDATION_MESSAGES } from '../../constants';

export class CreateITOwnerDto {
  @IsString()
  @IsNotEmpty({ message: IT_OWNER_VALIDATION_MESSAGES.IT_OWNER_NAME_REQUIRED })
  name: string;
}

