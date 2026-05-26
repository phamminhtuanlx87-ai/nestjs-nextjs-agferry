import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

// DTO nhỏ cho File đính kèm
class DepartmentDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

// DTO nhỏ cho File đính kèm
class PositionsDto extends DepartmentDto {}

export class getMeDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @ValidateNested()
  isActive: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DepartmentDto)
  department: DepartmentDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PositionsDto)
  positions: PositionsDto;
}
