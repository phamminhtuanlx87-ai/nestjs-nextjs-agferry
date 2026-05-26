import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

// DTO nhỏ cho File đính kèm
class DepartmentDto {
  @IsString()
  id?: string;

  @IsString()
  name?: string;
}

// DTO nhỏ cho File đính kèm
class PositionsDto extends DepartmentDto {}

export class adminDTO {
  @IsString()
  fullName?: string;

  @IsString()
  email?: string;

  @ValidateNested()
  @Type(() => DepartmentDto)
  department?: DepartmentDto;

  @ValidateNested()
  @Type(() => PositionsDto)
  positions?: PositionsDto;

  @IsString()
  role?: string;
}
