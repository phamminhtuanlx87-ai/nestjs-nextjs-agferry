import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserDepartment, UserPositions } from '../constants/user.constants';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsArray()
  @IsOptional()
  permissions?: string[];

  @IsOptional()
  @IsEnum(Object.keys(UserDepartment), {
    message:
      'Mã phòng ban không hợp lệ. Vui lòng sử dụng các mã như: PKT, PDU, AD, CXD...',
  })
  departmentId?: string; // Đổi tên từ department thành departmentId để phân biệt

  @IsOptional()
  @IsEnum(Object.keys(UserPositions), {
    message:
      'Mã chức vụ không hợp lệ. Vui lòng sử dụng các mã như: CT, TGD, GD, NV...',
  })
  positionId?: string; // Đổi tên từ positions thành positionsId để phân biệt
}
