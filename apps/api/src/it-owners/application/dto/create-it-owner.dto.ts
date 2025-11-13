import { IsString, IsNotEmpty } from 'class-validator';

export class CreateITOwnerDto {
  @IsString()
  @IsNotEmpty({ message: 'IT Owner name is required' })
  name: string;
}

